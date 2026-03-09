/**
 * The Con — Dialogue data, personality profiles, and effectiveness maps.
 * Per-scam conversation starters, mark personalities, and principle-scam affinity.
 */

// ── Mark opening messages (mark speaks first) ──────────────
export const MARK_OPENERS = {
  delivery: [
    'Hello? I got a text about a package that couldn\'t be delivered?',
    'Hi, I just received a notification about my delivery. Is this the shipping company?',
    'Um, I got a message saying my package is being held. What do I need to do?',
  ],
  family_emergency: [
    'Hello? Who is this?',
    'I\'m sorry, I don\'t recognize this number. Who\'s calling?',
    'Yes? Hello?',
  ],
  prize_lottery: [
    'Wait, I won something? What is this about?',
    'Hello? Someone left me a voicemail about a prize?',
    'Is this for real? I never enter contests...',
  ],
  charity: [
    'Hello, who\'s calling?',
    'Hi there. What organization are you with?',
    'Yes? I\'m a bit busy, what is this regarding?',
  ],
  tech_support: [
    'Hello? My computer said to call this number.',
    'Hi, I\'m getting some kind of warning on my screen?',
    'Is this tech support? I think something\'s wrong with my computer.',
  ],
  vacation: [
    'Hello? I got a call about a vacation package?',
    'Hi, is this about that free trip I signed up for?',
    'Wait, I won a vacation? From where?',
  ],
  tax_irs: [
    'Hello? What is this about?',
    'You\'re calling from the IRS? Is everything okay with my taxes?',
    'I... I don\'t understand. What back taxes?',
  ],
  advance_fee: [
    'I\'m sorry, who are you? A lawyer?',
    'An inheritance? From whom?',
    'This sounds... unusual. Can you explain?',
  ],
  job: [
    'Hi! Yes, I\'ve been looking for work actually.',
    'Oh, a job opportunity? What kind of position?',
    'Hello, yes I submitted my resume a while back. Is this about that?',
  ],
  romance: [
    'Hi! Nice to match with you.',
    'Hey there, your profile caught my eye.',
    'Hello! So tell me about yourself.',
  ],
  investment: [
    'An investment opportunity? I\'m listening.',
    'Hi, what kind of returns are we talking about?',
    'I\'ve been looking into investing actually. What do you have?',
  ],
}

// ── Scam context descriptions (shown during target briefing) ──
export const SCAM_CONTEXTS = {
  delivery: 'The mark received a fake delivery notification. They\'re expecting a package and are primed to act. Convince them to share personal info or pay a "redelivery fee."',
  family_emergency: 'You\'re pretending to be a relative in trouble. The mark doesn\'t recognize your voice. Build emotional urgency to extract money before they verify.',
  prize_lottery: 'The mark has been told they won a prize. They\'re excited but cautious. Get them to pay "processing fees" or share bank details to "claim" their winnings.',
  charity: 'You\'re impersonating a charity. The mark may feel guilty saying no. Leverage their goodwill to collect donations or personal information.',
  tech_support: 'The mark believes their computer is compromised. They\'re anxious and looking for help. Gain remote access or sell them fake security software.',
  vacation: 'The mark thinks they won a free vacation. They want it to be real. Get them to pay "taxes and fees" to claim the trip.',
  tax_irs: 'You\'re impersonating the IRS. The mark is scared of legal trouble. Pressure them into immediate payment to avoid "arrest."',
  advance_fee: 'You\'re a "lawyer" with news of an inheritance. The mark must pay legal fees upfront. Build credibility, then extract the advance payment.',
  job: 'You\'re offering a dream job. The mark is eager for employment. Get them to pay for "training materials" or hand over personal info for "background checks."',
  romance: 'You\'re building a romantic connection online. The mark is emotionally invested. Eventually ask for money for a "crisis" or "plane ticket to visit."',
  investment: 'You\'re pitching a too-good-to-be-true investment. The mark wants financial returns. Get them to invest before they can research or think clearly.',
}

// ── Mark personality profiles per difficulty level ──────────
export const MARK_PERSONALITIES = {
  1: {
    label: 'Gullible',
    resistanceDecayMultiplier: 1.5,
    suspicionGainMultiplier: 0.6,
    rapportThreshold: 15,
    skepticismRate: 0.1,
    emotionalVolatility: 0.3,
    detectionThreshold: 0.3,
  },
  2: {
    label: 'Trusting',
    resistanceDecayMultiplier: 1.2,
    suspicionGainMultiplier: 0.8,
    rapportThreshold: 25,
    skepticismRate: 0.2,
    emotionalVolatility: 0.4,
    detectionThreshold: 0.4,
  },
  3: {
    label: 'Average',
    resistanceDecayMultiplier: 1.0,
    suspicionGainMultiplier: 1.0,
    rapportThreshold: 35,
    skepticismRate: 0.3,
    emotionalVolatility: 0.5,
    detectionThreshold: 0.5,
  },
  4: {
    label: 'Cautious',
    resistanceDecayMultiplier: 0.8,
    suspicionGainMultiplier: 1.3,
    rapportThreshold: 45,
    skepticismRate: 0.4,
    emotionalVolatility: 0.6,
    detectionThreshold: 0.6,
  },
  5: {
    label: 'Skeptical',
    resistanceDecayMultiplier: 0.6,
    suspicionGainMultiplier: 1.6,
    rapportThreshold: 60,
    skepticismRate: 0.5,
    emotionalVolatility: 0.7,
    detectionThreshold: 0.7,
  },
}

// ── Level configuration ────────────────────────────────────
export const LEVEL_CONFIG = {
  1: { startingResistance: 60, suspicionThreshold: 100, maxTurns: 20, startingEmotion: 'curious' },
  2: { startingResistance: 70, suspicionThreshold: 90,  maxTurns: 18, startingEmotion: 'neutral' },
  3: { startingResistance: 80, suspicionThreshold: 80,  maxTurns: 16, startingEmotion: 'neutral' },
  4: { startingResistance: 90, suspicionThreshold: 70,  maxTurns: 14, startingEmotion: 'skeptical' },
  5: { startingResistance: 100, suspicionThreshold: 60, maxTurns: 12, startingEmotion: 'skeptical' },
}

// ── Scam-principle affinity (which principles work best per scam) ──
export const SCAM_PRINCIPLE_AFFINITY = {
  delivery:         { reciprocity: 1.0, commitment: 0.9, social_proof: 0.7, authority: 1.5, liking: 0.8, scarcity: 1.3 },
  family_emergency: { reciprocity: 1.2, commitment: 1.0, social_proof: 0.4, authority: 0.5, liking: 1.5, scarcity: 1.4 },
  prize_lottery:    { reciprocity: 1.2, commitment: 0.9, social_proof: 1.3, authority: 1.0, liking: 0.7, scarcity: 1.5 },
  charity:          { reciprocity: 1.5, commitment: 0.7, social_proof: 1.2, authority: 0.8, liking: 1.3, scarcity: 1.1 },
  tech_support:     { reciprocity: 0.7, commitment: 1.0, social_proof: 0.8, authority: 1.5, liking: 0.9, scarcity: 1.4 },
  vacation:         { reciprocity: 1.0, commitment: 0.9, social_proof: 1.3, authority: 0.6, liking: 1.1, scarcity: 1.5 },
  tax_irs:          { reciprocity: 0.6, commitment: 1.0, social_proof: 0.5, authority: 1.6, liking: 0.3, scarcity: 1.4 },
  advance_fee:      { reciprocity: 1.4, commitment: 1.3, social_proof: 0.7, authority: 0.8, liking: 1.1, scarcity: 1.0 },
  job:              { reciprocity: 0.8, commitment: 0.9, social_proof: 1.4, authority: 1.1, liking: 1.0, scarcity: 1.3 },
  romance:          { reciprocity: 1.3, commitment: 1.2, social_proof: 0.5, authority: 0.3, liking: 1.6, scarcity: 0.9 },
  investment:       { reciprocity: 0.7, commitment: 1.0, social_proof: 1.5, authority: 1.2, liking: 0.6, scarcity: 1.4 },
}

// ── Emotional state -> principle effectiveness modifiers ────
export const EMOTION_PRINCIPLE_MODIFIERS = {
  neutral:     { reciprocity: 1.0, commitment: 1.0, social_proof: 1.0, authority: 1.0, liking: 1.0, scarcity: 0.8 },
  curious:     { reciprocity: 1.1, commitment: 1.0, social_proof: 1.2, authority: 1.1, liking: 1.0, scarcity: 0.9 },
  anxious:     { reciprocity: 0.8, commitment: 0.9, social_proof: 0.9, authority: 1.4, liking: 0.7, scarcity: 1.5 },
  trusting:    { reciprocity: 1.3, commitment: 1.4, social_proof: 1.1, authority: 1.0, liking: 1.3, scarcity: 1.0 },
  skeptical:   { reciprocity: 0.6, commitment: 0.7, social_proof: 0.5, authority: 0.8, liking: 0.9, scarcity: 0.4 },
  excited:     { reciprocity: 1.0, commitment: 1.2, social_proof: 1.3, authority: 0.8, liking: 1.1, scarcity: 1.4 },
  fearful:     { reciprocity: 0.7, commitment: 1.1, social_proof: 0.8, authority: 1.5, liking: 0.6, scarcity: 1.3 },
  sympathetic: { reciprocity: 1.5, commitment: 1.0, social_proof: 1.0, authority: 0.6, liking: 1.4, scarcity: 0.8 },
}

// ── Emotional state transitions (current state + principle -> new state) ──
// Value is the likely new state when that principle is detected. Applied probabilistically.
export const EMOTION_TRANSITIONS = {
  neutral:     { reciprocity: 'curious',     commitment: 'neutral',     social_proof: 'curious',     authority: 'anxious',    liking: 'trusting',    scarcity: 'anxious' },
  curious:     { reciprocity: 'trusting',    commitment: 'trusting',    social_proof: 'excited',     authority: 'anxious',    liking: 'trusting',    scarcity: 'excited' },
  anxious:     { reciprocity: 'neutral',     commitment: 'anxious',     social_proof: 'neutral',     authority: 'fearful',    liking: 'neutral',     scarcity: 'fearful' },
  trusting:    { reciprocity: 'trusting',    commitment: 'trusting',    social_proof: 'excited',     authority: 'neutral',    liking: 'trusting',    scarcity: 'excited' },
  skeptical:   { reciprocity: 'neutral',     commitment: 'skeptical',   social_proof: 'curious',     authority: 'neutral',    liking: 'neutral',     scarcity: 'skeptical' },
  excited:     { reciprocity: 'excited',     commitment: 'trusting',    social_proof: 'excited',     authority: 'anxious',    liking: 'excited',     scarcity: 'excited' },
  fearful:     { reciprocity: 'anxious',     commitment: 'fearful',     social_proof: 'anxious',     authority: 'fearful',    liking: 'anxious',     scarcity: 'fearful' },
  sympathetic: { reciprocity: 'sympathetic', commitment: 'trusting',    social_proof: 'sympathetic', authority: 'neutral',    liking: 'sympathetic', scarcity: 'anxious' },
}

// ── Contrasting tactic pairs (switching between these raises suspicion) ──
export const TACTIC_CONTRASTS = [
  ['liking', 'authority'],     // "We're friends" then "I'm an officer" = suspicious
  ['liking', 'scarcity'],      // "Take your time" then "ACT NOW" = suspicious
  ['reciprocity', 'scarcity'], // "No obligation" then "Limited time" = suspicious
]

// ── Emotional state display data ───────────────────────────
export const EMOTION_DISPLAY = {
  neutral:     { label: 'NEUTRAL',     color: '#8888a0', icon: '--' },
  curious:     { label: 'CURIOUS',     color: '#00bcd4', icon: '?' },
  anxious:     { label: 'ANXIOUS',     color: '#ffaa00', icon: '!' },
  trusting:    { label: 'TRUSTING',    color: '#4caf50', icon: '+' },
  skeptical:   { label: 'SKEPTICAL',   color: '#ff5722', icon: 'x' },
  excited:     { label: 'EXCITED',     color: '#e91e63', icon: '*' },
  fearful:     { label: 'FEARFUL',     color: '#f44336', icon: '!!' },
  sympathetic: { label: 'SYMPATHETIC', color: '#9c27b0', icon: '~' },
}
