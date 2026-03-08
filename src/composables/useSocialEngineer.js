/**
 * Social Engineer — Core game logic
 * Faithful adaptation of Torn RPG's "Scamming" crime progress bar.
 */
import { ref, computed } from 'vue'
import { SCAM_TYPES, MARK_DEMOGRAPHICS, MOVEMENT_RANGES, PLAYER_LINES, MARK_RESPONSES } from '@/data/scenarios'
import { getDailySeed, getChallengeNumber, getTodayKey, seededRandom, seededRandInt } from './useDailySeed'

const TOTAL_CELLS = 50
const MAX_ACCEL = 5
const STORAGE_PREFIX = 'socialengineer_'
const MAX_SUSPICION_PIPS = 8

function safeGetJSON(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}

function safeSetJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* */ }
}

// ── Bar generation (seeded, deterministic) ──────────────
function generateBar(seed, scamType) {
  const cells = Array.from({ length: TOTAL_CELLS }, () => 'neutral')
  let s = seed

  const counts = scamType.cells

  function placeGroup(type, count, lo, hi) {
    const available = []
    for (let i = lo; i <= hi && i < TOTAL_CELLS; i++) {
      if (cells[i] === 'neutral' && i !== 0) available.push(i)
    }
    for (let i = available.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280
      const j = Math.floor((s / 233280) * (i + 1))
      ;[available[i], available[j]] = [available[j], available[i]]
    }
    const placed = available.slice(0, Math.min(count, available.length))
    for (const pos of placed) cells[pos] = type
  }

  placeGroup('fail', counts.fail || 2, 42, 49)
  placeGroup('reward_high', counts.reward_high || 2, 35, 48)
  placeGroup('reward_medium', counts.reward_medium || 3, 20, 40)
  placeGroup('reward_low', counts.reward_low || 4, 8, 25)
  placeGroup('concern', counts.concern || 3, 12, 38)
  placeGroup('hesitation', counts.hesitation || 2, 5, 40)
  placeGroup('temptation', counts.temptation || 2, 6, 30)
  placeGroup('sensitivity', counts.sensitivity || 2, 10, 45)

  cells[0] = 'neutral'

  return cells
}

// ── Main composable ─────────────────────────────────────
export function useSocialEngineer() {
  const dailySeed = getDailySeed()
  const challengeNumber = getChallengeNumber()
  const todayKey = getTodayKey()
  const storageKey = STORAGE_PREFIX + todayKey

  // Daily rotation
  const scamIndex = dailySeed % SCAM_TYPES.length
  const markIndex = Math.floor(dailySeed / 100) % MARK_DEMOGRAPHICS.length
  const scamType = SCAM_TYPES[scamIndex]
  const mark = MARK_DEMOGRAPHICS[markIndex]

  // Pick a mark name (seeded)
  const { value: nameFloat } = seededRandom(dailySeed + 777)
  const markName = mark.names[Math.floor(nameFloat * mark.names.length)]

  // Generate seeded fake email
  const EMAIL_DOMAINS = ['mail.trn', 'inbox.trn', 'post.trn', 'web.trn']
  const { value: emailDomainFloat } = seededRandom(dailySeed + 333)
  const emailDomain = EMAIL_DOMAINS[Math.floor(emailDomainFloat * EMAIL_DOMAINS.length)]
  const markEmail = computed(() => `${markName.toLowerCase()}@${emailDomain}`)

  // Mark response data for this scam type
  const markResponses = MARK_RESPONSES[scamType.id] || {}

  // Generate the bar
  const barCells = ref(generateBar(dailySeed, scamType))

  // Game state
  const gamePhase = ref('start') // 'start' | 'playing' | 'ended'
  const position = ref(0)
  const round = ref(0)
  const accelerationStacks = ref(0)
  const isHesitating = ref(false)
  const mustResolveConcern = ref(false)
  const suspicionLine = ref(0)
  const moveHistory = ref([])
  const won = ref(false)
  const endReason = ref('')
  const lastMoveResult = ref(null)
  const capitalizeValue = ref('')

  // v2 mechanics refs
  const suspicionActionCount = ref(-1) // starts at -1 per wiki (first trigger does nothing)
  const concernAttempts = ref(0)

  // Chat log: array of { sender: 'player'|'mark'|'system', text: string }
  const chatLog = ref([])

  // Player dialogue lines for this scam type
  const playerLines = PLAYER_LINES[scamType.id] || {}

  function pickPlayerLine(actionKey, extraSeed = 0) {
    const lines = playerLines[actionKey]
    if (!lines || lines.length === 0) return ''
    const { value: idx } = seededRandInt(
      dailySeed + round.value * 131 + moveHistory.value.length * 17 + extraSeed,
      0, lines.length - 1
    )
    return lines[idx]
  }

  // Pick a contextual mark response based on situation
  function pickMarkResponse(situation, extraSeed = 0) {
    const lines = markResponses[situation]
    if (!lines || lines.length === 0) return ''
    const { value: idx } = seededRandInt(
      dailySeed + round.value * 257 + position.value * 43 + moveHistory.value.length * 19 + extraSeed,
      0, lines.length - 1
    )
    return lines[idx]
  }

  function addChat(sender, text) {
    if (!text) return
    chatLog.value.push({ sender, text, round: round.value })
  }

  // Computed
  const currentCell = computed(() => barCells.value[position.value])
  const isOnReward = computed(() => currentCell.value?.startsWith('reward'))
  const tier = computed(() => scamType.tier)
  const ranges = computed(() => MOVEMENT_RANGES[tier.value])
  const accelLevel = computed(() => Math.min(accelerationStacks.value, MAX_ACCEL))

  const canCapitalize = computed(() =>
    gamePhase.value === 'playing' && isOnReward.value && !mustResolveConcern.value && !isHesitating.value
  )

  const isGameOver = computed(() => gamePhase.value === 'ended')

  // ── Range preview for bar overlays ────────────────────
  const rangePreview = computed(() => {
    const pos = position.value
    const accel = accelLevel.value
    const r = ranges.value
    if (!r) return {}

    function clampRange(range) {
      const [min, max] = range
      const lo = Math.max(0, Math.min(TOTAL_CELLS - 1, pos + min))
      const hi = Math.max(0, Math.min(TOTAL_CELLS - 1, pos + max))
      return [lo, hi]
    }

    const result = {
      back: clampRange(r.back[accel]),
      soft: clampRange(r.soft[accel]),
      strong: clampRange(r.strong[accel]),
    }

    // Accelerated preview: show what NEXT accel level would give for strong
    if (accel < MAX_ACCEL) {
      result.accelerate = clampRange(r.strong[accel + 1])
    } else {
      result.accelerate = clampRange(r.strong[accel])
    }

    return result
  })

  // ── Reward tier indicator ────────────────────────────
  const rewardTierLabel = computed(() => {
    const cell = barCells.value[position.value]
    if (cell === 'reward_high') return '$$$'
    if (cell === 'reward_medium') return '$$'
    if (cell === 'reward_low') return '$'
    return ''
  })

  // ── Persistence ──────────────────────────────────────
  function saveState() {
    safeSetJSON(storageKey, {
      gamePhase: gamePhase.value,
      position: position.value,
      round: round.value,
      accelerationStacks: accelerationStacks.value,
      isHesitating: isHesitating.value,
      mustResolveConcern: mustResolveConcern.value,
      suspicionLine: suspicionLine.value,
      moveHistory: moveHistory.value,
      won: won.value,
      endReason: endReason.value,
      barCells: barCells.value,
      capitalizeValue: capitalizeValue.value,
      suspicionActionCount: suspicionActionCount.value,
      concernAttempts: concernAttempts.value,
      chatLog: chatLog.value,
    })
  }

  function loadState() {
    const saved = safeGetJSON(storageKey, null)
    if (!saved) return false

    gamePhase.value = saved.gamePhase
    position.value = saved.position
    round.value = saved.round
    accelerationStacks.value = saved.accelerationStacks
    isHesitating.value = saved.isHesitating
    mustResolveConcern.value = saved.mustResolveConcern
    suspicionLine.value = saved.suspicionLine
    moveHistory.value = saved.moveHistory || []
    won.value = saved.won
    endReason.value = saved.endReason || ''
    barCells.value = saved.barCells || barCells.value
    capitalizeValue.value = saved.capitalizeValue || ''
    suspicionActionCount.value = saved.suspicionActionCount ?? -1
    concernAttempts.value = saved.concernAttempts || 0
    chatLog.value = saved.chatLog || []
    return true
  }

  // Try to restore
  const restored = loadState()

  // ── Seeded random for moves ──────────────────────────
  function rollInRange(range) {
    const [min, max] = range
    const { value } = seededRandInt(
      dailySeed + round.value * 7919 + position.value * 31 + moveHistory.value.length * 13,
      min, max
    )
    return value
  }

  // ── Suspicion (incremental pip addition, wiki-accurate) ────────────
  // Starts at -1. First trigger increments to 0 (no pips). Then 1, 2, 3... capped at 8.
  // Extra pips: +1 for sensitivity landing, +1 for hesitation timeout, +2 for successful concern resolution.
  function advanceSuspicion(extraPips = 0) {
    suspicionActionCount.value++

    // suspicionActionCount starts at -1, so after first increment it's 0 = no pips added
    const basePips = Math.max(0, suspicionActionCount.value)
    const pipsToAdd = Math.min(basePips + extraPips, MAX_SUSPICION_PIPS)

    if (pipsToAdd <= 0) return false

    const newLine = Math.min(suspicionLine.value + pipsToAdd, TOTAL_CELLS)

    // Convert cells from left to suspicion
    for (let i = suspicionLine.value; i < newLine && i < TOTAL_CELLS; i++) {
      barCells.value[i] = 'suspicion'
    }
    suspicionLine.value = newLine

    // Check if player position is consumed
    if (position.value < suspicionLine.value) {
      endGame(false, 'suspicion')
      return true
    }
    return false
  }

  // ── Remove a cell type at a position (replace with neutral) ────
  function removeCellAt(pos) {
    if (pos >= 0 && pos < TOTAL_CELLS) {
      barCells.value[pos] = 'neutral'
    }
  }

  // ── Cell landing effects ──────────────────────────────
  function handleCellLanding(cellType) {
    if (cellType === 'fail') {
      addChat('system', 'The mark saw through your scam!')
      addChat('mark', pickMarkResponse('suspicious'))
      endGame(false, 'busted')
      return
    }
    if (cellType === 'suspicion') {
      addChat('system', 'Suspicion has consumed your position!')
      endGame(false, 'suspicion')
      return
    }
    if (cellType === 'concern') {
      addChat('mark', pickMarkResponse('concerned'))
      mustResolveConcern.value = true
      concernAttempts.value = 0
      return
    }
    if (cellType === 'hesitation') {
      addChat('mark', pickMarkResponse('hesitant'))
      isHesitating.value = true
      return
    }
    if (cellType === 'temptation') {
      addChat('mark', pickMarkResponse('tempted'))
      addChat('system', 'The mark is hooked! Drifting forward...')
      let newPos = position.value + 1
      while (newPos < TOTAL_CELLS) {
        const ct = barCells.value[newPos]
        if (ct === 'neutral' || ct.startsWith('reward')) break
        newPos++
      }
      if (newPos >= TOTAL_CELLS) {
        endGame(false, 'overshot')
        return
      }
      position.value = newPos
      // Check what we landed on after drift
      const driftCell = barCells.value[newPos]
      if (driftCell.startsWith('reward')) {
        addChat('mark', pickMarkResponse('interested', 1))
      }
      return
    }
    if (cellType === 'sensitivity') {
      addChat('mark', pickMarkResponse('suspicious'))
      addChat('system', 'You hit a nerve! Pushed back...')
      let newPos = position.value - 1
      while (newPos >= suspicionLine.value) {
        if (barCells.value[newPos] === 'neutral') break
        newPos--
      }
      if (newPos < suspicionLine.value) {
        endGame(false, 'suspicion')
        return
      }
      position.value = newPos
      // Extra +1 suspicion for sensitivity
      advanceSuspicion(1)
      return
    }
    // Normal landing (neutral or reward)
    if (cellType?.startsWith('reward')) {
      addChat('mark', pickMarkResponse('interested'))
    } else {
      addChat('mark', pickMarkResponse('neutral'))
    }
  }

  // ── Actions ───────────────────────────────────────────
  function startGame() {
    if (gamePhase.value !== 'start') return
    gamePhase.value = 'playing'
    position.value = 0
    round.value = 1
    accelerationStacks.value = 0
    suspicionActionCount.value = -1
    concernAttempts.value = 0
    chatLog.value = []
    addChat('player', scamType.openingLine)
    addChat('mark', pickMarkResponse('neutral'))
    saveState()
  }

  function move(action) {
    if (gamePhase.value !== 'playing') return null
    if (mustResolveConcern.value && action !== 'resolve_concern') return null

    // Handle hesitation (skip turn)
    if (isHesitating.value) {
      isHesitating.value = false
      // Remove the hesitation cell from the bar
      removeCellAt(position.value)
      addChat('system', 'The mark needs time to think...')
      round.value++
      // +1 extra suspicion for hesitation timeout
      const suspicionEnded = advanceSuspicion(1)
      if (suspicionEnded) return lastMoveResult.value
      addChat('mark', pickMarkResponse('neutral'))
      moveHistory.value.push({ action: 'skip', from: position.value, to: position.value, round: round.value - 1 })
      lastMoveResult.value = { action: 'skip', moved: 0 }
      saveState()
      return lastMoveResult.value
    }

    let delta = 0
    const accel = accelLevel.value

    if (action === 'strong') {
      addChat('player', pickPlayerLine('strong'))
      delta = rollInRange(ranges.value.strong[accel])
      accelerationStacks.value = 0
    } else if (action === 'soft') {
      addChat('player', pickPlayerLine('soft'))
      delta = rollInRange(ranges.value.soft[accel])
      accelerationStacks.value = 0
    } else if (action === 'back') {
      addChat('player', pickPlayerLine('back'))
      delta = rollInRange(ranges.value.back[accel])
      accelerationStacks.value = 0
    } else if (action === 'accelerate') {
      addChat('player', pickPlayerLine('accelerate'))
      if (accelerationStacks.value < MAX_ACCEL) {
        accelerationStacks.value++
      }
      round.value++
      const suspicionEnded = advanceSuspicion()
      if (suspicionEnded) return lastMoveResult.value
      addChat('system', `Pressure building... (${accelerationStacks.value}/${MAX_ACCEL})`)
      moveHistory.value.push({ action: 'accelerate', from: position.value, to: position.value, round: round.value - 1 })
      lastMoveResult.value = { action: 'accelerate', stacks: accelerationStacks.value }
      saveState()
      return lastMoveResult.value
    } else if (action === 'capitalize') {
      return capitalize()
    } else {
      return null
    }

    // Apply directional movement
    const from = position.value
    let newPos = position.value + delta

    // Clamp
    if (newPos < 0) newPos = 0
    if (newPos >= TOTAL_CELLS) {
      endGame(false, 'overshot')
      return lastMoveResult.value
    }

    // Check suspicion boundary
    if (newPos < suspicionLine.value) {
      endGame(false, 'suspicion')
      return lastMoveResult.value
    }

    position.value = newPos
    round.value++

    // Advance suspicion
    const suspicionEnded = advanceSuspicion()
    if (suspicionEnded) return lastMoveResult.value

    // Handle landing
    const landedOn = barCells.value[position.value]
    moveHistory.value.push({ action, from, to: position.value, round: round.value - 1, cell: landedOn })
    lastMoveResult.value = { action, from, to: position.value, delta, cell: landedOn }

    handleCellLanding(landedOn)
    saveState()
    return lastMoveResult.value
  }

  function resolveConcern() {
    if (!mustResolveConcern.value) return null

    concernAttempts.value++
    addChat('player', pickPlayerLine('resolve', concernAttempts.value))

    // Different seed per attempt for fairness
    const { value: roll } = seededRandInt(
      dailySeed + round.value * 3571 + position.value * 97 + concernAttempts.value * 1237,
      0, 100
    )
    const success = roll < (mark.concernSuccessRate * 100)

    if (success) {
      mustResolveConcern.value = false
      // Remove concern cell from bar
      removeCellAt(position.value)
      addChat('mark', pickMarkResponse('convinced'))
      // +2 extra suspicion for successful concern resolution
      round.value++
      const suspicionEnded = advanceSuspicion(2)
      if (suspicionEnded) return lastMoveResult.value
      lastMoveResult.value = { action: 'concern_resolved', success: true }
    } else {
      // Don't end game — keep concern active, advance round + suspicion
      addChat('mark', pickMarkResponse('suspicious', concernAttempts.value))
      addChat('system', 'The mark isn\'t convinced yet. Suspicion advances...')
      round.value++
      const suspicionEnded = advanceSuspicion()
      if (suspicionEnded) return lastMoveResult.value
      lastMoveResult.value = { action: 'concern_failed_attempt', success: false, attempts: concernAttempts.value }
    }

    saveState()
    return lastMoveResult.value
  }

  function capitalize() {
    if (!canCapitalize.value) return null

    addChat('player', pickPlayerLine('capitalize'))

    const cellType = barCells.value[position.value]
    let value = ''
    if (cellType === 'reward_high') value = 'HIGH'
    else if (cellType === 'reward_medium') value = 'MEDIUM'
    else value = 'LOW'

    addChat('mark', pickMarkResponse('convinced'))
    addChat('system', `Scam successful! ${value} reward collected.`)
    capitalizeValue.value = value
    endGame(true, 'capitalized')
    return { action: 'capitalize', value }
  }

  function endGame(didWin, reason) {
    won.value = didWin
    endReason.value = reason
    gamePhase.value = 'ended'
    saveState()
  }

  function resetGame() {
    try { localStorage.removeItem(storageKey) } catch { /* */ }
    barCells.value = generateBar(dailySeed, scamType)
    gamePhase.value = 'start'
    position.value = 0
    round.value = 0
    accelerationStacks.value = 0
    isHesitating.value = false
    mustResolveConcern.value = false
    suspicionLine.value = 0
    moveHistory.value = []
    won.value = false
    endReason.value = ''
    lastMoveResult.value = null
    capitalizeValue.value = ''
    suspicionActionCount.value = -1
    concernAttempts.value = 0
    chatLog.value = []
  }

  // ── Share results ─────────────────────────────────────
  function getShareText() {
    const result = won.value ? `Capitalized (${capitalizeValue.value})` : `Busted (${endReason.value})`
    const bar = barCells.value.map((c, i) => {
      if (i === position.value && won.value) return '\u{1F4B0}'
      if (i === position.value && !won.value) return '\u{1F4A5}'
      if (c === 'suspicion') return '\u{1F7E5}'
      if (c.startsWith('reward')) return '\u{1F7E9}'
      if (c === 'fail') return '\u{1F7E5}'
      if (c === 'concern') return '\u{1F7EA}'
      if (c === 'hesitation') return '\u{1F7E8}'
      return '\u{2B1C}'
    }).join('')

    const rows = []
    for (let i = 0; i < bar.length; i += 10) {
      rows.push(bar.slice(i, i + 10))
    }

    return [
      `Social Engineer #${challengeNumber}`,
      `${scamType.emoji} ${scamType.name} vs ${mark.emoji} ${markName}`,
      `Rounds: ${round.value} | ${result}`,
      '',
      ...rows,
      '',
      'socialengineer.scambench.com',
    ].join('\n')
  }

  return {
    // Config
    scamType,
    mark,
    markName,
    markEmail,
    challengeNumber,
    TOTAL_CELLS,
    MAX_ACCEL,

    // State
    gamePhase,
    barCells,
    position,
    round,
    accelerationStacks,
    accelLevel,
    isHesitating,
    mustResolveConcern,
    suspicionLine,
    moveHistory,
    won,
    endReason,
    lastMoveResult,
    capitalizeValue,
    suspicionActionCount,
    concernAttempts,
    chatLog,

    // Computed
    currentCell,
    isOnReward,
    canCapitalize,
    isGameOver,
    tier,
    rangePreview,
    rewardTierLabel,

    // Actions
    startGame,
    move,
    resolveConcern,
    resetGame,
    getShareText,
  }
}
