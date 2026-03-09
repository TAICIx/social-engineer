/**
 * The Mark — Core game composable
 * Defense game: you're the target. Figure out if the caller is a scammer or legit.
 */
import { ref, computed, reactive } from 'vue'
import { SCAM_TYPES, PLAYER_LINES } from '@/data/scenarios'
import {
  MARK_SCENARIOS, LEGIT_LINES, RED_FLAG_PATTERNS,
  PLAYER_INTENT_PATTERNS, MARK_DIFFICULTY, SCAM_PHASES, PHASE_TO_ACTION,
} from '@/data/markDialogue'
import { getDailySeed, getChallengeNumber, getTodayKey, seededRandom, seededRandInt, seededShuffle } from './useDailySeed'

const STORAGE_PREFIX = 'themark_'
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

export function useTheMark() {
  const dailySeed = getDailySeed()
  const challengeNumber = getChallengeNumber()
  const todayKey = getTodayKey()
  const storageKey = STORAGE_PREFIX + todayKey

  // ── Scenario selection (seeded) ──────────────────────
  const scenarioIds = Object.keys(MARK_SCENARIOS)
  const { value: scenFloat } = seededRandom(dailySeed + 555)
  const dailyScenarioId = scenarioIds[Math.floor(scenFloat * scenarioIds.length)]

  // Is it a scam or legit? 50/50 seeded coin flip
  const { value: coinFlip } = seededRandom(dailySeed + 777)
  const dailyIsScam = coinFlip >= 0.5

  // Daily scam type (if it's a scam scenario)
  const scenarioScamTypes = SCAM_TYPES.filter(s => s.id === dailyScenarioId)
  const dailyScamType = scenarioScamTypes.length > 0 ? scenarioScamTypes[0] : SCAM_TYPES[0]

  // ── Game state ──────────────────────────────────────
  const currentLevel = ref(1)
  const gamePhase = ref('briefing') // 'briefing' | 'conversation' | 'debrief'

  // Active game config (set when game starts, may differ from daily for free play)
  const activeScenarioId = ref(dailyScenarioId)
  const activeIsScam = ref(dailyIsScam)

  const callerState = reactive({
    phase: 0,          // index into SCAM_PHASES (for scam bot)
    legitPhase: 0,     // dialogue index for legit bot
    turnNumber: 0,
    playerIntents: [],  // track what the player has been doing
    escalated: false,   // scam bot escalated to capitalize
  })

  const chatLog = ref([])
  const isProcessing = ref(false)
  const redFlags = ref([])       // accumulated red flags detected
  const verdict = ref(null)      // null | 'scam' | 'trust'
  const gameResult = ref(null)   // null | 'correct_scam' | 'correct_legit' | 'fell_for_it' | 'paranoid' | 'timeout'
  const turnAtVerdict = ref(0)

  // ── Computed ────────────────────────────────────────
  const scenario = computed(() => MARK_SCENARIOS[activeScenarioId.value])
  const difficulty = computed(() => MARK_DIFFICULTY[currentLevel.value])
  const scamType = computed(() => SCAM_TYPES.find(s => s.id === activeScenarioId.value) || SCAM_TYPES[0])

  const playerProfile = computed(() => scenario.value?.playerProfile || '')
  const scenarioSetup = computed(() => {
    if (!scenario.value) return ''
    return activeIsScam.value ? scenario.value.scamSetup : scenario.value.legitSetup
  })

  const callerIdentity = computed(() => {
    if (activeIsScam.value) {
      // Scammer uses a fake name
      const { value: nf } = seededRandom(dailySeed + currentLevel.value * 33 + 111)
      const fakeNames = ['Michael', 'Sarah', 'David', 'Jennifer', 'Robert', 'Lisa', 'James', 'Karen']
      return fakeNames[Math.floor(nf * fakeNames.length)]
    } else {
      // Legit person — extract name from opener or use generic
      return scenario.value?.legitCompany || 'Caller'
    }
  })

  const maxTurns = computed(() => difficulty.value.maxTurns)

  const isGameOver = computed(() => gameResult.value !== null)

  // Red flag summary for sidebar
  const redFlagSummary = computed(() => {
    const counts = {}
    for (const flag of redFlags.value) {
      if (!counts[flag.id]) {
        counts[flag.id] = { ...flag, count: 0 }
      }
      counts[flag.id].count++
    }
    return Object.values(counts).sort((a, b) => b.count - a.count)
  })

  // Score calculation
  const score = computed(() => {
    if (!gameResult.value) return 0
    const result = gameResult.value
    const turns = turnAtVerdict.value || callerState.turnNumber
    const threshold = difficulty.value.speedBonusThreshold

    if (result === 'correct_scam') {
      const base = 100
      const speedBonus = turns <= threshold ? 50 : Math.max(0, 30 - (turns - threshold) * 5)
      const levelBonus = currentLevel.value * 20
      return base + speedBonus + levelBonus
    }
    if (result === 'correct_legit') {
      const base = 80
      // Patience bonus: didn't bail too early
      const patienceBonus = turns >= 3 ? 30 : 0
      const levelBonus = currentLevel.value * 15
      return base + patienceBonus + levelBonus
    }
    return 0 // fell_for_it, paranoid, timeout
  })

  // ── Caller bot logic ────────────────────────────────
  function getCallerMessage(playerIntent) {
    if (activeIsScam.value) {
      return getScamCallerMessage(playerIntent)
    } else {
      return getLegitCallerMessage(playerIntent)
    }
  }

  function getScamCallerMessage(playerIntent) {
    const scamId = activeScenarioId.value
    const lines = PLAYER_LINES[scamId]
    if (!lines) return 'Hello?'

    const subtlety = difficulty.value.scamSubtlety

    // Determine phase based on turn + player behavior
    let phase = callerState.phase

    // Player questioning/concerned → scammer deflects (resolve lines) or pushes harder
    if (playerIntent === 'questioning' || playerIntent === 'concerned') {
      // At low subtlety, scammer ignores questions and pushes. At high subtlety, deflects politely
      if (subtlety > 0.5 && lines.resolve) {
        const pool = lines.resolve
        const { value: idx } = seededRandInt(dailySeed + callerState.turnNumber * 137, 0, pool.length - 1)
        // Still advance phase slowly
        if (callerState.phase < SCAM_PHASES.length - 1 && callerState.turnNumber > 2) {
          callerState.phase++
        }
        return pool[idx]
      }
      // Low subtlety: skip to pressure
      if (phase < 2) phase = 2
    }

    // Player willing → advance to capitalize faster
    if (playerIntent === 'willing' && phase < SCAM_PHASES.length - 1) {
      phase = Math.max(phase, 3) // jump to accelerate or capitalize
    }

    // Natural phase progression
    if (callerState.turnNumber >= 2 && phase < 1) phase = 1
    if (callerState.turnNumber >= 3 && phase < 2) phase = 2
    if (callerState.turnNumber >= 5 && phase < 3) phase = 3
    if (callerState.turnNumber >= 7 && phase < 4) phase = 4

    // At high subtlety, slow down progression
    if (subtlety > 0.7) {
      phase = Math.min(phase, Math.floor(callerState.turnNumber / 2))
    }

    phase = clamp(phase, 0, SCAM_PHASES.length - 1)
    callerState.phase = phase

    const phaseName = SCAM_PHASES[phase]
    const actionKey = PHASE_TO_ACTION[phaseName]
    const pool = lines[actionKey]

    if (!pool || pool.length === 0) {
      return lines.soft?.[0] || 'Hello?'
    }

    const { value: idx } = seededRandInt(
      dailySeed + callerState.turnNumber * 271 + phase * 41,
      0, pool.length - 1
    )
    return pool[idx]
  }

  function getLegitCallerMessage(playerIntent) {
    const scamId = activeScenarioId.value
    const lines = LEGIT_LINES[scamId]
    if (!lines) return 'Hello, how can I help?'

    const turn = callerState.turnNumber

    // Legit caller responds to player's attitude
    if (playerIntent === 'questioning' || playerIntent === 'concerned') {
      if (lines.questioned?.length) {
        const idx = Math.min(callerState.legitPhase, lines.questioned.length - 1)
        callerState.legitPhase++
        return lines.questioned[idx]
      }
    }

    // Normal conversation flow
    if (turn >= maxTurns.value - 2 || playerIntent === 'willing') {
      // Wrapping up
      if (lines.closing?.length) {
        const idx = Math.min(turn % lines.closing.length, lines.closing.length - 1)
        return lines.closing[idx]
      }
    }

    if (lines.followup?.length) {
      const idx = Math.min(callerState.legitPhase, lines.followup.length - 1)
      callerState.legitPhase++
      return lines.followup[idx]
    }

    return 'Is there anything else you\'d like to know?'
  }

  // ── Red flag detection on caller messages ───────────
  function detectRedFlags(message) {
    const detected = []
    for (const flag of RED_FLAG_PATTERNS) {
      for (const pattern of flag.patterns) {
        if (pattern.test(message)) {
          detected.push({
            id: flag.id,
            label: flag.label,
            color: flag.color,
            turn: callerState.turnNumber,
            match: message.match(pattern)?.[0] || '',
          })
          break // one match per flag type per message
        }
      }
    }
    return detected
  }

  // ── Player intent detection ─────────────────────────
  function detectPlayerIntent(message) {
    for (const [intent, patterns] of Object.entries(PLAYER_INTENT_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(message)) {
          return intent
        }
      }
    }
    return 'neutral'
  }

  // ── Actions ─────────────────────────────────────────
  function selectLevel(level) {
    if (gamePhase.value !== 'briefing') return
    currentLevel.value = clamp(level, 1, 5)
  }

  function startConversation() {
    if (gamePhase.value !== 'briefing') return

    // Reset state
    callerState.phase = 0
    callerState.legitPhase = 0
    callerState.turnNumber = 0
    callerState.playerIntents = []
    callerState.escalated = false

    chatLog.value = []
    redFlags.value = []
    verdict.value = null
    gameResult.value = null
    turnAtVerdict.value = 0
    isProcessing.value = false

    // Caller opens the conversation
    let openerText
    if (activeIsScam.value) {
      const lines = PLAYER_LINES[activeScenarioId.value]
      // Use soft opener for scam
      const pool = lines?.soft || ['Hello, I\'m calling about your account.']
      const { value: idx } = seededRandInt(dailySeed + currentLevel.value * 99, 0, pool.length - 1)
      openerText = pool[idx]
    } else {
      const lines = LEGIT_LINES[activeScenarioId.value]
      const pool = lines?.opener || ['Hello, how are you today?']
      const { value: idx } = seededRandInt(dailySeed + currentLevel.value * 99, 0, pool.length - 1)
      openerText = pool[idx]
    }

    chatLog.value.push({
      sender: 'caller',
      text: openerText,
      timestamp: Date.now(),
    })

    // Detect red flags in opener
    const flags = detectRedFlags(openerText)
    redFlags.value.push(...flags)

    gamePhase.value = 'conversation'
    saveState()
  }

  function sendMessage(text) {
    if (gamePhase.value !== 'conversation') return
    if (isProcessing.value) return
    if (isGameOver.value) return

    const trimmed = text.trim().slice(0, MAX_MESSAGE_LENGTH)
    if (!trimmed) return

    isProcessing.value = true

    // Add player message
    chatLog.value.push({
      sender: 'player',
      text: trimmed,
      timestamp: Date.now(),
    })

    // Detect player intent
    const intent = detectPlayerIntent(trimmed)
    callerState.playerIntents.push(intent)
    callerState.turnNumber++

    // Check timeout
    if (callerState.turnNumber >= maxTurns.value) {
      gameResult.value = 'timeout'
      turnAtVerdict.value = callerState.turnNumber

      chatLog.value.push({
        sender: 'system',
        text: 'The conversation ended without a verdict. Time ran out.',
        timestamp: Date.now(),
      })

      setTimeout(() => {
        gamePhase.value = 'debrief'
        saveState()
      }, 1200)

      isProcessing.value = false
      return
    }

    // Caller responds
    const callerMsg = getCallerMessage(intent)
    chatLog.value.push({
      sender: 'caller',
      text: callerMsg,
      timestamp: Date.now(),
    })

    // Detect red flags
    const flags = detectRedFlags(callerMsg)
    redFlags.value.push(...flags)
    // Annotate caller message with flags
    chatLog.value[chatLog.value.length - 1].redFlags = flags

    // Hints at high turn counts
    if (callerState.turnNumber >= maxTurns.value - 3) {
      chatLog.value.push({
        sender: 'system',
        text: `${maxTurns.value - callerState.turnNumber} exchanges remaining. Make your call.`,
        timestamp: Date.now(),
      })
    }

    isProcessing.value = false
    saveState()
  }

  function makeVerdict(call) {
    if (gamePhase.value !== 'conversation') return
    if (isGameOver.value) return

    verdict.value = call // 'scam' or 'trust'
    turnAtVerdict.value = callerState.turnNumber

    // Determine result
    if (call === 'scam' && activeIsScam.value) {
      gameResult.value = 'correct_scam'
    } else if (call === 'trust' && !activeIsScam.value) {
      gameResult.value = 'correct_legit'
    } else if (call === 'trust' && activeIsScam.value) {
      gameResult.value = 'fell_for_it'
    } else if (call === 'scam' && !activeIsScam.value) {
      gameResult.value = 'paranoid'
    }

    // Result messages
    const messages = {
      correct_scam: 'You saw through the scam. Well done — you protected yourself.',
      correct_legit: 'Good call. This was a legitimate contact and you handled it well.',
      fell_for_it: 'You trusted a scammer. They would have taken your money or information.',
      paranoid: 'False alarm. This was a legitimate caller — you missed out by being too suspicious.',
    }

    chatLog.value.push({
      sender: 'system',
      text: messages[gameResult.value],
      timestamp: Date.now(),
    })

    setTimeout(() => {
      gamePhase.value = 'debrief'
      saveState()
    }, 1500)
  }

  // ── Persistence ─────────────────────────────────────
  function saveState() {
    safeSetJSON(storageKey, {
      gamePhase: gamePhase.value,
      currentLevel: currentLevel.value,
      activeScenarioId: activeScenarioId.value,
      activeIsScam: activeIsScam.value,
      callerState: { ...callerState },
      chatLog: chatLog.value,
      redFlags: redFlags.value,
      verdict: verdict.value,
      gameResult: gameResult.value,
      turnAtVerdict: turnAtVerdict.value,
    })
  }

  function loadState() {
    const saved = safeGetJSON(storageKey, null)
    if (!saved) return false

    gamePhase.value = saved.gamePhase
    currentLevel.value = saved.currentLevel || 1
    activeScenarioId.value = saved.activeScenarioId || dailyScenarioId
    activeIsScam.value = saved.activeIsScam ?? dailyIsScam
    if (saved.callerState) Object.assign(callerState, saved.callerState)
    chatLog.value = saved.chatLog || []
    redFlags.value = saved.redFlags || []
    verdict.value = saved.verdict
    gameResult.value = saved.gameResult
    turnAtVerdict.value = saved.turnAtVerdict || 0
    return true
  }

  loadState()

  function resetGame() {
    try { localStorage.removeItem(storageKey) } catch { /* */ }
    gamePhase.value = 'briefing'
    currentLevel.value = 1
    activeScenarioId.value = dailyScenarioId
    activeIsScam.value = dailyIsScam
    callerState.phase = 0
    callerState.legitPhase = 0
    callerState.turnNumber = 0
    callerState.playerIntents = []
    callerState.escalated = false
    chatLog.value = []
    redFlags.value = []
    verdict.value = null
    gameResult.value = null
    turnAtVerdict.value = 0
    isProcessing.value = false
  }

  function getShareText() {
    const resultLabels = {
      correct_scam: 'Caught the scam',
      correct_legit: 'Trusted correctly',
      fell_for_it: 'Got scammed',
      paranoid: 'False alarm',
      timeout: 'Ran out of time',
    }
    const label = resultLabels[gameResult.value] || '?'
    const scenName = scamType.value?.name || activeScenarioId.value
    return [
      `The Mark #${challengeNumber}`,
      `${scenName} scenario (Level ${currentLevel.value})`,
      `${label} in ${turnAtVerdict.value || callerState.turnNumber} turns`,
      `Score: ${score.value}`,
      '',
      'scambench.com/mark',
    ].join('\n')
  }

  return {
    challengeNumber,
    dailyScenarioId,
    dailyIsScam,
    MAX_MESSAGE_LENGTH,

    currentLevel,
    gamePhase,
    activeScenarioId,
    activeIsScam,

    scenario,
    difficulty,
    scamType,
    playerProfile,
    scenarioSetup,
    callerIdentity,
    maxTurns,

    callerState,
    chatLog,
    isProcessing,
    redFlags,
    redFlagSummary,
    verdict,
    gameResult,
    isGameOver,
    turnAtVerdict,
    score,

    selectLevel,
    startConversation,
    sendMessage,
    makeVerdict,
    resetGame,
    getShareText,
  }
}
