/**
 * The Operator — Core game composable
 * Forked from useSocialEngineer.js with tactical UI enhancements:
 *   - 3 daily scam choices (seeded, no duplicates)
 *   - Vulnerability radar data computed from cell distributions
 *   - Threat level percentage instead of pip count
 *   - All underlying mechanics preserved exactly
 */
import { ref, computed, reactive } from 'vue'
import { SCAM_TYPES, MARK_DEMOGRAPHICS, MOVEMENT_RANGES, PLAYER_LINES, MARK_RESPONSES, NARRATIVE_TEMPLATES, RESPONSE_TYPE_NAMES, CELL_TYPES } from '@/data/scenarios'
import { getDailySeed, getChallengeNumber, getTodayKey, seededRandom, seededRandInt, seededShuffle } from './useDailySeed'

const TOTAL_CELLS = 50
const MAX_ACCEL = 5
const STORAGE_PREFIX = 'operator_'
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

// ── Compute 3 daily scam choices (seeded, no dupes) ──────
function getDailyScamChoices(seed) {
  const shuffled = seededShuffle(
    SCAM_TYPES.map((s, i) => i),
    seed + 42
  )
  return shuffled.slice(0, 3).map(i => SCAM_TYPES[i])
}

// ── Vulnerability radar from cell distribution ───────────
function computeVulnerability(scamType) {
  const c = scamType.cells
  const total = Object.values(c).reduce((a, b) => a + b, 0)
  return {
    reward: Math.round(((c.reward_low + c.reward_medium + c.reward_high) / total) * 100),
    risk: Math.round(((c.fail + c.sensitivity) / total) * 100),
    volatility: Math.round(((c.concern + c.hesitation) / total) * 100),
    opportunity: Math.round(((c.temptation + c.reward_high) / total) * 100),
  }
}

// ── Main composable ─────────────────────────────────────
export function useOperator() {
  const dailySeed = getDailySeed()
  const challengeNumber = getChallengeNumber()
  const todayKey = getTodayKey()
  const storageKey = STORAGE_PREFIX + todayKey

  // 3 daily scam choices
  const scamChoices = getDailyScamChoices(dailySeed)

  // Default mark selection
  const markIndex = Math.floor(dailySeed / 100) % MARK_DEMOGRAPHICS.length
  const mark = MARK_DEMOGRAPHICS[markIndex]

  // Pick a mark name (seeded)
  const { value: nameFloat } = seededRandom(dailySeed + 777)
  const markName = mark.names[Math.floor(nameFloat * mark.names.length)]

  // Generate seeded fake email
  const EMAIL_DOMAINS = ['mail.trn', 'inbox.trn', 'post.trn', 'web.trn']
  const { value: emailDomainFloat } = seededRandom(dailySeed + 333)
  const emailDomain = EMAIL_DOMAINS[Math.floor(emailDomainFloat * EMAIL_DOMAINS.length)]
  const markEmail = computed(() => `${markName.toLowerCase().replace(/\s/g, '.')}@${emailDomain}`)

  // Selected scam (player picks from 3)
  const selectedScamIndex = ref(null)
  const scamType = computed(() => {
    if (selectedScamIndex.value !== null) return scamChoices[selectedScamIndex.value]
    return scamChoices[0]
  })

  // Vulnerability data for each choice
  const vulnerabilities = scamChoices.map(computeVulnerability)

  // Mark response data (reactive, depends on selected scam)
  const markResponses = computed(() => MARK_RESPONSES[scamType.value.id] || {})
  const narrativeTemplates = computed(() => NARRATIVE_TEMPLATES[scamType.value.id] || NARRATIVE_TEMPLATES._default)
  const defaultTemplates = NARRATIVE_TEMPLATES._default
  const responseTypeNames = computed(() => RESPONSE_TYPE_NAMES[scamType.value.id] || { strong: 'Strong', soft: 'Soft', back: 'Cautious', accelerate: 'Pressure' })
  const playerLines = computed(() => PLAYER_LINES[scamType.value.id] || {})

  // Generate the bar (regenerated when scam selected)
  const barCells = ref([])

  // Game state
  const gamePhase = ref('briefing') // 'briefing' | 'playing' | 'ended'
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

  // v2 mechanics
  const suspicionActionCount = ref(-1)
  const concernAttempts = ref(0)

  // Operation log: array of { type, text, label, round }
  const opLog = ref([])

  // Story text (current narrative)
  const storyText = ref('')
  const storyLabel = ref('')

  // Threat level as percentage (0-100)
  const threatLevel = computed(() => Math.round((suspicionLine.value / TOTAL_CELLS) * 100))

  // Composure indicator based on emotional state
  const markComposure = computed(() => {
    if (mustResolveConcern.value) return 'alarmed'
    if (isHesitating.value) return 'uncertain'
    if (threatLevel.value > 50) return 'suspicious'
    if (threatLevel.value > 25) return 'wary'
    return 'engaged'
  })

  function pickNarrative(situation, vars = {}, extraSeed = 0) {
    const templates = narrativeTemplates.value[situation] || defaultTemplates[situation]
    if (!templates || templates.length === 0) return ''
    const { value: idx } = seededRandInt(
      dailySeed + round.value * 347 + position.value * 61 + moveHistory.value.length * 23 + extraSeed,
      0, templates.length - 1
    )
    let text = templates[idx]
    text = text.replace(/\{mark\}/g, vars.mark || markName)
    text = text.replace(/\{email\}/g, vars.email || markEmail.value)
    text = text.replace(/\{scam\}/g, vars.scam || scamType.value.name)
    text = text.replace(/\{playerLine\}/g, vars.playerLine || '')
    text = text.replace(/\{markLine\}/g, vars.markLine || '')
    text = text.replace(/\{reward\}/g, vars.reward || '')
    return text
  }

  function setNarrative(text, label) {
    storyText.value = text
    storyLabel.value = label
    if (text) {
      opLog.value.push({ type: 'narrative', text, label, round: round.value })
    }
  }

  function pickPlayerLine(actionKey, extraSeed = 0) {
    const lines = playerLines.value[actionKey]
    if (!lines || lines.length === 0) return ''
    const { value: idx } = seededRandInt(
      dailySeed + round.value * 131 + moveHistory.value.length * 17 + extraSeed,
      0, lines.length - 1
    )
    return lines[idx]
  }

  function pickMarkResponse(situation, extraSeed = 0) {
    const lines = markResponses.value[situation]
    if (!lines || lines.length === 0) return ''
    const { value: idx } = seededRandInt(
      dailySeed + round.value * 257 + position.value * 43 + moveHistory.value.length * 19 + extraSeed,
      0, lines.length - 1
    )
    return lines[idx]
  }

  function addLog(type, text) {
    if (!text) return
    opLog.value.push({ type, text, round: round.value })
  }

  // Last mark line for readout display
  const lastMarkLine = ref('')

  // Computed
  const currentCell = computed(() => barCells.value[position.value])
  const isOnReward = computed(() => currentCell.value?.startsWith('reward'))
  const tier = computed(() => scamType.value.tier)
  const ranges = computed(() => MOVEMENT_RANGES[tier.value])
  const accelLevel = computed(() => Math.min(accelerationStacks.value, MAX_ACCEL))

  const canCapitalize = computed(() =>
    gamePhase.value === 'playing' && isOnReward.value && !mustResolveConcern.value && !isHesitating.value
  )

  // Range preview
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

    if (accel < MAX_ACCEL) {
      result.accelerate = clampRange(r.strong[accel + 1])
    } else {
      result.accelerate = clampRange(r.strong[accel])
    }

    return result
  })

  // Range numbers for tactic cards
  const tacticRanges = computed(() => {
    const accel = accelLevel.value
    const r = ranges.value
    if (!r) return {}
    return {
      strong: r.strong[accel],
      soft: r.soft[accel],
      back: r.back[accel],
      accelerate: accel < MAX_ACCEL ? r.strong[accel + 1] : r.strong[accel],
    }
  })

  const rewardTierLabel = computed(() => {
    const cell = barCells.value[position.value]
    if (cell === 'reward_high') return 'HIGH'
    if (cell === 'reward_medium') return 'MED'
    if (cell === 'reward_low') return 'LOW'
    return ''
  })

  // ── Persistence ──────────────────────────────────────
  function saveState() {
    safeSetJSON(storageKey, {
      gamePhase: gamePhase.value,
      selectedScamIndex: selectedScamIndex.value,
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
      opLog: opLog.value,
      storyText: storyText.value,
      storyLabel: storyLabel.value,
      lastMarkLine: lastMarkLine.value,
    })
  }

  function loadState() {
    const saved = safeGetJSON(storageKey, null)
    if (!saved) return false

    gamePhase.value = saved.gamePhase
    selectedScamIndex.value = saved.selectedScamIndex ?? null
    position.value = saved.position
    round.value = saved.round
    accelerationStacks.value = saved.accelerationStacks
    isHesitating.value = saved.isHesitating
    mustResolveConcern.value = saved.mustResolveConcern
    suspicionLine.value = saved.suspicionLine
    moveHistory.value = saved.moveHistory || []
    won.value = saved.won
    endReason.value = saved.endReason || ''
    barCells.value = saved.barCells || []
    capitalizeValue.value = saved.capitalizeValue || ''
    suspicionActionCount.value = saved.suspicionActionCount ?? -1
    concernAttempts.value = saved.concernAttempts || 0
    opLog.value = saved.opLog || []
    storyText.value = saved.storyText || ''
    storyLabel.value = saved.storyLabel || ''
    lastMarkLine.value = saved.lastMarkLine || ''
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

  // ── Suspicion ────────────────────────────────────────
  function advanceSuspicion(extraPips = 0) {
    suspicionActionCount.value++
    const basePips = Math.max(0, suspicionActionCount.value)
    const pipsToAdd = Math.min(basePips + extraPips, MAX_SUSPICION_PIPS)

    if (pipsToAdd <= 0) return false

    const newLine = Math.min(suspicionLine.value + pipsToAdd, TOTAL_CELLS)

    for (let i = suspicionLine.value; i < newLine && i < TOTAL_CELLS; i++) {
      barCells.value[i] = 'suspicion'
    }
    suspicionLine.value = newLine

    if (position.value < suspicionLine.value) {
      endGame(false, 'suspicion')
      return true
    }
    return false
  }

  function removeCellAt(pos) {
    if (pos >= 0 && pos < TOTAL_CELLS) {
      barCells.value[pos] = 'neutral'
    }
  }

  // ── Cell landing effects ──────────────────────────────
  function handleCellLanding(cellType, actionKey = '') {
    if (cellType === 'fail') {
      const markLine = pickMarkResponse('suspicious')
      lastMarkLine.value = markLine
      addLog('system', 'Cover blown. Mark identified the operation.')
      addLog('mark', markLine)
      setNarrative(pickNarrative('fail', { markLine }), 'COMPROMISED')
      endGame(false, 'busted')
      return
    }
    if (cellType === 'suspicion') {
      addLog('system', 'Threat level critical. Position consumed.')
      setNarrative(pickNarrative('suspicion'), 'COMPROMISED')
      endGame(false, 'suspicion')
      return
    }
    if (cellType === 'concern') {
      const markLine = pickMarkResponse('concerned')
      lastMarkLine.value = markLine
      addLog('mark', markLine)
      setNarrative(pickNarrative('concern', { markLine }), 'ALERT: CONCERN')
      mustResolveConcern.value = true
      concernAttempts.value = 0
      return
    }
    if (cellType === 'hesitation') {
      const markLine = pickMarkResponse('hesitant')
      lastMarkLine.value = markLine
      addLog('mark', markLine)
      setNarrative(pickNarrative('hesitation', { markLine }), 'ALERT: HESITATION')
      isHesitating.value = true
      return
    }
    if (cellType === 'temptation') {
      const markLine = pickMarkResponse('tempted')
      lastMarkLine.value = markLine
      addLog('mark', markLine)
      addLog('system', 'Mark engaged. Drifting forward...')
      setNarrative(pickNarrative('temptation', { markLine }), 'OPPORTUNITY')
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
      const driftCell = barCells.value[newPos]
      if (driftCell.startsWith('reward')) {
        const ml = pickMarkResponse('interested', 1)
        lastMarkLine.value = ml
        addLog('mark', ml)
      }
      return
    }
    if (cellType === 'sensitivity') {
      const markLine = pickMarkResponse('suspicious')
      lastMarkLine.value = markLine
      addLog('mark', markLine)
      addLog('system', 'Nerve struck. Pushed back.')
      setNarrative(pickNarrative('sensitivity', { markLine }), 'ALERT: SENSITIVITY')
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
      advanceSuspicion(1)
      return
    }
    // Normal landing
    if (cellType?.startsWith('reward')) {
      const markLine = pickMarkResponse('interested')
      lastMarkLine.value = markLine
      addLog('mark', markLine)
      setNarrative(pickNarrative('reward_landing', { markLine }), responseTypeNames.value[actionKey] || 'RESPOND')
    } else {
      const markLine = pickMarkResponse('neutral')
      lastMarkLine.value = markLine
      addLog('mark', markLine)
      setNarrative(pickNarrative('neutral', { markLine }), responseTypeNames.value[actionKey] || 'RESPOND')
    }
  }

  // ── Actions ───────────────────────────────────────────
  function selectScam(index) {
    if (gamePhase.value !== 'briefing') return
    selectedScamIndex.value = index
  }

  function acceptMission() {
    if (gamePhase.value !== 'briefing' || selectedScamIndex.value === null) return
    barCells.value = generateBar(dailySeed + selectedScamIndex.value * 1000, scamType.value)
    gamePhase.value = 'playing'
    position.value = 0
    round.value = 1
    accelerationStacks.value = 0
    suspicionActionCount.value = -1
    concernAttempts.value = 0
    opLog.value = []

    const playerLine = scamType.value.openingLine
    addLog('player', playerLine)
    const markLine = pickMarkResponse('neutral')
    lastMarkLine.value = markLine
    addLog('mark', markLine)
    setNarrative(pickNarrative('email_read'), 'CONTACT INITIATED')
    saveState()
  }

  function move(action) {
    if (gamePhase.value !== 'playing') return null
    if (mustResolveConcern.value && action !== 'resolve_concern') return null

    // Handle hesitation
    if (isHesitating.value) {
      isHesitating.value = false
      removeCellAt(position.value)
      addLog('system', 'Mark processing... standby.')
      round.value++
      const suspicionEnded = advanceSuspicion(1)
      if (suspicionEnded) return lastMoveResult.value
      const markLine = pickMarkResponse('neutral')
      lastMarkLine.value = markLine
      addLog('mark', markLine)
      setNarrative(pickNarrative('neutral', { markLine }), 'STANDBY')
      moveHistory.value.push({ action: 'skip', from: position.value, to: position.value, round: round.value - 1 })
      lastMoveResult.value = { action: 'skip', moved: 0 }
      saveState()
      return lastMoveResult.value
    }

    let delta = 0
    const accel = accelLevel.value
    let playerLine = ''

    if (action === 'strong') {
      playerLine = pickPlayerLine('strong')
      addLog('player', playerLine)
      delta = rollInRange(ranges.value.strong[accel])
      accelerationStacks.value = 0
    } else if (action === 'soft') {
      playerLine = pickPlayerLine('soft')
      addLog('player', playerLine)
      delta = rollInRange(ranges.value.soft[accel])
      accelerationStacks.value = 0
    } else if (action === 'back') {
      playerLine = pickPlayerLine('back')
      addLog('player', playerLine)
      delta = rollInRange(ranges.value.back[accel])
      accelerationStacks.value = 0
    } else if (action === 'accelerate') {
      playerLine = pickPlayerLine('accelerate')
      addLog('player', playerLine)
      if (accelerationStacks.value < MAX_ACCEL) {
        accelerationStacks.value++
      }
      round.value++
      const suspicionEnded = advanceSuspicion()
      if (suspicionEnded) return lastMoveResult.value
      addLog('system', `Pressure building... (${accelerationStacks.value}/${MAX_ACCEL})`)
      setNarrative(pickNarrative('accelerate', { playerLine }), responseTypeNames.value.accelerate || 'ESCALATE')
      moveHistory.value.push({ action: 'accelerate', from: position.value, to: position.value, round: round.value - 1 })
      lastMoveResult.value = { action: 'accelerate', stacks: accelerationStacks.value }
      saveState()
      return lastMoveResult.value
    } else if (action === 'capitalize') {
      return capitalize()
    } else {
      return null
    }

    const from = position.value
    let newPos = position.value + delta

    if (newPos < 0) newPos = 0
    if (newPos >= TOTAL_CELLS) {
      setNarrative(pickNarrative('overshot'), 'COMPROMISED')
      endGame(false, 'overshot')
      return lastMoveResult.value
    }

    if (newPos < suspicionLine.value) {
      setNarrative(pickNarrative('suspicion'), 'COMPROMISED')
      endGame(false, 'suspicion')
      return lastMoveResult.value
    }

    position.value = newPos
    round.value++

    const suspicionEnded = advanceSuspicion()
    if (suspicionEnded) return lastMoveResult.value

    const landedOn = barCells.value[position.value]
    moveHistory.value.push({ action, from, to: position.value, round: round.value - 1, cell: landedOn })
    lastMoveResult.value = { action, from, to: position.value, delta, cell: landedOn }

    const isSpecialCell = ['fail', 'suspicion', 'concern', 'hesitation', 'temptation', 'sensitivity'].includes(landedOn)
    if (!isSpecialCell) {
      setNarrative(pickNarrative(action, { playerLine }), responseTypeNames.value[action] || action.toUpperCase())
    }

    handleCellLanding(landedOn, action)
    saveState()
    return lastMoveResult.value
  }

  function resolveConcern() {
    if (!mustResolveConcern.value) return null

    concernAttempts.value++
    const playerLine = pickPlayerLine('resolve', concernAttempts.value)
    addLog('player', playerLine)

    const { value: roll } = seededRandInt(
      dailySeed + round.value * 3571 + position.value * 97 + concernAttempts.value * 1237,
      0, 100
    )
    const success = roll < (mark.concernSuccessRate * 100)

    if (success) {
      mustResolveConcern.value = false
      removeCellAt(position.value)
      const markLine = pickMarkResponse('convinced')
      lastMarkLine.value = markLine
      addLog('mark', markLine)
      setNarrative(pickNarrative('concern_resolve_success', { playerLine, markLine }), 'CONCERN RESOLVED')
      round.value++
      const suspicionEnded = advanceSuspicion(2)
      if (suspicionEnded) return lastMoveResult.value
      lastMoveResult.value = { action: 'concern_resolved', success: true }
    } else {
      const markLine = pickMarkResponse('suspicious', concernAttempts.value)
      lastMarkLine.value = markLine
      addLog('mark', markLine)
      addLog('system', 'Deflection failed. Threat level advancing.')
      setNarrative(pickNarrative('concern_resolve_fail', { playerLine, markLine }), 'DEFLECTION FAILED')
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

    const playerLine = pickPlayerLine('capitalize')
    addLog('player', playerLine)

    const cellType = barCells.value[position.value]
    let value = ''
    if (cellType === 'reward_high') value = 'HIGH'
    else if (cellType === 'reward_medium') value = 'MEDIUM'
    else value = 'LOW'

    const markLine = pickMarkResponse('convinced')
    lastMarkLine.value = markLine
    addLog('mark', markLine)
    addLog('system', `Intelligence extracted. Value: ${value}`)
    setNarrative(pickNarrative('capitalize_success', { playerLine, markLine, reward: value }), 'EXTRACTION COMPLETE')
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
    gamePhase.value = 'briefing'
    selectedScamIndex.value = null
    barCells.value = []
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
    opLog.value = []
    storyText.value = ''
    storyLabel.value = ''
    lastMarkLine.value = ''
  }

  // ── Share results ─────────────────────────────────────
  function getShareText() {
    const result = won.value ? `Extracted (${capitalizeValue.value})` : `Compromised (${endReason.value})`
    const bar = barCells.value.map((c, i) => {
      if (i === position.value && won.value) return '\u{1F7E2}'
      if (i === position.value && !won.value) return '\u{1F534}'
      if (c === 'suspicion') return '\u{1F7E5}'
      if (c.startsWith('reward')) return '\u{1F7E9}'
      if (c === 'fail') return '\u{1F7E5}'
      if (c === 'concern') return '\u{1F7EA}'
      if (c === 'hesitation') return '\u{1F7E8}'
      return '\u{2B1B}'
    }).join('')

    const rows = []
    for (let i = 0; i < bar.length; i += 10) {
      rows.push(bar.slice(i, i + 10))
    }

    return [
      `The Operator #${challengeNumber}`,
      `${scamType.value.name} vs ${markName}`,
      `Rounds: ${round.value} | ${result}`,
      '',
      ...rows,
      '',
      'scambench.com/operator',
    ].join('\n')
  }

  return {
    // Config
    scamType,
    scamChoices,
    vulnerabilities,
    mark,
    markName,
    markEmail,
    challengeNumber,
    TOTAL_CELLS,
    MAX_ACCEL,
    CELL_TYPES,

    // State
    gamePhase,
    selectedScamIndex,
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
    capitalizeValue,
    opLog,
    storyText,
    storyLabel,
    responseTypeNames,
    lastMarkLine,

    // Computed
    currentCell,
    isOnReward,
    canCapitalize,
    tier,
    rangePreview,
    tacticRanges,
    rewardTierLabel,
    threatLevel,
    markComposure,

    // Actions
    selectScam,
    acceptMission,
    move,
    resolveConcern,
    resetGame,
    getShareText,
  }
}
