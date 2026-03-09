/**
 * The Con — Persuasion Detection Engine (Keyword Matching)
 *
 * Swappable module: this entire file can be replaced with a Claude API-backed
 * implementation. The analyzeMessage() signature is the contract.
 */
import { PRINCIPLES, PRINCIPLE_IDS, ASK_PATTERNS } from '@/data/cialdini'
import {
  SCAM_PRINCIPLE_AFFINITY,
  EMOTION_PRINCIPLE_MODIFIERS,
  EMOTION_TRANSITIONS,
  TACTIC_CONTRASTS,
} from '@/data/conDialogue'

const MAX_PRINCIPLE_SCORE = 3.0

/**
 * Analyze a player message for Cialdini persuasion principles.
 *
 * @param {string} playerMessage — raw text from player input
 * @param {Object} context — game context
 * @param {string} context.scamId — current scam type id
 * @param {string} context.emotionalState — mark's current emotional state
 * @param {number} context.resistance — mark's current resistance (0-100)
 * @param {number} context.suspicion — mark's current suspicion (0-100)
 * @param {number} context.rapport — mark's current rapport (0-100)
 * @param {number} context.turnNumber — current turn
 * @param {Array} context.principleHistory — recent principle usage [{id, turn}]
 * @param {Object} context.personality — MARK_PERSONALITIES entry for current level
 * @returns {Object} analysis result
 */
export function analyzeMessage(playerMessage, context) {
  const {
    scamId,
    emotionalState,
    resistance,
    suspicion,
    rapport,
    turnNumber,
    principleHistory,
    personality,
  } = context

  const message = playerMessage.trim()
  const affinityMap = SCAM_PRINCIPLE_AFFINITY[scamId] || {}
  const emotionMods = EMOTION_PRINCIPLE_MODIFIERS[emotionalState] || {}
  const threshold = personality.detectionThreshold || 0.5

  // 1. Score each principle
  const principleScores = {}
  const principleMatches = {}

  for (const pid of PRINCIPLE_IDS) {
    const principle = PRINCIPLES[pid]
    let rawScore = 0
    const matchedKeywords = []

    for (const { re, weight } of principle.patterns) {
      const match = message.match(re)
      if (match) {
        rawScore += weight
        matchedKeywords.push(match[0])
      }
    }

    // Cap raw score
    rawScore = Math.min(rawScore, MAX_PRINCIPLE_SCORE)

    // Apply context multipliers
    const affinity = affinityMap[pid] || 1.0
    const emotionMod = emotionMods[pid] || 1.0
    const adjustedScore = rawScore * affinity * emotionMod

    principleScores[pid] = { raw: rawScore, adjusted: adjustedScore, affinity, emotionMod }
    principleMatches[pid] = matchedKeywords
  }

  // 2. Determine detected principles (above threshold)
  const detectedPrinciples = PRINCIPLE_IDS
    .filter(pid => principleScores[pid].adjusted >= threshold)
    .map(pid => ({
      id: pid,
      name: PRINCIPLES[pid].name,
      score: principleScores[pid].adjusted,
      rawScore: principleScores[pid].raw,
      affinity: principleScores[pid].affinity,
      keywords: principleMatches[pid],
      color: PRINCIPLES[pid].color,
    }))
    .sort((a, b) => b.score - a.score)

  // 3. Dominant principle
  const dominantPrinciple = detectedPrinciples.length > 0 ? detectedPrinciples[0].id : null
  const dominantScore = detectedPrinciples.length > 0 ? detectedPrinciples[0].score : 0

  // 4. Calculate resistance impact
  let resistanceImpact = 0
  if (dominantPrinciple) {
    let baseImpact = dominantScore * 6

    // Variety bonus: principle not used in last 2 turns
    const recentPrinciples = principleHistory.slice(-2).map(h => h.id)
    if (!recentPrinciples.includes(dominantPrinciple)) {
      baseImpact += 3
    }

    // Repetition penalty: same principle 3+ consecutive turns
    const lastTwo = principleHistory.slice(-2)
    if (lastTwo.length >= 2 && lastTwo.every(h => h.id === dominantPrinciple)) {
      baseImpact -= 5
    }

    // Rapport bonus
    if (rapport > personality.rapportThreshold) {
      baseImpact += 2
    }

    resistanceImpact = Math.max(0, baseImpact * personality.resistanceDecayMultiplier)
  }

  // 5. Calculate suspicion impact
  let suspicionImpact = 2 // baseline per message

  if (dominantPrinciple) {
    const affinity = affinityMap[dominantPrinciple] || 1.0
    // Bad tactic penalty
    if (affinity < 0.7) {
      suspicionImpact += 3
    }

    // Tactic contrast penalty
    const lastPrinciple = principleHistory.length > 0
      ? principleHistory[principleHistory.length - 1].id
      : null
    if (lastPrinciple && isTacticContrast(lastPrinciple, dominantPrinciple)) {
      suspicionImpact += 2
    }
  } else {
    // No principle detected (gibberish/off-topic)
    suspicionImpact += 4
  }

  // Short message penalty
  if (message.length < 10) {
    suspicionImpact += 2
  }

  suspicionImpact = suspicionImpact * personality.suspicionGainMultiplier

  // 6. Rapport impact
  let rapportImpact = 0
  if (dominantPrinciple === 'liking') rapportImpact = 5
  else if (dominantPrinciple === 'reciprocity') rapportImpact = 3
  else if (dominantPrinciple === 'authority' && emotionalState !== 'fearful') rapportImpact = -2
  else if (dominantPrinciple === 'scarcity') rapportImpact = -1
  if (!dominantPrinciple) rapportImpact = -3

  // 7. Emotional state transition
  let emotionalShift = null
  if (dominantPrinciple) {
    const transitions = EMOTION_TRANSITIONS[emotionalState]
    if (transitions && transitions[dominantPrinciple]) {
      const candidateState = transitions[dominantPrinciple]
      // Probabilistic: emotionalVolatility chance to shift
      if (Math.random() < personality.emotionalVolatility) {
        emotionalShift = candidateState
      }
    }
  } else {
    // No principle: chance of becoming skeptical
    if (Math.random() < personality.skepticismRate) {
      emotionalShift = 'skeptical'
    }
  }

  // 8. Detect ask/close attempt
  const isAskAttempt = ASK_PATTERNS.some(re => re.test(message))

  // 9. Build feedback string
  let feedback = ''
  if (detectedPrinciples.length === 0) {
    feedback = 'No persuasion principles detected. The mark grows suspicious.'
  } else if (detectedPrinciples.length === 1) {
    const p = detectedPrinciples[0]
    const eff = p.affinity >= 1.2 ? 'highly effective' : p.affinity >= 0.8 ? 'effective' : 'poorly matched'
    feedback = `${p.name} detected (${eff} for this scam).`
  } else {
    const names = detectedPrinciples.slice(0, 3).map(p => p.name).join(', ')
    feedback = `Multiple principles: ${names}. Dominant: ${detectedPrinciples[0].name}.`
  }

  return {
    detectedPrinciples,
    dominantPrinciple,
    dominantScore,
    totalPersuasionScore: detectedPrinciples.reduce((sum, p) => sum + p.score, 0),
    resistanceImpact: Math.round(resistanceImpact * 10) / 10,
    suspicionImpact: Math.round(suspicionImpact * 10) / 10,
    rapportImpact,
    emotionalShift,
    isAskAttempt,
    feedback,
    allScores: principleScores,
  }
}

function isTacticContrast(a, b) {
  return TACTIC_CONTRASTS.some(
    ([x, y]) => (a === x && b === y) || (a === y && b === x)
  )
}
