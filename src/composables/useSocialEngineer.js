/**
 * Social Engineer — Core game logic
 * Faithful adaptation of Torn RPG's "Scamming" crime progress bar.
 */
import { ref, computed, reactive } from 'vue'
import { SCAM_TYPES, MARK_DEMOGRAPHICS, MOVEMENT_RANGES, SUSPICION_THRESHOLDS } from '@/data/scenarios'
import { getDailySeed, getChallengeNumber, getTodayKey, seededRandom, seededRandInt } from './useDailySeed'

const TOTAL_CELLS = 50
const MAX_ACCEL = 5
const STORAGE_PREFIX = 'socialengineer_'

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

  // Helper: place N cells of a type within [lo, hi], avoiding already-placed non-neutral cells
  function placeGroup(type, count, lo, hi) {
    // Collect available positions
    const available = []
    for (let i = lo; i <= hi && i < TOTAL_CELLS; i++) {
      if (cells[i] === 'neutral' && i !== 0) available.push(i)
    }
    // Seeded shuffle to pick positions
    for (let i = available.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280
      const j = Math.floor((s / 233280) * (i + 1))
      ;[available[i], available[j]] = [available[j], available[i]]
    }
    const placed = available.slice(0, Math.min(count, available.length))
    for (const pos of placed) cells[pos] = type
  }

  // Place in order (later placements respect earlier ones)
  placeGroup('fail', counts.fail || 2, 42, 49)
  placeGroup('reward_high', counts.reward_high || 2, 35, 48)
  placeGroup('reward_medium', counts.reward_medium || 3, 20, 40)
  placeGroup('reward_low', counts.reward_low || 4, 8, 25)
  placeGroup('concern', counts.concern || 3, 12, 38)
  placeGroup('hesitation', counts.hesitation || 2, 5, 40)
  placeGroup('temptation', counts.temptation || 2, 6, 30)
  placeGroup('sensitivity', counts.sensitivity || 2, 10, 45)

  // Cell 0 always neutral (start)
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

  // Generate the bar
  const barCells = ref(generateBar(dailySeed, scamType))

  // Game state
  const gamePhase = ref('start') // 'start' | 'playing' | 'ended'
  const position = ref(0)
  const round = ref(0)
  const accelerationStacks = ref(0)
  const isHesitating = ref(false)
  const mustResolveConcern = ref(false)
  const suspicionLine = ref(0) // how many cells from left are consumed
  const moveHistory = ref([])
  const won = ref(false)
  const endReason = ref('')
  const markReaction = ref('')
  const lastMoveResult = ref(null)
  const capitalizeValue = ref('')

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
    return true
  }

  // Try to restore
  const restored = loadState()

  // ── Seeded random for moves ──────────────────────────
  function getMoveRandom() {
    const moveSeed = dailySeed + round.value * 7919 + position.value * 31 + moveHistory.value.length * 13
    return seededRandInt(moveSeed, 0, 10000)
  }

  function rollInRange(range) {
    const [min, max] = range
    const { value } = seededRandInt(
      dailySeed + round.value * 7919 + position.value * 31 + moveHistory.value.length * 13,
      min, max
    )
    return value
  }

  // ── Mark reactions ────────────────────────────────────
  function updateReaction(cellType) {
    if (cellType === 'concern') {
      markReaction.value = mark.reactions.concerned
    } else if (cellType === 'hesitation') {
      markReaction.value = mark.reactions.hesitant
    } else if (cellType?.startsWith('reward')) {
      markReaction.value = mark.reactions.interested
    } else if (cellType === 'temptation') {
      markReaction.value = mark.reactions.convinced
    } else if (cellType === 'sensitivity') {
      markReaction.value = mark.reactions.suspicious
    } else {
      markReaction.value = mark.reactions.neutral
    }
  }

  // ── Suspicion ─────────────────────────────────────────
  function advanceSuspicion() {
    const thresholdIndex = Math.min(round.value, SUSPICION_THRESHOLDS.length - 1)
    const target = SUSPICION_THRESHOLDS[thresholdIndex]
    // Convert cells from left to suspicion
    for (let i = suspicionLine.value; i < target && i < TOTAL_CELLS; i++) {
      barCells.value[i] = 'suspicion'
    }
    suspicionLine.value = target

    // Check if player position is consumed
    if (position.value < suspicionLine.value) {
      endGame(false, 'suspicion')
      return true
    }
    return false
  }

  // ── Cell landing effects ──────────────────────────────
  function handleCellLanding(cellType) {
    updateReaction(cellType)

    if (cellType === 'fail') {
      endGame(false, 'busted')
      return
    }
    if (cellType === 'suspicion') {
      endGame(false, 'suspicion')
      return
    }
    if (cellType === 'concern') {
      mustResolveConcern.value = true
      return
    }
    if (cellType === 'hesitation') {
      isHesitating.value = true
      return
    }
    if (cellType === 'temptation') {
      // Auto-drift forward, skipping hazards — find next neutral or reward
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
      // Don't re-handle the landing cell from temptation drift (it's safe)
      updateReaction(barCells.value[newPos])
      return
    }
    if (cellType === 'sensitivity') {
      // Auto-drift backward to nearest neutral
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
      updateReaction('neutral')
      return
    }
  }

  // ── Actions ───────────────────────────────────────────
  function startGame() {
    if (gamePhase.value !== 'start') return
    gamePhase.value = 'playing'
    position.value = 0
    round.value = 1
    accelerationStacks.value = 0
    markReaction.value = scamType.openingLine
    saveState()
  }

  function move(action) {
    if (gamePhase.value !== 'playing') return null
    if (mustResolveConcern.value && action !== 'resolve_concern') return null

    // Handle hesitation (skip turn)
    if (isHesitating.value) {
      isHesitating.value = false
      round.value++
      const suspicionEnded = advanceSuspicion()
      if (suspicionEnded) return lastMoveResult.value
      moveHistory.value.push({ action: 'skip', from: position.value, to: position.value, round: round.value - 1 })
      lastMoveResult.value = { action: 'skip', moved: 0 }
      saveState()
      return lastMoveResult.value
    }

    let delta = 0
    const accel = accelLevel.value

    if (action === 'strong') {
      delta = rollInRange(ranges.value.strong[accel])
      accelerationStacks.value = 0
    } else if (action === 'soft') {
      delta = rollInRange(ranges.value.soft[accel])
      accelerationStacks.value = 0
    } else if (action === 'back') {
      delta = rollInRange(ranges.value.back[accel])
      accelerationStacks.value = 0
    } else if (action === 'accelerate') {
      if (accelerationStacks.value < MAX_ACCEL) {
        accelerationStacks.value++
      }
      round.value++
      const suspicionEnded = advanceSuspicion()
      if (suspicionEnded) return lastMoveResult.value
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

    // Roll against mark's concern success rate
    const { value: roll } = seededRandInt(
      dailySeed + round.value * 3571 + position.value * 97,
      0, 100
    )
    const success = roll < (mark.concernSuccessRate * 100)

    if (success) {
      mustResolveConcern.value = false
      markReaction.value = mark.reactions.convinced
      lastMoveResult.value = { action: 'concern_resolved', success: true }
    } else {
      endGame(false, 'concern_failed')
      return lastMoveResult.value
    }

    saveState()
    return lastMoveResult.value
  }

  function capitalize() {
    if (!canCapitalize.value) return null

    const cellType = barCells.value[position.value]
    let value = ''
    if (cellType === 'reward_high') value = 'HIGH'
    else if (cellType === 'reward_medium') value = 'MEDIUM'
    else value = 'LOW'

    capitalizeValue.value = value
    endGame(true, 'capitalized')
    return { action: 'capitalize', value }
  }

  function endGame(didWin, reason) {
    won.value = didWin
    endReason.value = reason
    gamePhase.value = 'ended'
    if (didWin) {
      markReaction.value = mark.reactions.convinced
    } else if (reason === 'concern_failed') {
      markReaction.value = mark.reactions.suspicious
    } else {
      markReaction.value = ''
    }
    saveState()
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

    // Split bar into rows of 10 for readability
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
    markReaction,
    lastMoveResult,
    capitalizeValue,

    // Computed
    currentCell,
    isOnReward,
    canCapitalize,
    isGameOver,
    tier,

    // Actions
    startGame,
    move,
    resolveConcern,
    getShareText,
  }
}
