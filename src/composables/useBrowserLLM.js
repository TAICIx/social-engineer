/**
 * Browser-side LLM engine using WebLLM.
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  STANDALONE MODULE — not wired into any game yet.               │
 * │  This is ready to plug into The Con or The Mark as a drop-in    │
 * │  replacement for the keyword detection engine. To integrate:    │
 * │                                                                 │
 * │  The Con:  swap analyzeMessage() in useDetectionEngine.js       │
 * │            with generateMarkResponse() from this module.        │
 * │                                                                 │
 * │  The Mark: swap getCallerMessage() in useTheMark.js             │
 * │            with generateCallerMessage() from this module.       │
 * │                                                                 │
 * │  See INTEGRATION GUIDE at the bottom of this file.              │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * Runs entirely in the user's browser via WebGPU. Zero server cost.
 * Model weights are downloaded once and cached in IndexedDB.
 */
import { ref, computed, shallowRef } from 'vue'

// ── Model options (pick one) ──────────────────────────────────
// Smallest usable (879MB): good speed, decent quality
export const MODEL_TINY = 'Llama-3.2-1B-Instruct-q4f16_1-MLC'
// Best quality under 2GB: better roleplay ability
export const MODEL_SMALL = 'SmolLM2-1.7B-Instruct-q4f16_1-MLC'
// Best quality under 3GB: recommended for convincing conversations
export const MODEL_MEDIUM = 'Llama-3.2-3B-Instruct-q4f16_1-MLC'

// Default model — balance of download size vs quality
const DEFAULT_MODEL = MODEL_TINY

// ── Composable ────────────────────────────────────────────────
export function useBrowserLLM(modelId = DEFAULT_MODEL) {
  const engine = shallowRef(null)
  const isLoading = ref(false)
  const isReady = ref(false)
  const loadProgress = ref(0)      // 0-100
  const loadStatus = ref('')       // human-readable status text
  const error = ref(null)
  const isGenerating = ref(false)
  const isSupported = ref(checkWebGPUSupport())

  // ── WebGPU check ──────────────────────────────────────────
  function checkWebGPUSupport() {
    return typeof navigator !== 'undefined' && 'gpu' in navigator
  }

  // ── Load the model ────────────────────────────────────────
  async function loadModel() {
    if (isLoading.value || isReady.value) return
    if (!isSupported.value) {
      error.value = 'WebGPU is not supported in this browser. Use Chrome 113+ with a compatible GPU.'
      return
    }

    isLoading.value = true
    loadProgress.value = 0
    loadStatus.value = 'Initializing...'
    error.value = null

    try {
      // Dynamic import — only loads the WebLLM library when actually needed.
      // This keeps the main bundle small; users who never use the LLM feature
      // never download the ~200KB WebLLM JS library.
      const { CreateMLCEngine } = await import('@mlc-ai/web-llm')

      engine.value = await CreateMLCEngine(modelId, {
        initProgressCallback: (progress) => {
          // progress.progress is 0-1, progress.text is human-readable
          loadProgress.value = Math.round((progress.progress || 0) * 100)
          loadStatus.value = progress.text || 'Loading model...'
        },
      })

      isReady.value = true
      loadStatus.value = 'Ready'
      loadProgress.value = 100
    } catch (e) {
      error.value = e.message || 'Failed to load model'
      console.error('[BrowserLLM] Load failed:', e)
    } finally {
      isLoading.value = false
    }
  }

  // ── Unload the model (free GPU memory) ────────────────────
  async function unloadModel() {
    if (engine.value) {
      try {
        await engine.value.unload()
      } catch { /* */ }
      engine.value = null
    }
    isReady.value = false
    loadProgress.value = 0
    loadStatus.value = ''
  }

  // ── Core chat completion ──────────────────────────────────
  async function chat(messages, options = {}) {
    if (!engine.value || !isReady.value) {
      throw new Error('Model not loaded. Call loadModel() first.')
    }

    isGenerating.value = true

    try {
      const reply = await engine.value.chat.completions.create({
        messages,
        max_tokens: options.maxTokens || 150,
        temperature: options.temperature || 0.8,
        top_p: options.topP || 0.9,
        // Prevent the model from generating overly long responses
        stop: options.stop || ['\n\n', 'User:', 'Player:'],
      })

      return reply.choices[0]?.message?.content?.trim() || ''
    } catch (e) {
      console.error('[BrowserLLM] Chat error:', e)
      throw e
    } finally {
      isGenerating.value = false
    }
  }

  // ── Streaming chat (for typing effect) ────────────────────
  async function chatStream(messages, onChunk, options = {}) {
    if (!engine.value || !isReady.value) {
      throw new Error('Model not loaded. Call loadModel() first.')
    }

    isGenerating.value = true

    try {
      const stream = await engine.value.chat.completions.create({
        messages,
        max_tokens: options.maxTokens || 150,
        temperature: options.temperature || 0.8,
        top_p: options.topP || 0.9,
        stop: options.stop || ['\n\n', 'User:', 'Player:'],
        stream: true,
      })

      let full = ''
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || ''
        full += delta
        if (onChunk) onChunk(delta, full)
      }

      return full.trim()
    } catch (e) {
      console.error('[BrowserLLM] Stream error:', e)
      throw e
    } finally {
      isGenerating.value = false
    }
  }

  // ──────────────────────────────────────────────────────────
  //  GAME-SPECIFIC PROMPT BUILDERS
  //  These build the system prompts for each game mode.
  //  They're here so the integration is copy-paste ready.
  // ──────────────────────────────────────────────────────────

  /**
   * THE CON — Generate a mark's response.
   * The LLM plays the MARK (victim). The player is the scammer.
   *
   * @param {Object} context
   * @param {string} context.markName — "Dorothy", "Alex", etc.
   * @param {string} context.markLabel — "Senior", "Young Adult", etc.
   * @param {string} context.scamName — "Tech Support", "Romance", etc.
   * @param {string} context.scamContext — scenario description
   * @param {string} context.emotionalState — "neutral", "anxious", etc.
   * @param {number} context.resistance — 0-100
   * @param {number} context.suspicion — 0-100
   * @param {number} context.rapport — 0-100
   * @param {Array} context.conversationHistory — [{role, content}]
   * @returns {Promise<string>} mark's response
   */
  async function generateMarkResponse(context) {
    const {
      markName, markLabel, scamName, scamContext,
      emotionalState, resistance, suspicion, rapport,
      conversationHistory,
    } = context

    const systemPrompt = [
      `You are ${markName}, a ${markLabel.toLowerCase()}.`,
      `Someone is trying to scam you with a "${scamName}" scam.`,
      `Scenario: ${scamContext}`,
      '',
      `Your current state:`,
      `- Emotional state: ${emotionalState}`,
      `- Resistance to the scam: ${resistance}% (lower = closer to falling for it)`,
      `- Suspicion: ${suspicion}% (higher = more suspicious of the caller)`,
      `- Rapport with caller: ${rapport}%`,
      '',
      'RULES:',
      '- Stay in character. You are a real person, not an AI.',
      '- Respond in 1-2 sentences. Keep it natural and conversational.',
      '- If your resistance is low, you\'re warming up to what they\'re saying.',
      '- If your suspicion is high, push back, ask questions, express doubt.',
      '- If your resistance is very low (<20%), you\'re nearly convinced.',
      '- If your suspicion is very high (>70%), threaten to hang up or call police.',
      '- Never break character. Never mention being an AI or playing a game.',
      '- Match the emotional state in your tone.',
    ].join('\n')

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
    ]

    return chat(messages, { maxTokens: 100, temperature: 0.85 })
  }

  /**
   * THE MARK — Generate a caller's message.
   * The LLM plays the CALLER (scammer or legit person). The player is the target.
   *
   * @param {Object} context
   * @param {boolean} context.isScam — true if caller is a scammer
   * @param {string} context.scenarioId — "delivery", "tech_support", etc.
   * @param {string} context.scamName — "Fake Delivery", etc.
   * @param {string} context.scamContext — scenario description
   * @param {string} context.playerProfile — "You ordered a laptop online..."
   * @param {string} context.callerName — fake name the caller uses
   * @param {number} context.turnNumber — current turn
   * @param {number} context.maxTurns — max turns in game
   * @param {number} context.subtlety — 0-1, how subtle the scam is (higher = harder to detect)
   * @param {string} context.playerLastIntent — "questioning", "willing", etc.
   * @param {Array} context.conversationHistory — [{role, content}]
   * @returns {Promise<string>} caller's response
   */
  async function generateCallerMessage(context) {
    const {
      isScam, scenarioId, scamName, scamContext, playerProfile,
      callerName, turnNumber, maxTurns, subtlety,
      playerLastIntent, conversationHistory,
    } = context

    let systemPrompt

    if (isScam) {
      const phase = turnNumber < 2 ? 'building rapport'
        : turnNumber < 4 ? 'establishing credibility'
        : turnNumber < 6 ? 'applying pressure'
        : 'going for the close (asking for money/info)'

      systemPrompt = [
        `You are a scammer named ${callerName} running a "${scamName}" scam.`,
        `Your target's situation: ${playerProfile}`,
        `Scenario: ${scamContext}`,
        '',
        `Current phase: ${phase} (turn ${turnNumber + 1} of ${maxTurns})`,
        `Subtlety level: ${Math.round(subtlety * 100)}% (higher = more polished, fewer obvious red flags)`,
        '',
        `The target's last attitude was: ${playerLastIntent || 'neutral'}`,
        '',
        'RULES:',
        '- Stay in character as the scammer. You are trying to deceive this person.',
        '- Respond in 1-3 sentences. Sound like a real phone call or message.',
        subtlety > 0.6
          ? '- Be smooth and professional. Avoid obvious pressure tactics early on.'
          : '- You can use pressure, urgency, and emotional manipulation.',
        '- If the target questions you, deflect or provide fake credentials.',
        '- If the target seems willing, move toward asking for payment/info.',
        '- If the target is resistant, try a different approach or increase pressure.',
        '- In later turns, work toward extracting money or personal information.',
        '- Never admit you\'re a scammer. Never break character.',
        '- Never mention being an AI or playing a game.',
      ].join('\n')
    } else {
      systemPrompt = [
        `You are ${callerName}, a legitimate professional contacting someone.`,
        `Their situation: ${playerProfile}`,
        `Scenario: ${scamContext}`,
        '',
        'RULES:',
        '- You are a REAL, LEGITIMATE person. Not a scammer.',
        '- Respond in 1-2 sentences. Be professional and natural.',
        '- If they ask to verify you, happily provide real credentials, website, phone number.',
        '- If they seem suspicious, be understanding — don\'t pressure them.',
        '- Never ask for sensitive information (SSN, passwords, credit cards) over the phone.',
        '- If they want to call back through official channels, encourage that.',
        '- Be patient. Don\'t create urgency. Don\'t use emotional manipulation.',
        '- Never break character. Never mention being an AI or playing a game.',
      ].join('\n')
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
    ]

    return chat(messages, { maxTokens: 120, temperature: 0.8 })
  }

  return {
    // State
    engine,
    isLoading,
    isReady,
    isSupported,
    loadProgress,
    loadStatus,
    error,
    isGenerating,

    // Actions
    loadModel,
    unloadModel,
    chat,
    chatStream,

    // Game-specific generators (ready to plug in)
    generateMarkResponse,
    generateCallerMessage,
  }
}


/* ════════════════════════════════════════════════════════════════
 *  INTEGRATION GUIDE
 * ════════════════════════════════════════════════════════════════
 *
 *  This module is intentionally NOT connected to any game.
 *  Below are the exact steps to wire it in when ready.
 *
 *  ─── THE CON (you're the scammer, LLM is the mark) ───────
 *
 *  In useTheCon.js, the mark currently responds via pickMarkResponse()
 *  which selects from MARK_RESPONSES. To swap in the LLM:
 *
 *  1. Import at the top of useTheCon.js:
 *     import { useBrowserLLM } from './useBrowserLLM'
 *
 *  2. Inside useTheCon(), initialize:
 *     const { isReady, loadModel, generateMarkResponse, isGenerating } = useBrowserLLM()
 *
 *  3. In startConversation(), call loadModel() (or let the player trigger it)
 *
 *  4. In sendMessage(), replace the pickMarkResponse() call with:
 *     const markResponse = await generateMarkResponse({
 *       markName,
 *       markLabel: mark.label,
 *       scamName: selectedScam.value.name,
 *       scamContext: scamContext.value,
 *       emotionalState: markState.emotionalState,
 *       resistance: markState.resistance,
 *       suspicion: markState.suspicion,
 *       rapport: markState.rapport,
 *       conversationHistory: chatLog.value.map(m => ({
 *         role: m.sender === 'player' ? 'user' : 'assistant',
 *         content: m.text,
 *       })),
 *     })
 *
 *  5. Keep the keyword detection engine for the SIDEBAR analysis —
 *     it still detects which principles the player used.
 *     The LLM replaces the mark's RESPONSE, not the detection.
 *
 *  ─── THE MARK (you're the target, LLM is the caller) ─────
 *
 *  In useTheMark.js, the caller responds via getCallerMessage().
 *  To swap in the LLM:
 *
 *  1. Import: import { useBrowserLLM } from './useBrowserLLM'
 *
 *  2. Initialize: const { isReady, loadModel, generateCallerMessage } = useBrowserLLM()
 *
 *  3. In sendMessage(), replace getCallerMessage(intent) with:
 *     const callerMsg = await generateCallerMessage({
 *       isScam: activeIsScam.value,
 *       scenarioId: activeScenarioId.value,
 *       scamName: scamType.value.name,
 *       scamContext: scenario.value.scamSetup,
 *       playerProfile: playerProfile.value,
 *       callerName: callerIdentity.value,
 *       turnNumber: callerState.turnNumber,
 *       maxTurns: maxTurns.value,
 *       subtlety: difficulty.value.scamSubtlety,
 *       playerLastIntent: intent,
 *       conversationHistory: chatLog.value
 *         .filter(m => m.sender !== 'system')
 *         .map(m => ({
 *           role: m.sender === 'player' ? 'user' : 'assistant',
 *           content: m.text,
 *         })),
 *     })
 *
 *  4. Keep the red flag detection — it still scans caller messages
 *     for manipulation patterns. The LLM replaces the scripted
 *     response, not the analysis.
 *
 * ═══════════════════════════════════════════════════════════════ */
