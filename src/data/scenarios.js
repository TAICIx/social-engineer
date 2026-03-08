/**
 * Social Engineer — Game data
 * Faithful adaptation of Torn RPG's "Scamming" crime mechanic.
 */

// ── 11 Scam Types (grouped by tier) ──────────────────────
export const SCAM_TYPES = [
  // Tier 1 — Easiest
  {
    id: 'delivery',
    name: 'Fake Delivery',
    tier: 1,
    emoji: '\u{1F4E6}',
    openingLine: 'Your package couldn\'t be delivered. Click here to reschedule...',
    cells: { reward_low: 6, reward_medium: 4, reward_high: 3, concern: 2, hesitation: 2, fail: 2, temptation: 2, sensitivity: 2 },
    debrief: {
      howItWorks: 'Scammer sends a fake delivery notification with a link to a phishing site that harvests personal info or payment details.',
      whyItWorks: 'People expect deliveries and act on urgency without verifying. The message mimics trusted carriers like UPS, FedEx, or Amazon.',
      howToSpot: 'Check the sender domain carefully. Real carriers don\'t ask for payment via text. Track packages directly on the carrier\'s official site.',
    },
  },
  {
    id: 'family_emergency',
    name: 'Family Emergency',
    tier: 1,
    emoji: '\u{1F6A8}',
    openingLine: 'Grandma, it\'s me! I\'m in trouble and need money right away...',
    cells: { reward_low: 6, reward_medium: 4, reward_high: 3, concern: 2, hesitation: 2, fail: 2, temptation: 2, sensitivity: 2 },
    debrief: {
      howItWorks: 'Scammer impersonates a family member in distress, pressuring the victim to wire money or send gift cards immediately.',
      whyItWorks: 'Emotional panic overrides critical thinking. Victims want to help loved ones and act before verifying.',
      howToSpot: 'Always call the family member directly on their known number. Scammers request untraceable payment methods like gift cards or wire transfers.',
    },
  },
  {
    id: 'prize_lottery',
    name: 'Prize / Lottery',
    tier: 1,
    emoji: '\u{1F3B0}',
    openingLine: 'Congratulations! You\'ve won $50,000! Pay a small fee to claim...',
    cells: { reward_low: 6, reward_medium: 4, reward_high: 3, concern: 2, hesitation: 2, fail: 2, temptation: 2, sensitivity: 2 },
    debrief: {
      howItWorks: 'Victim is told they won a prize but must pay taxes, fees, or provide bank info to receive it. The prize doesn\'t exist.',
      whyItWorks: 'Greed and excitement override skepticism. The "small fee" seems trivial compared to the promised payout.',
      howToSpot: 'You can\'t win a contest you didn\'t enter. Legitimate prizes never require upfront payment. Federal law prohibits requiring fees to claim winnings.',
    },
  },

  // Tier 2
  {
    id: 'charity',
    name: 'Fake Charity',
    tier: 2,
    emoji: '\u{1F49D}',
    openingLine: 'Help victims of the recent disaster. Every dollar counts...',
    cells: { reward_low: 5, reward_medium: 4, reward_high: 2, concern: 3, hesitation: 2, fail: 2, temptation: 2, sensitivity: 2 },
    debrief: {
      howItWorks: 'Scammer creates a fake charity, often after a real disaster, and solicits donations that go directly to the scammer.',
      whyItWorks: 'Compassion and urgency after disasters make people donate impulsively. Fake charities use names similar to real ones.',
      howToSpot: 'Verify charities on sites like Charity Navigator or GuideStar. Never donate via gift cards or wire transfer. Search the org\'s registration.',
    },
  },
  {
    id: 'tech_support',
    name: 'Tech Support',
    tier: 2,
    emoji: '\u{1F4BB}',
    openingLine: 'WARNING: Your computer is infected! Call this number immediately...',
    cells: { reward_low: 5, reward_medium: 4, reward_high: 2, concern: 3, hesitation: 2, fail: 2, temptation: 2, sensitivity: 2 },
    debrief: {
      howItWorks: 'Victim sees a fake popup or receives a call claiming their computer is compromised. Scammer gains remote access and charges for fake repairs.',
      whyItWorks: 'Fear of data loss or identity theft. The scammer sounds authoritative and the "problems" they show look real on screen.',
      howToSpot: 'Microsoft, Apple, and Google never call you about viruses. Close popup warnings — don\'t call the number. Use your own antivirus software.',
    },
  },

  // Tier 3
  {
    id: 'vacation',
    name: 'Vacation Deal',
    tier: 3,
    emoji: '\u{2708}\u{FE0F}',
    openingLine: 'Exclusive: 7-night Bahamas cruise for only $199! Book now before it\'s gone...',
    cells: { reward_low: 4, reward_medium: 3, reward_high: 2, concern: 3, hesitation: 3, fail: 3, temptation: 2, sensitivity: 2 },
    debrief: {
      howItWorks: 'Scammer offers an unbelievable travel deal that requires immediate booking. Hidden fees pile up, or the trip simply doesn\'t exist.',
      whyItWorks: 'Desire for escape + artificial urgency ("only 3 spots left!"). The initial price is too good to question.',
      howToSpot: 'Research the company independently. Read the fine print for hidden fees. Book through established travel agencies or directly with airlines/hotels.',
    },
  },
  {
    id: 'tax_irs',
    name: 'Tax / IRS',
    tier: 3,
    emoji: '\u{1F3DB}\u{FE0F}',
    openingLine: 'This is the IRS. You owe $4,327 in back taxes. Pay now or face arrest...',
    cells: { reward_low: 4, reward_medium: 3, reward_high: 2, concern: 3, hesitation: 3, fail: 3, temptation: 2, sensitivity: 2 },
    debrief: {
      howItWorks: 'Scammer impersonates the IRS or tax authority, threatening arrest or legal action unless immediate payment is made via gift cards or wire transfer.',
      whyItWorks: 'Fear of government authority and legal consequences. Many people aren\'t sure of their actual tax status.',
      howToSpot: 'The IRS always contacts you by mail first, never by phone demanding immediate payment. They never ask for gift cards. Verify at irs.gov.',
    },
  },

  // Tier 4
  {
    id: 'advance_fee',
    name: 'Advance-Fee',
    tier: 4,
    emoji: '\u{1F4B0}',
    openingLine: 'I am a Nigerian prince and I need your help to transfer $15 million...',
    cells: { reward_low: 3, reward_medium: 3, reward_high: 2, concern: 4, hesitation: 3, fail: 3, temptation: 2, sensitivity: 2 },
    debrief: {
      howItWorks: 'Victim is promised a large sum in exchange for helping with a "transfer." Repeated fees are requested before the money materializes (it never does).',
      whyItWorks: 'Sunk cost fallacy — after paying initial fees, victims keep paying hoping to recover their investment. The promise of huge returns clouds judgment.',
      howToSpot: 'Anyone asking you to pay money to receive money is running a scam. There is no fortune waiting for you from a stranger.',
    },
  },
  {
    id: 'job',
    name: 'Fake Job',
    tier: 4,
    emoji: '\u{1F4BC}',
    openingLine: 'Work from home, earn $5000/week! No experience needed. Apply now...',
    cells: { reward_low: 3, reward_medium: 3, reward_high: 2, concern: 4, hesitation: 3, fail: 3, temptation: 2, sensitivity: 2 },
    debrief: {
      howItWorks: 'Fake job listings collect personal data or require "training fees." Some involve money laundering where the victim unknowingly moves stolen funds.',
      whyItWorks: 'Job seekers are vulnerable and motivated. The offer seems like a lucky break, especially for those struggling financially.',
      howToSpot: 'Legitimate employers don\'t charge fees to apply. Research the company. Be wary of vague job descriptions and too-good-to-be-true salaries.',
    },
  },

  // Tier 5 — Hardest
  {
    id: 'romance',
    name: 'Romance',
    tier: 5,
    emoji: '\u{2764}\u{FE0F}',
    openingLine: 'I know we haven\'t met in person yet, but I feel such a connection with you...',
    cells: { reward_low: 2, reward_medium: 2, reward_high: 2, concern: 5, hesitation: 3, fail: 4, temptation: 2, sensitivity: 3 },
    debrief: {
      howItWorks: 'Scammer builds an online relationship over weeks/months, then fabricates emergencies requiring money. They never meet in person.',
      whyItWorks: 'Loneliness and emotional investment. Victims fall in love and ignore red flags because they want the relationship to be real.',
      howToSpot: 'Reverse image search their photos. They always have excuses not to video call or meet. Never send money to someone you haven\'t met in person.',
    },
  },
  {
    id: 'investment',
    name: 'Investment',
    tier: 5,
    emoji: '\u{1F4C8}',
    openingLine: 'My crypto trading bot guarantees 300% returns. Early investors get in free...',
    cells: { reward_low: 2, reward_medium: 2, reward_high: 2, concern: 5, hesitation: 3, fail: 4, temptation: 2, sensitivity: 3 },
    debrief: {
      howItWorks: 'Scammer promotes a fake investment with "guaranteed" high returns. Early investors may see returns (from new victims\' money) to build trust before the scheme collapses.',
      whyItWorks: 'FOMO and greed. Showing fake profits and testimonials creates social proof. Victims recruit friends, becoming unwitting accomplices.',
      howToSpot: 'No legitimate investment guarantees returns. Check if the advisor is registered with the SEC/FINRA. If you can\'t explain how the money is made, don\'t invest.',
    },
  },
]

// ── 5 Mark Demographics ──────────────────────────────────
export const MARK_DEMOGRAPHICS = [
  {
    id: 'young_adult',
    label: 'Young Adult',
    emoji: '\u{1F9D1}',
    concernSuccessRate: 0.55,
    names: ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Dakota', 'Skyler'],
    reactions: {
      neutral: 'Hmm, okay...',
      interested: 'Wait, tell me more about this.',
      suspicious: 'This seems kinda sketch...',
      concerned: 'Hold on, let me check something.',
      convinced: 'Alright, I\'m in.',
      hesitant: 'Idk, let me think about it...',
    },
  },
  {
    id: 'middle_aged',
    label: 'Middle-Aged',
    emoji: '\u{1F468}',
    concernSuccessRate: 0.50,
    names: ['Robert', 'Susan', 'Michael', 'Patricia', 'David', 'Jennifer', 'James', 'Linda'],
    reactions: {
      neutral: 'I see.',
      interested: 'That\'s interesting, go on.',
      suspicious: 'I\'m not sure about this...',
      concerned: 'Wait a minute, something doesn\'t add up.',
      convinced: 'Okay, let\'s proceed.',
      hesitant: 'I need to discuss this with my spouse first.',
    },
  },
  {
    id: 'senior',
    label: 'Senior',
    emoji: '\u{1F475}',
    concernSuccessRate: 0.45,
    names: ['Dorothy', 'Harold', 'Margaret', 'Walter', 'Betty', 'Earl', 'Ruth', 'Frank'],
    reactions: {
      neutral: 'Oh my, well alright.',
      interested: 'Oh, that sounds nice, dear.',
      suspicious: 'My grandchildren warned me about things like this...',
      concerned: 'I should call my son about this first.',
      convinced: 'Well, if you say so...',
      hesitant: 'I\'m not very good with these things...',
    },
  },
  {
    id: 'professional',
    label: 'Professional',
    emoji: '\u{1F468}\u{200D}\u{1F4BC}',
    concernSuccessRate: 0.40,
    names: ['Victoria', 'Jonathan', 'Catherine', 'Benjamin', 'Olivia', 'Nathaniel', 'Sophia', 'Alexander'],
    reactions: {
      neutral: 'Noted.',
      interested: 'I\'d like to see the documentation on this.',
      suspicious: 'Can you provide credentials for verification?',
      concerned: 'I\'m going to need to verify this independently.',
      convinced: 'The numbers check out. Let\'s move forward.',
      hesitant: 'I have a meeting. Can we revisit this later?',
    },
  },
  {
    id: 'affluent',
    label: 'Affluent',
    emoji: '\u{1F934}',
    concernSuccessRate: 0.35,
    names: ['Charles', 'Elizabeth', 'William', 'Caroline', 'Richard', 'Alexandra', 'Theodore', 'Penelope'],
    reactions: {
      neutral: 'Mm, I suppose.',
      interested: 'And what are the returns on this?',
      suspicious: 'I\'ll have my attorney look into this.',
      concerned: 'I\'m calling my financial advisor.',
      convinced: 'Fine, send the details to my assistant.',
      hesitant: 'I don\'t make impulsive decisions.',
    },
  },
]

// ── Movement Ranges per Tier (indexed by acceleration 0-5) ──
// [min, max] inclusive — actual move is random within range
export const MOVEMENT_RANGES = {
  1: {
    strong: [[10, 19], [11, 20], [12, 21], [13, 22], [14, 23], [15, 24]],
    soft:   [[3, 7],   [3, 7],   [4, 8],   [4, 8],   [4, 9],   [5, 10]],
    back:   [[-4, -2], [-4, -2], [-4, -2], [-4, -2], [-4, -2], [-4, -2]],
  },
  2: {
    strong: [[8, 15],  [9, 16],  [9, 17],  [10, 18], [11, 20], [12, 23]],
    soft:   [[3, 7],   [3, 7],   [3, 8],   [4, 9],   [4, 10],  [5, 11]],
    back:   [[-4, -2], [-4, -2], [-4, -2], [-4, -2], [-4, -2], [-4, -2]],
  },
  3: {
    strong: [[7, 13],  [8, 14],  [8, 15],  [9, 16],  [10, 18], [11, 20]],
    soft:   [[3, 6],   [3, 6],   [3, 7],   [4, 7],   [4, 8],   [5, 9]],
    back:   [[-4, -2], [-4, -2], [-4, -2], [-4, -2], [-4, -2], [-4, -2]],
  },
  4: {
    strong: [[6, 11],  [6, 12],  [7, 13],  [7, 14],  [8, 15],  [9, 17]],
    soft:   [[2, 4],   [2, 4],   [2, 5],   [2, 5],   [3, 5],   [3, 6]],
    back:   [[-4, -2], [-4, -2], [-4, -2], [-4, -2], [-4, -2], [-4, -2]],
  },
  5: {
    strong: [[5, 9],   [5, 10],  [6, 10],  [6, 11],  [7, 12],  [8, 14]],
    soft:   [[2, 3],   [2, 3],   [2, 4],   [2, 4],   [3, 4],   [3, 5]],
    back:   [[-3, -2], [-3, -2], [-3, -2], [-3, -2], [-3, -2], [-3, -2]],
  },
}

// ── Suspicion thresholds: cells consumed from left per round ──
// Index = round number. After round 4, red creeps in.
export const SUSPICION_THRESHOLDS = [0, 0, 0, 0, 2, 5, 8, 11, 16, 23, 34, 50]

// ── Cell type metadata for display ──
export const CELL_TYPES = {
  neutral:       { label: 'Safe',        color: 'var(--cell-neutral)',       textColor: '#999' },
  reward_low:    { label: 'Low Reward',  color: 'var(--cell-reward-low)',    textColor: '#a3d9a5' },
  reward_medium: { label: 'Med Reward',  color: 'var(--cell-reward-medium)', textColor: '#b5e6b7' },
  reward_high:   { label: 'High Reward', color: 'var(--cell-reward-high)',   textColor: '#c8f0ca' },
  concern:       { label: 'Concern',     color: 'var(--cell-concern)',       textColor: '#c4b5fd' },
  hesitation:    { label: 'Hesitation',  color: 'var(--cell-hesitation)',    textColor: '#fbbf24' },
  fail:          { label: 'Busted',      color: 'var(--cell-fail)',          textColor: '#fca5a5' },
  suspicion:     { label: 'Suspicion',   color: 'var(--cell-suspicion)',     textColor: '#f87171' },
  temptation:    { label: 'Temptation',  color: 'var(--cell-temptation)',    textColor: '#93c5fd' },
  sensitivity:   { label: 'Sensitivity', color: 'var(--cell-sensitivity)',   textColor: '#d4a574' },
}
