/**
 * The Con — Core game composable
 * Conversational social engineering game using Cialdini's 6 principles.
 */
import { ref, computed, reactive } from 'vue'
import { SCAM_TYPES, MARK_DEMOGRAPHICS, MARK_RESPONSES } from '@/data/scenarios'
import { PRINCIPLES, PRINCIPLE_IDS } from '@/data/cialdini'
import {
  MARK_OPENERS, SCAM_CONTEXTS, MARK_PERSONALITIES, LEVEL_CONFIG,
  EMOTION_DISPLAY,
} from '@/data/conDialogue'
import { analyzeMessage } from './useDetectionEngine'
import { getDailySeed, getChallengeNumber, getTodayKey, seededRandom, seededRandInt, seededShuffle } from './useDailySeed'

const STORAGE_PREFIX = 'thecon_'
const MAX_MESSAGE_LENGTH = 300

function safeGetJSON(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}

function safeSetJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* */ }
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

export function useTheCon() {
  const dailySeed = getDailySeed()
  const challengeNumber = getChallengeNumber()
  const todayKey = getTodayKey()
  const storageKey = STORAGE_PREFIX + todayKey

  // ── Mark selection (seeded) ──────────────────────────
  const markIndex = Math.floor(dailySeed / 100) % MARK_DEMOGRAPHICS.length
  const mark = MARK_DEMOGRAPHICS[markIndex]
  const { value: nameFloat } = seededRandom(dailySeed + 888)
  const markName = mark.names[Math.floor(nameFloat * mark.names.length)]

  // ── Level & scam selection ───────────────────────────
  const currentLevel = ref(1)
  const selectedScamId = ref(null)

  const availableScams = computed(() => {
    const level = currentLevel.value
    // Map level to tier: level 1 -> tier 1, level 2 -> tier 2, etc.
    // But also allow lower-tier scams for variety
    return SCAM_TYPES.filter(s => s.tier <= level).sort((a, b) => b.tier - a.tier)
  })

  const selectedScam = computed(() => {
    if (!selectedScamId.value) return null
    return SCAM_TYPES.find(s => s.id === selectedScamId.value) || null
  })

  const scamContext = computed(() => {
    if (!selectedScam.value) return ''
    return SCAM_CONTEXTS[selectedScam.value.id] || ''
  })

  // ── Difficulty config ────────────────────────────────
  const personality = computed(() => MARK_PERSONALITIES[currentLevel.value])
  const levelConfig = computed(() => LEVEL_CONFIG[currentLevel.value])
  const maxTurns = computed(() => levelConfig.value.maxTurns)
  const suspicionThreshold = computed(() => levelConfig.value.suspicionThreshold)

  // ── Game phase ───────────────────────────────────────
  const gamePhase = ref('target_acquired') // 'target_acquired' | 'conversation' | 'debrief'

  // ── Mark state ───────────────────────────────────────
  const markState = reactive({
    resistance: 100,
    suspicion: 0,
    rapport: 0,
    emotionalState: 'neutral',
    turnNumber: 0,
    principleHistory: [],
    isGameOver: false,
    gameResult: null, // 'success' | 'busted' | 'reported' | 'timeout'
    askAttempted: false,
  })

  // ── Conversation ─────────────────────────────────────
  const chatLog = ref([])
  const isProcessing = ref(false)
  const lastAnalysis = ref(null)

  // ── Computed displays ────────────────────────────────
  const resistancePercent = computed(() => Math.round(markState.resistance))
  const suspicionPercent = computed(() => {
    const thresh = suspicionThreshold.value
    return Math.round((markState.suspicion / thresh) * 100)
  })
  const emotionDisplay = computed(() => EMOTION_DISPLAY[markState.emotionalState] || EMOTION_DISPLAY.neutral)

  // Principle usage map: how much each principle has been used
  const principleUsageMap = computed(() => {
    const map = {}
    for (const pid of PRINCIPLE_IDS) {
      const usages = markState.principleHistory.filter(h => h.id === pid)
      const scores = usages.map(h => h.score || 0)
      map[pid] = {
        count: usages.length,
        totalScore: scores.reduce((a, b) => a + b, 0),
        avgScore: usages.length > 0 ? scores.reduce((a, b) => a + b, 0) / usages.length : 0,
        lastUsedTurn: usages.length > 0 ? usages[usages.length - 1].turn : -1,
      }
    }
    return map
  })

  // Dominant strategy
  const dominantStrategy = computed(() => {
    const map = principleUsageMap.value
    let best = null
    let bestCount = 0
    for (const pid of PRINCIPLE_IDS) {
      if (map[pid].count > bestCount) {
        bestCount = map[pid].count
        best = pid
      }
    }
    return best
  })

  // Annotated transcript for debrief
  const annotatedTranscript = computed(() => {
    return chatLog.value.map(entry => ({
      ...entry,
      // Analysis is attached to player messages during sendMessage
    }))
  })

  // ── Mark response selection ──────────────────────────
  function pickMarkResponse(scamId, state) {
    const responses = MARK_RESPONSES[scamId]
    if (!responses) return 'I see...'

    let category
    if (state.suspicion >= suspicionThreshold.value) {
      category = 'suspicious'
    } else if (state.resistance <= 0) {
      category = 'convinced'
    } else if (state.suspicion > suspicionThreshold.value * 0.5) {
      category = Math.random() < 0.6 ? 'concerned' : 'hesitant'
    } else if (state.resistance < 30) {
      category = Math.random() < 0.7 ? 'tempted' : 'interested'
    } else if (state.resistance < 60) {
      category = Math.random() < 0.5 ? 'interested' : 'neutral'
    } else if (state.emotionalState === 'skeptical') {
      category = Math.random() < 0.4 ? 'concerned' : 'neutral'
    } else {
      category = 'neutral'
    }

    const pool = responses[category]
    if (!pool || pool.length === 0) {
      // Fallback chain
      const fallbacks = ['neutral', 'interested', 'concerned']
      for (const fb of fallbacks) {
        if (responses[fb]?.length) return responses[fb][0]
      }
      return 'I see...'
    }

    const { value: idx } = seededRandInt(
      dailySeed + state.turnNumber * 313 + state.resistance * 7,
      0, pool.length - 1
    )
    return pool[idx]
  }

  // ── Actions ──────────────────────────────────────────
  function selectLevel(level) {
    if (gamePhase.value !== 'target_acquired') return
    currentLevel.value = clamp(level, 1, 5)
    selectedScamId.value = null
  }

  function selectScam(scamId) {
    if (gamePhase.value !== 'target_acquired') return
    selectedScamId.value = scamId
  }

  function startConversation() {
    if (gamePhase.value !== 'target_acquired' || !selectedScam.value) return

    const config = levelConfig.value

    // Initialize mark state
    markState.resistance = config.startingResistance
    markState.suspicion = 0
    markState.rapport = 0
    markState.emotionalState = config.startingEmotion
    markState.turnNumber = 0
    markState.principleHistory = []
    markState.isGameOver = false
    markState.gameResult = null
    markState.askAttempted = false

    // Clear chat and add mark opener
    chatLog.value = []
    lastAnalysis.value = null

    const openers = MARK_OPENERS[selectedScam.value.id]
    if (openers && openers.length > 0) {
      const { value: idx } = seededRandInt(dailySeed + currentLevel.value * 77, 0, openers.length - 1)
      chatLog.value.push({
        sender: 'mark',
        text: openers[idx],
        timestamp: Date.now(),
      })
    }

    gamePhase.value = 'conversation'
    saveState()
  }

  function sendMessage(text) {
    if (gamePhase.value !== 'conversation') return
    if (isProcessing.value) return
    if (markState.isGameOver) return

    const trimmed = text.trim().slice(0, MAX_MESSAGE_LENGTH)
    if (!trimmed) return

    isProcessing.value = true

    // Add player message
    chatLog.value.push({
      sender: 'player',
      text: trimmed,
      timestamp: Date.now(),
    })

    // Build context
    const context = {
      scamId: selectedScam.value.id,
      emotionalState: markState.emotionalState,
      resistance: markState.resistance,
      suspicion: markState.suspicion,
      rapport: markState.rapport,
      turnNumber: markState.turnNumber,
      principleHistory: markState.principleHistory,
      personality: personality.value,
    }

    // Analyze
    const result = analyzeMessage(trimmed, context)
    lastAnalysis.value = result

    // Annotate the player message with analysis
    chatLog.value[chatLog.value.length - 1].analysis = result

    // Apply state changes
    markState.resistance = clamp(markState.resistance - result.resistanceImpact, 0, 100)
    markState.suspicion = clamp(markState.suspicion + result.suspicionImpact, 0, 100)
    markState.rapport = clamp(markState.rapport + result.rapportImpact, 0, 100)

    if (result.emotionalShift) {
      markState.emotionalState = result.emotionalShift
    }

    // Record principle
    if (result.dominantPrinciple) {
      markState.principleHistory.push({
        id: result.dominantPrinciple,
        turn: markState.turnNumber,
        score: result.dominantScore,
      })
    }

    markState.turnNumber++

    // Check ask attempt
    if (result.isAskAttempt) {
      markState.askAttempted = true
    }

    // Check win/loss conditions
    let gameEnded = false

    // Win: resistance <= 0 AND ask was attempted
    if (markState.resistance <= 0 && markState.askAttempted) {
      markState.isGameOver = true
      markState.gameResult = 'success'
      gameEnded = true
    }
    // Win: resistance <= 15, ask attempted this turn
    else if (markState.resistance <= 15 && result.isAskAttempt) {
      markState.resistance = 0
      markState.isGameOver = true
      markState.gameResult = 'success'
      gameEnded = true
    }
    // Loss: suspicion >= threshold
    else if (markState.suspicion >= suspicionThreshold.value) {
      markState.isGameOver = true
      markState.gameResult = 'reported'
      gameEnded = true
    }
    // Loss: max turns exceeded
    else if (markState.turnNumber >= maxTurns.value) {
      markState.isGameOver = true
      markState.gameResult = 'timeout'
      gameEnded = true
    }

    // Mark response
    if (gameEnded) {
      const finalCategory = markState.gameResult === 'success' ? 'convinced' : 'suspicious'
      const responses = MARK_RESPONSES[selectedScam.value.id]
      const pool = responses?.[finalCategory] || responses?.neutral || ['...']
      const { value: idx } = seededRandInt(dailySeed + markState.turnNumber * 199, 0, pool.length - 1)
      chatLog.value.push({
        sender: 'mark',
        text: pool[idx],
        timestamp: Date.now(),
      })

      // System message
      const resultMessages = {
        success: 'The mark fell for it. Operation successful.',
        reported: 'The mark got suspicious and ended the conversation.',
        timeout: 'The mark lost interest. Too many turns without closing.',
      }
      chatLog.value.push({
        sender: 'system',
        text: resultMessages[markState.gameResult] || 'Game over.',
        timestamp: Date.now(),
      })

      // Transition to debrief after brief moment
      setTimeout(() => {
        gamePhase.value = 'debrief'
        saveState()
      }, 1500)
    } else {
      // Normal mark response
      const markResponse = pickMarkResponse(selectedScam.value.id, markState)
      chatLog.value.push({
        sender: 'mark',
        text: markResponse,
        timestamp: Date.now(),
      })

      // Occasional system hints
      if (markState.resistance <= 15 && !markState.askAttempted) {
        chatLog.value.push({
          sender: 'system',
          text: 'The mark seems ready. Make your ask.',
          timestamp: Date.now(),
        })
      }
    }

    isProcessing.value = false
    saveState()
  }

  // ── Persistence ──────────────────────────────────────
  function saveState() {
    safeSetJSON(storageKey, {
      gamePhase: gamePhase.value,
      currentLevel: currentLevel.value,
      selectedScamId: selectedScamId.value,
      markState: { ...markState },
      chatLog: chatLog.value,
      lastAnalysis: lastAnalysis.value,
    })
  }

  function loadState() {
    const saved = safeGetJSON(storageKey, null)
    if (!saved) return false

    gamePhase.value = saved.gamePhase
    currentLevel.value = saved.currentLevel || 1
    selectedScamId.value = saved.selectedScamId
    if (saved.markState) {
      Object.assign(markState, saved.markState)
    }
    chatLog.value = saved.chatLog || []
    lastAnalysis.value = saved.lastAnalysis || null
    return true
  }

  // Try restore
  loadState()

  // ── Reset ────────────────────────────────────────────
  function resetGame() {
    try { localStorage.removeItem(storageKey) } catch { /* */ }
    gamePhase.value = 'target_acquired'
    currentLevel.value = 1
    selectedScamId.value = null
    markState.resistance = 100
    markState.suspicion = 0
    markState.rapport = 0
    markState.emotionalState = 'neutral'
    markState.turnNumber = 0
    markState.principleHistory = []
    markState.isGameOver = false
    markState.gameResult = null
    markState.askAttempted = false
    chatLog.value = []
    lastAnalysis.value = null
    isProcessing.value = false
  }

  // ── Share ────────────────────────────────────────────
  function getShareText() {
    const result = markState.gameResult === 'success' ? 'Mark fell for it' : 'Busted'
    const dom = dominantStrategy.value ? PRINCIPLES[dominantStrategy.value]?.name : 'None'
    const scam = selectedScam.value?.name || '?'
    return [
      `The Con #${challengeNumber}`,
      `${scam} vs ${markName} (Level ${currentLevel.value})`,
      `${result} in ${markState.turnNumber} turns`,
      `Dominant tactic: ${dom}`,
      '',
      'scambench.com/con',
    ].join('\n')
  }

  return {
    // Config
    challengeNumber,
    mark,
    markName,
    MAX_MESSAGE_LENGTH,

    // Level/scam selection
    currentLevel,
    selectedScamId,
    availableScams,
    selectedScam,
    scamContext,

    // Difficulty
    personality,
    levelConfig,
    maxTurns,
    suspicionThreshold,

    // Game phase
    gamePhase,

    // Mark state
    markState,
    resistancePercent,
    suspicionPercent,
    emotionDisplay,

    // Conversation
    chatLog,
    isProcessing,
    lastAnalysis,
    principleUsageMap,
    dominantStrategy,
    annotatedTranscript,

    // Actions
    selectLevel,
    selectScam,
    startConversation,
    sendMessage,
    resetGame,
    getShareText,
  }
}
