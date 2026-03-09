/**
 * Cialdini's 6 Principles of Persuasion — definitions, detection patterns, educational content.
 * Used by The Con's detection engine and debrief screens.
 */

export const PRINCIPLES = {
  reciprocity: {
    id: 'reciprocity',
    name: 'Reciprocity',
    description: 'People feel obligated to return favors. Give something first, then ask.',
    color: '#ff9800',
    icon: '[R]',
    patterns: [
      { re: /\b(free|gift|bonus|complimentary|no.?charge)\b/i, weight: 1.0 },
      { re: /\b(i('ve| have)|we('ve| have))\b.{0,20}\b(for you|on your behalf|helped)\b/i, weight: 1.2 },
      { re: /\b(special|exclusive).{0,10}(for you|just for|offer)\b/i, weight: 0.8 },
      { re: /\b(already|went ahead|took care|arranged|prepared)\b.{0,15}\b(for you|your)\b/i, weight: 1.0 },
      { re: /\b(favor|courtesy|goodwill|gesture)\b/i, weight: 0.7 },
      { re: /\b(no obligation|nothing in return|my treat)\b/i, weight: 0.9 },
      { re: /\b(save[d]?|protect(ed|ing)?|secur(ed|ing)?)\b.{0,10}\b(your|you)\b/i, weight: 0.8 },
    ],
    counterTactics: [
      'Unsolicited "gifts" create artificial obligation. You don\'t owe anyone for something you didn\'t ask for.',
      'Ask yourself: "Would I do this if they hadn\'t given me anything?"',
      'Scammers invest pennies to extract thousands. The "gift" is the cost of doing business.',
    ],
    realWorldExample: 'Free samples at grocery stores, charity address labels in the mail, "free" trials that auto-charge.',
  },

  commitment: {
    id: 'commitment',
    name: 'Commitment',
    description: 'Once people commit to something, they feel pressure to stay consistent with that commitment.',
    color: '#9c27b0',
    icon: '[C]',
    patterns: [
      { re: /\b(you (said|agreed|mentioned|told me|confirmed))\b/i, weight: 1.2 },
      { re: /\b(already|previously|earlier|before|last time)\b.{0,15}\b(you|your)\b/i, weight: 1.0 },
      { re: /\b(consistent|follow.?through|keep your word|commitment)\b/i, weight: 0.9 },
      { re: /\b(just (one more|the next|the final) step)\b/i, weight: 1.0 },
      { re: /\b(makes sense|logical|naturally|of course)\b.{0,10}\b(to|that|you)\b/i, weight: 0.7 },
      { re: /\b(we('ve| have) (already|come this far))\b/i, weight: 1.1 },
      { re: /\b(started|begun|initiated|in progress)\b/i, weight: 0.6 },
    ],
    counterTactics: [
      'Past decisions don\'t lock you into future ones. You can always change your mind.',
      '"We\'ve come this far" is a sunk cost fallacy. Only future outcomes matter.',
      'Legitimate processes don\'t guilt you for pausing to think.',
    ],
    realWorldExample: 'Car dealerships escalating from test drive to "just sign here." Subscription trials that are hard to cancel.',
  },

  social_proof: {
    id: 'social_proof',
    name: 'Social Proof',
    description: 'People follow what others are doing, especially in uncertain situations.',
    color: '#2196f3',
    icon: '[S]',
    patterns: [
      { re: /\b(everyone|everybody|most people|thousands|millions|many)\b/i, weight: 1.0 },
      { re: /\b(other (customers|clients|people|users|investors))\b/i, weight: 1.1 },
      { re: /\b(popular|trending|best.?selling|highly rated|top rated)\b/i, weight: 0.8 },
      { re: /\b(reviews?|testimonials?|ratings?|5.?star)\b/i, weight: 0.7 },
      { re: /\b(neighbor|friend|colleague|family member).{0,15}(did|does|has|uses|loves|bought|tried)\b/i, weight: 1.2 },
      { re: /\b(\d+[,.]?\d*)\s*(people|customers|users|clients|winners)\b/i, weight: 1.0 },
      { re: /\b(trusted by|recommended by|endorsed by|used by)\b/i, weight: 0.9 },
    ],
    counterTactics: [
      'Popularity doesn\'t equal legitimacy. Millions of people have been scammed.',
      'Fake reviews and fabricated numbers are trivially easy to create.',
      'Ask for verifiable specifics, not vague claims about "many people."',
    ],
    realWorldExample: '"10,000 satisfied customers!" on fake product sites. Restaurant fake review farms. Ponzi scheme testimonials.',
  },

  authority: {
    id: 'authority',
    name: 'Authority',
    description: 'People defer to experts and officials. Titles, uniforms, and credentials create automatic trust.',
    color: '#f44336',
    icon: '[A]',
    patterns: [
      { re: /\b(official|authorized|certified|licensed|registered|accredited)\b/i, weight: 1.0 },
      { re: /\b(government|federal|irs|fbi|sec|fda|department|agency|bureau)\b/i, weight: 1.2 },
      { re: /\b(doctor|lawyer|attorney|officer|agent|inspector|director|manager|supervisor)\b/i, weight: 1.0 },
      { re: /\b(required|mandatory|regulation|compliance|law|legal|policy)\b/i, weight: 1.1 },
      { re: /\b(badge|id|certificate|credential|license)\s*(number|#|no\.?)?/i, weight: 0.9 },
      { re: /\b(expert|specialist|professional|senior|head|chief)\b/i, weight: 0.8 },
      { re: /\b(microsoft|google|apple|amazon|bank|police)\b/i, weight: 1.3 },
      { re: /\b(years? (of )?(experience|expertise|service))\b/i, weight: 0.7 },
    ],
    counterTactics: [
      'Real authorities don\'t cold-call demanding immediate payment or personal info.',
      'Always verify credentials independently. Call the organization directly using a number YOU look up.',
      'Titles and jargon are free. Anyone can claim to be "Officer Johnson from the fraud department."',
    ],
    realWorldExample: 'IRS impersonation calls. Fake "Microsoft support" popups. Phishing emails from "your bank."',
  },

  liking: {
    id: 'liking',
    name: 'Liking',
    description: 'People say yes to those they like. Similarity, compliments, and familiarity build compliance.',
    color: '#4caf50',
    icon: '[L]',
    patterns: [
      { re: /\b(you('re| are) (so |very |really )?(smart|wise|kind|generous|wonderful|special|great|amazing))\b/i, weight: 1.2 },
      { re: /\b(i (like|love|admire|respect|appreciate) (you|your))\b/i, weight: 1.1 },
      { re: /\b(we('re| are) (alike|similar|the same|in this together))\b/i, weight: 1.0 },
      { re: /\b(i (understand|know how you feel|feel the same|agree with you))\b/i, weight: 0.9 },
      { re: /\b(between (you and me|us)|just us|our (little )?secret)\b/i, weight: 0.8 },
      { re: /\b(trust me|honest(ly)?|sincere(ly)?|genuine(ly)?|heart)\b/i, weight: 0.7 },
      { re: /\b(friend|buddy|pal|sweetheart|dear|honey|love)\b/i, weight: 0.6 },
    ],
    counterTactics: [
      'Flattery is cheap and effective. Ask: "Would I trust this person if they weren\'t being so nice?"',
      'Scammers mirror your interests and personality to build fake rapport.',
      'Real relationships develop over time, not in a single conversation with a stranger.',
    ],
    realWorldExample: 'Romance scams. "Friendly" cold callers who chat you up. Salespeople who find things "in common" with you.',
  },

  scarcity: {
    id: 'scarcity',
    name: 'Scarcity',
    description: 'Limited availability and urgency make things seem more valuable and demand immediate action.',
    color: '#ff5722',
    icon: '[U]',
    patterns: [
      { re: /\b(limited|only \d+|few|last|final|remaining)\b/i, weight: 1.0 },
      { re: /\b(hurry|rush|quick(ly)?|fast|immediate(ly)?|right now|asap)\b/i, weight: 1.1 },
      { re: /\b(deadline|expires?|expiring|ends? (today|tonight|soon|tomorrow))\b/i, weight: 1.2 },
      { re: /\b(once.?in.?a.?lifetime|never again|won't last|going fast)\b/i, weight: 1.0 },
      { re: /\b(before (it's|its) (too late|gone)|miss(ing)? out|don't wait)\b/i, weight: 1.1 },
      { re: /\b(today only|this (week|hour|minute) only|while supplies last)\b/i, weight: 0.9 },
      { re: /\b(running out|almost gone|selling out|spots? (left|available))\b/i, weight: 1.0 },
      { re: /\b(now or never|act now|time is running)\b/i, weight: 1.2 },
    ],
    counterTactics: [
      'Real opportunities don\'t evaporate in 5 minutes. If it\'s real, it\'ll be there tomorrow.',
      'Urgency is the #1 tool scammers use to bypass your rational thinking.',
      'Ask yourself: "Would I still do this if I had a week to decide?"',
    ],
    realWorldExample: '"Act now or lose your account!" "Only 2 spots left!" Countdown timers on phishing pages.',
  },
}

// Array form for iteration
export const PRINCIPLE_LIST = Object.values(PRINCIPLES)

// IDs for quick reference
export const PRINCIPLE_IDS = Object.keys(PRINCIPLES)

// Ask/close detection — player must eventually ask for money/info to win
export const ASK_PATTERNS = [
  /\b(card|credit|debit|payment|pay|send|wire|transfer)\b/i,
  /\b(account|bank|routing|sort.?code|iban|swift)\b/i,
  /\b(gift.?card|itunes|google play|steam)\b/i,
  /\b(fee|deposit|upfront|advance|processing)\b/i,
  /\b(buy|purchase|order|checkout|subscribe)\b/i,
  /\b(ssn|social security|date of birth|passport|driver.?s? licen[cs]e)\b/i,
  /\b(password|login|credentials|pin|verification code|otp)\b/i,
  /\b(click|link|download|install|remote access)\b/i,
  /\b(bitcoin|crypto|btc|eth|wallet address)\b/i,
  /\b(western union|moneygram|zelle|venmo|cashapp)\b/i,
]
