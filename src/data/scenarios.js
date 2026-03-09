/**
 * Social Engineer — Game data
 * Faithful adaptation of Torn RPG's "Scamming" crime mechanic.
 * Sources: wiki.torn.com/wiki/Scamming, Emforus In-Depth Guide
 */

// ── 11 Scam Types (grouped by CS tier) ──────────────────────
export const SCAM_TYPES = [
  // CS 1 — Easiest
  {
    id: 'delivery',
    name: 'Fake Delivery',
    tier: 1,
    emoji: '\u{1F4E6}',
    openingLine: 'Your package couldn\'t be delivered. Click here to reschedule...',
    cells: { reward_low: 11, reward_medium: 5, reward_high: 9, concern: 1, hesitation: 0, fail: 3, temptation: 2, sensitivity: 0 },
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
    cells: { reward_low: 6, reward_medium: 2, reward_high: 6, concern: 1, hesitation: 0, fail: 6, temptation: 0, sensitivity: 8 },
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
    cells: { reward_low: 4, reward_medium: 3, reward_high: 5, concern: 0, hesitation: 0, fail: 6, temptation: 15, sensitivity: 0 },
    debrief: {
      howItWorks: 'Victim is told they won a prize but must pay taxes, fees, or provide bank info to receive it. The prize doesn\'t exist.',
      whyItWorks: 'Greed and excitement override skepticism. The "small fee" seems trivial compared to the promised payout.',
      howToSpot: 'You can\'t win a contest you didn\'t enter. Legitimate prizes never require upfront payment.',
    },
  },

  // CS 20 — Easy
  {
    id: 'charity',
    name: 'Fake Charity',
    tier: 2,
    emoji: '\u{1F49D}',
    openingLine: 'Help victims of the recent disaster. Every dollar counts...',
    cells: { reward_low: 12, reward_medium: 6, reward_high: 2, concern: 1, hesitation: 5, fail: 4, temptation: 0, sensitivity: 2 },
    debrief: {
      howItWorks: 'Scammer creates a fake charity, often after a real disaster, and solicits donations that go directly to the scammer.',
      whyItWorks: 'Compassion and urgency after disasters make people donate impulsively. Fake charities use names similar to real ones.',
      howToSpot: 'Verify charities on sites like Charity Navigator or GuideStar. Never donate via gift cards or wire transfer.',
    },
  },
  {
    id: 'tech_support',
    name: 'Tech Support',
    tier: 2,
    emoji: '\u{1F4BB}',
    openingLine: 'WARNING: Your computer is infected! Call this number immediately...',
    cells: { reward_low: 5, reward_medium: 3, reward_high: 4, concern: 16, hesitation: 0, fail: 3, temptation: 0, sensitivity: 1 },
    debrief: {
      howItWorks: 'Victim sees a fake popup or receives a call claiming their computer is compromised. Scammer gains remote access and charges for fake repairs.',
      whyItWorks: 'Fear of data loss or identity theft. The scammer sounds authoritative and the "problems" they show look real on screen.',
      howToSpot: 'Microsoft, Apple, and Google never call you about viruses. Close popup warnings — don\'t call the number.',
    },
  },

  // CS 40 — Moderate
  {
    id: 'vacation',
    name: 'Vacation Deal',
    tier: 3,
    emoji: '\u{2708}\u{FE0F}',
    openingLine: 'Exclusive: 7-night Bahamas cruise for only $199! Book now before it\'s gone...',
    cells: { reward_low: 5, reward_medium: 2, reward_high: 3, concern: 0, hesitation: 3, fail: 10, temptation: 10, sensitivity: 1 },
    debrief: {
      howItWorks: 'Scammer offers an unbelievable travel deal that requires immediate booking. Hidden fees pile up, or the trip simply doesn\'t exist.',
      whyItWorks: 'Desire for escape + artificial urgency ("only 3 spots left!"). The initial price is too good to question.',
      howToSpot: 'Research the company independently. Read the fine print for hidden fees. Book through established travel agencies.',
    },
  },
  {
    id: 'tax_irs',
    name: 'Tax / IRS',
    tier: 3,
    emoji: '\u{1F3DB}\u{FE0F}',
    openingLine: 'This is the IRS. You owe $4,327 in back taxes. Pay now or face arrest...',
    cells: { reward_low: 4, reward_medium: 2, reward_high: 2, concern: 7, hesitation: 6, fail: 6, temptation: 0, sensitivity: 0 },
    debrief: {
      howItWorks: 'Scammer impersonates the IRS, threatening arrest or legal action unless immediate payment is made via gift cards or wire transfer.',
      whyItWorks: 'Fear of government authority and legal consequences. Many people aren\'t sure of their actual tax status.',
      howToSpot: 'The IRS always contacts you by mail first, never by phone demanding immediate payment. They never ask for gift cards.',
    },
  },

  // CS 60 — Difficult
  {
    id: 'advance_fee',
    name: 'Advance-Fee',
    tier: 4,
    emoji: '\u{1F4B0}',
    openingLine: 'I am Prince Abubakar and I need your help to transfer $15 million...',
    cells: { reward_low: 5, reward_medium: 3, reward_high: 2, concern: 1, hesitation: 1, fail: 5, temptation: 2, sensitivity: 15 },
    debrief: {
      howItWorks: 'Victim is promised a large sum in exchange for helping with a "transfer." Repeated fees are requested before the money materializes (it never does).',
      whyItWorks: 'Sunk cost fallacy — after paying initial fees, victims keep paying hoping to recover their investment.',
      howToSpot: 'Anyone asking you to pay money to receive money is running a scam. There is no fortune waiting for you from a stranger.',
    },
  },
  {
    id: 'job',
    name: 'Fake Job',
    tier: 4,
    emoji: '\u{1F4BC}',
    openingLine: 'Work from home, earn $5000/week! No experience needed. Apply now...',
    cells: { reward_low: 4, reward_medium: 2, reward_high: 2, concern: 3, hesitation: 15, fail: 7, temptation: 2, sensitivity: 2 },
    debrief: {
      howItWorks: 'Fake job listings collect personal data or require "training fees." Some involve money laundering where the victim unknowingly moves stolen funds.',
      whyItWorks: 'Job seekers are vulnerable and motivated. The offer seems like a lucky break, especially for those struggling financially.',
      howToSpot: 'Legitimate employers don\'t charge fees to apply. Research the company. Be wary of too-good-to-be-true salaries.',
    },
  },

  // CS 80 — Hardest
  {
    id: 'romance',
    name: 'Romance',
    tier: 5,
    emoji: '\u{2764}\u{FE0F}',
    openingLine: 'I know we haven\'t met in person yet, but I feel such a connection with you...',
    cells: { reward_low: 4, reward_medium: 2, reward_high: 1, concern: 3, hesitation: 1, fail: 6, temptation: 6, sensitivity: 13 },
    debrief: {
      howItWorks: 'Scammer builds an online relationship over weeks/months, then fabricates emergencies requiring money. They never meet in person.',
      whyItWorks: 'Loneliness and emotional investment. Victims fall in love and ignore red flags because they want the relationship to be real.',
      howToSpot: 'Reverse image search their photos. They always have excuses not to video call or meet. Never send money to someone you haven\'t met.',
    },
  },
  {
    id: 'investment',
    name: 'Investment',
    tier: 5,
    emoji: '\u{1F4C8}',
    openingLine: 'My crypto trading bot guarantees 300% returns. Early investors get in free...',
    cells: { reward_low: 2, reward_medium: 2, reward_high: 1, concern: 8, hesitation: 5, fail: 10, temptation: 6, sensitivity: 2 },
    debrief: {
      howItWorks: 'Scammer promotes a fake investment with "guaranteed" high returns. Early investors may see returns (from new victims\' money) to build trust.',
      whyItWorks: 'FOMO and greed. Showing fake profits and testimonials creates social proof. Victims recruit friends, becoming unwitting accomplices.',
      howToSpot: 'No legitimate investment guarantees returns. Check if the advisor is registered with the SEC/FINRA.',
    },
  },
]

// ── 5 Mark Demographics ──────────────────────────────────
// Mark type affects PAYOUT MULTIPLIER only (not bar layout or concern rates per Torn wiki)
// Concern success rate is global (~35-40%), kept for gameplay balance
export const MARK_DEMOGRAPHICS = [
  {
    id: 'young_adult',
    label: 'Young Adult',
    emoji: '\u{1F9D1}',
    payoutMultiplier: 1.0,
    concernSuccessRate: 0.40,
    names: ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Dakota', 'Skyler'],
  },
  {
    id: 'middle_aged',
    label: 'Middle-Aged',
    emoji: '\u{1F468}',
    payoutMultiplier: 1.25,
    concernSuccessRate: 0.40,
    names: ['Robert', 'Susan', 'Michael', 'Patricia', 'David', 'Jennifer', 'James', 'Linda'],
  },
  {
    id: 'senior',
    label: 'Senior',
    emoji: '\u{1F475}',
    payoutMultiplier: 1.5,
    concernSuccessRate: 0.40,
    names: ['Dorothy', 'Harold', 'Margaret', 'Walter', 'Betty', 'Earl', 'Ruth', 'Frank'],
  },
  {
    id: 'professional',
    label: 'Professional',
    emoji: '\u{1F468}\u{200D}\u{1F4BC}',
    payoutMultiplier: 3.0,
    concernSuccessRate: 0.35,
    names: ['Victoria', 'Jonathan', 'Catherine', 'Benjamin', 'Olivia', 'Nathaniel', 'Sophia', 'Alexander'],
  },
  {
    id: 'affluent',
    label: 'Affluent',
    emoji: '\u{1F934}',
    payoutMultiplier: 10.0,
    concernSuccessRate: 0.30,
    names: ['Charles', 'Elizabeth', 'William', 'Caroline', 'Richard', 'Alexandra', 'Theodore', 'Penelope'],
  },
]

// ── Movement Ranges per CS tier (from Torn wiki displacement tables) ──
// Indexed by acceleration stacks 0-5. [min, max] inclusive.
// Formula: P = B * product(a=1..n)(1 + 1/2^a)
export const MOVEMENT_RANGES = {
  1: {
    strong: [[10, 19], [15, 29], [18, 35], [21, 39], [22, 42], [23, 44]],
    soft:   [[3, 7],   [5, 11],  [6, 13],  [6, 14],  [7, 15],  [7, 16]],
    back:   [[-4, -2], [-6, -3], [-7, -4], [-8, -4], [-9, -4], [-9, -5]],
  },
  2: {
    strong: [[8, 15],  [12, 23], [15, 28], [16, 31], [18, 33], [18, 35]],
    soft:   [[3, 7],   [5, 11],  [6, 13],  [6, 14],  [7, 15],  [7, 16]],
    back:   [[-4, -2], [-6, -3], [-7, -4], [-8, -4], [-9, -4], [-9, -5]],
  },
  3: {
    strong: [[7, 13],  [11, 20], [13, 24], [14, 27], [15, 29], [16, 30]],
    soft:   [[3, 6],   [5, 9],   [6, 11],  [6, 12],  [7, 13],  [7, 14]],
    back:   [[-4, -2], [-6, -3], [-7, -4], [-8, -4], [-9, -4], [-9, -5]],
  },
  4: {
    strong: [[6, 11],  [9, 17],  [11, 20], [12, 23], [13, 24], [14, 25]],
    soft:   [[2, 4],   [3, 6],   [4, 7],   [4, 8],   [4, 9],   [5, 9]],
    back:   [[-4, -2], [-6, -3], [-7, -4], [-8, -4], [-9, -4], [-9, -5]],
  },
  5: {
    strong: [[5, 9],   [8, 14],  [9, 17],  [10, 19], [11, 20], [12, 21]],
    soft:   [[2, 3],   [3, 5],   [4, 6],   [4, 6],   [4, 7],   [5, 7]],
    back:   [[-3, -2], [-5, -3], [-6, -4], [-6, -4], [-7, -4], [-7, -5]],
  },
}

// ── Universal action emoji buttons (same for all scam types, like Torn) ──
// Position matters, not the face. Faces vary per scam type in real Torn.
export const ACTION_EMOJIS = {
  strong:     { emoji: '\u{1F600}', label: 'Strong Forward' },
  soft:       { emoji: '\u{1F614}', label: 'Soft Forward' },
  back:       { emoji: '\u{1F633}', label: 'Backward' },
  accelerate: { emoji: '\u{1F914}', label: 'Accelerate' },
  capitalize: { emoji: '\u{1F4B2}', label: 'Capitalize' },
}

// ── Player dialogue lines per scam type ──────────────────
// 5-6 lines per action for variety. Picked by seeded RNG.
export const PLAYER_LINES = {
  delivery: {
    strong: [
      'Your package will be returned to sender in 2 hours!',
      'Ma\'am, this is the FINAL delivery attempt. After this we dispose of the item.',
      'The warehouse is full. If nobody claims this, it gets destroyed tonight.',
      'I need you to understand — once it\'s sent back to China, you\'ll never see it again.',
      'This is a high-value item. The carrier won\'t hold it past today.',
    ],
    soft: [
      'I completely understand the frustration. We really want to get this to you.',
      'We apologize for the mix-up. Let me personally make sure this gets resolved.',
      'I know it\'s been a hassle — that\'s exactly why I\'m calling, to help sort this out.',
      'Nobody likes missing a delivery. I\'m here to fix this for you right now.',
      'We take customer satisfaction very seriously. Let\'s get your package to you today.',
    ],
    back: [
      'Hold on, let me pull up your tracking information...',
      'One moment — I\'m checking with the warehouse about your shipment status.',
      'Let me transfer you to our dispatch team to confirm the details...',
      'I need to verify something with our system. Bear with me a moment.',
      'Can you give me that tracking number one more time? I want to double-check.',
    ],
    accelerate: [
      'The return shipment leaves in 30 minutes. This is extremely urgent.',
      'I\'ve already held this longer than I should have. My supervisor is asking questions.',
      'The delivery window closes at 5 PM. After that, there\'s nothing I can do.',
      'I\'m not supposed to tell you this, but they\'re clearing the warehouse tonight.',
      'Other customers are waiting for this shipping slot. I can\'t hold it much longer.',
    ],
    capitalize: [
      'Just a small redelivery fee of $3.99 and we\'ll have it to you by tomorrow.',
      'I\'ll need a card on file to confirm the new delivery address. Standard procedure.',
      'There\'s a $4.50 address verification charge. Can I get your card number?',
      'To process the redelivery, I just need to confirm your payment method.',
      'The rescheduling fee is minimal — just need your card details to proceed.',
    ],
    resolve: [
      'You can track the package yourself with this number: TRK-48271-US.',
      'Our call center is listed on the carrier\'s official website. Feel free to verify.',
      'I completely understand your caution. That\'s actually very smart of you.',
      'Let me give you our supervisor\'s direct line so you can call back if needed.',
      'I can email you the official redelivery notice with our company letterhead.',
    ],
  },
  family_emergency: {
    strong: [
      'Grandma, PLEASE, I\'m so scared! They said they\'d hurt me!',
      'I\'m crying right now. I don\'t know what to do. Please help me!',
      'If I don\'t get this money in the next hour, I don\'t know what\'ll happen to me.',
      'You\'re the only person I trust. Mom and Dad can\'t know about this!',
      'I\'m shaking. I\'ve never been this scared in my life. Please!',
    ],
    soft: [
      'I didn\'t want to worry you, but I didn\'t know who else to call...',
      'I know this sounds bad, but I promise I\'ll explain everything once I\'m safe.',
      'I\'m so embarrassed about this. Please don\'t tell anyone.',
      'You\'ve always been there for me. I just need your help one more time.',
      'I feel terrible asking, but you\'re the only one I can count on right now.',
    ],
    back: [
      'Let me start from the beginning — I was at this party and...',
      'OK so basically what happened was... it\'s a long story but...',
      'I know you have questions. Let me explain everything.',
      'It started when my friend asked me to drive them somewhere...',
      'I didn\'t do anything wrong, I swear. It was a misunderstanding.',
    ],
    accelerate: [
      'They\'re coming back in 20 minutes! There\'s no more time!',
      'The bail bondsman said if I don\'t pay by tonight, I stay in jail!',
      'My phone is about to die and they won\'t let me charge it!',
      'The lawyer said the judge won\'t wait. It has to be NOW.',
      'Please stop asking questions and just HELP me! I\'m begging you!',
    ],
    capitalize: [
      'Just go to Walgreens and get a $2,000 gift card. Read me the numbers.',
      'Wire $1,500 to this account. I\'ll pay you back Friday, I PROMISE.',
      'Can you send it through Zelle? I need it in the next 20 minutes.',
      'Buy two $500 Google Play cards and text me the codes. That\'s all I need.',
      'The lawyer takes Venmo. His handle is @legal-help-now. Please, just send it.',
    ],
    resolve: [
      'It\'s really me! Remember when we made cookies last Thanksgiving?',
      'Ask me anything — what\'s our dog\'s name? What street do you live on?',
      'I\'m using a friend\'s phone. That\'s why the number looks different.',
      'I KNOW it sounds weird but I swear on everything this is real.',
      'Call me back at this number if you don\'t believe me!',
    ],
  },
  prize_lottery: {
    strong: [
      'YOU WON! I\'m so excited to be making this call! This is HUGE!',
      'Ma\'am, you\'re about to become fifty thousand dollars richer!',
      'This is the single biggest prize in our promotion\'s history!',
      'I wish someone would call ME with this news! You are SO lucky!',
      'I\'ve been doing this job for 8 years and this is the largest prize I\'ve awarded!',
    ],
    soft: [
      'We\'ve awarded prizes to thousands of happy winners just like you.',
      'This promotion has been running for 12 years. We\'re very well established.',
      'Last month alone, we had 847 winners claim their prizes successfully.',
      'Your entry was randomly selected by our certified independent auditor.',
      'We partner with major brands — this is a legitimate customer rewards program.',
    ],
    back: [
      'Let me pull up your winning entry... yes, here it is. Entry #847291.',
      'Per federal regulation 47-B, I need to verify your identity before proceeding.',
      'Our compliance department requires three verification steps. This is step one.',
      'I\'m going to read you the official prize notification. Are you ready?',
      'Let me check — yes, your prize has been approved by our board of directors.',
    ],
    accelerate: [
      'If this prize isn\'t claimed by midnight, it rolls over to the next winner!',
      'I\'m only authorized to hold your prize for 24 more hours. After that...',
      'There are 3 other entries waiting to claim if you don\'t. Don\'t miss this!',
      'Our promotion ends THIS WEEK. This is truly your last chance.',
      'The IRS filing deadline for prize claims is tomorrow. After that, no exceptions.',
    ],
    capitalize: [
      'Just a $49.99 processing fee and we\'ll mail your check today!',
      'The tax withholding is $89. Once we receive that, your $50,000 ships.',
      'Pay the small handling fee and I\'ll personally FedEx your prize check.',
      'We need a $35 verification deposit, fully refundable once your check clears.',
      'The claim fee is $59.99. After that, you\'ll receive your prize within 5-7 days.',
    ],
    resolve: [
      'Our registration number is LP-2847-FL. Look us up with the FTC.',
      'I can transfer you to our verification department right now if you\'d like.',
      'We\'re listed on the National Sweepstakes Registry. Check for yourself.',
      'I\'ll email you the official prize notification letter with our corporate seal.',
      'Call us back at our main number if you want. 1-800-555-PRIZE.',
    ],
  },
  charity: {
    strong: [
      'Right now, as we speak, families are sleeping in the rubble.',
      'A child dies every 6 minutes from this crisis. Every dollar matters.',
      'I just got back from the field. The devastation is beyond what the news shows.',
      'These families lost EVERYTHING. Their homes, their belongings, their loved ones.',
      'The shelters are overflowing. People are sleeping in the streets tonight.',
    ],
    soft: [
      'Your generosity could feed a family for an entire month.',
      'Every donation, no matter how small, brings hope to someone who\'s lost everything.',
      'You seem like someone who truly cares about making a difference.',
      'Even $20 provides clean water for a village for a week.',
      'The families we help always ask us to thank our donors personally.',
    ],
    back: [
      'Let me tell you about Maria — she\'s 8 years old and lost both parents...',
      'We have photos from the field I can email you. The situation is heartbreaking.',
      'Our organization has been rated 4 stars by Charity Navigator...',
      'Let me share some numbers: last year we helped 47,000 families...',
      'I want you to understand exactly where your money goes. Let me explain.',
    ],
    accelerate: [
      'A generous donor is matching ALL gifts made TODAY. Double your impact!',
      'We\'re only $500 away from our emergency relief goal!',
      'The matching period ends at midnight. After that, no more double impact.',
      'Emergency supplies ship tomorrow morning. We need to hit our target tonight.',
      'Every hour we wait, the cost of aid goes up. We need help NOW.',
    ],
    capitalize: [
      'God bless you. Can I take your card number to process the donation?',
      'Thank you so much. I\'ll just need your payment details to finalize.',
      'Your generosity is incredible. Let me process your gift right away.',
      'What a beautiful soul you are. May I have your card to run the donation?',
      'I\'ll send you a tax receipt immediately. Just need your payment info.',
    ],
    resolve: [
      'We\'re a registered 501(c)(3). Our EIN is 84-2847291.',
      'You can verify us on charitynavigator.org. We have a 4-star rating.',
      'I completely understand wanting to verify. That shows good judgment.',
      'I can email you our annual report and audited financial statements.',
      'Our executive director\'s name is public. Google "Hope Relief Foundation."',
    ],
  },
  tech_support: {
    strong: [
      'Ma\'am, I\'m seeing CRITICAL alerts. Your files are being encrypted right now!',
      'There are 47 active threats detected. Your banking passwords are exposed!',
      'Someone in Eastern Europe is accessing your webcam at this very moment!',
      'Your system is sending spam to your entire contact list. We need to act NOW.',
      'I can see a keylogger recording everything you type. Your bank account is at risk!',
    ],
    soft: [
      'Don\'t worry, this is exactly what we\'re trained to handle. You\'re in good hands.',
      'I help about 30 people a day with this exact issue. It\'s very fixable.',
      'Take a deep breath. We\'re going to solve this together, step by step.',
      'This is actually a very common infection. The important thing is you called.',
      'You made the right decision calling us. Most people ignore the warnings.',
    ],
    back: [
      'Let me run a deeper scan... one moment... yes, as I suspected...',
      'I\'m going to escalate this to our Level 2 security team. Hold on...',
      'I need to check something in your system registry. Can you open Run?',
      'Let me consult with my senior technician about these specific threat signatures...',
      'I want to double-check the infection path. Let me pull up the event log...',
    ],
    accelerate: [
      'The hackers are transferring money from your bank account RIGHT NOW!',
      'Your identity is being sold on the dark web as we speak!',
      'If we don\'t act in the next 5 minutes, the damage will be permanent!',
      'I just saw another breach attempt. They\'re getting more aggressive!',
      'Your Social Security number just appeared on a hacker forum. We MUST act now!',
    ],
    capitalize: [
      'Our one-time cleanup and protection package is $299. Shall I proceed?',
      'The security license to remove all threats costs $249. I\'ll install it remotely.',
      'Purchase our enterprise firewall for $399 and all 47 threats are gone today.',
      'For $199 I can deploy our military-grade antivirus right now.',
      'The threat removal tool requires a $349 license. I\'ll activate it immediately.',
    ],
    resolve: [
      'My Microsoft certification number is MS-TEC-48271. You can verify online.',
      'We\'re an authorized Microsoft Gold Partner. Check the partner directory.',
      'I\'m going to give you our direct support line so you can call back anytime.',
      'If you open Event Viewer, you\'ll see the same errors I\'m describing.',
      'Let me show you the threats in your Task Manager. Do you see iexplore.exe?',
    ],
  },
  vacation: {
    strong: [
      'Close your eyes. Picture yourself on white sand, crystal blue water, a cocktail in hand...',
      'This is the trip of a lifetime. People DREAM about this for years.',
      'You work so hard. Don\'t you deserve this? When was your last real vacation?',
      'This package normally retails for $4,200. You\'re getting it for a FRACTION.',
      'I just booked this same trip for my sister. She\'s leaving next month!',
    ],
    soft: [
      'This is an exclusive, invitation-only rate for select customers.',
      'You were personally selected from our premium client database.',
      'We only extend this pricing to 50 people per quarter. You\'re one of them.',
      'The resort handpicked this offer for guests who appreciate luxury.',
      'This isn\'t a mass market deal. This is curated, just for you.',
    ],
    back: [
      'Let me pull up the full package details and photo gallery...',
      'I have the resort\'s virtual tour bookmarked — shall I walk you through it?',
      'The all-inclusive amenities include spa, dining, watersports, and...',
      'Let me check — yes, the ocean-view suite is still available for your dates.',
      'I want to make sure I\'m showing you the right package. What dates were you thinking?',
    ],
    accelerate: [
      'I just checked — only 2 rooms left at this price. Another agent is on the phone right now.',
      'The hotel is releasing our room block back to the public tomorrow morning.',
      'I literally have another caller on hold waiting for this same package.',
      'Prices go up 40% on the 1st. This is the last week at current rates.',
      'My manager just told me this promotion is ending in 3 hours.',
    ],
    capitalize: [
      'Just a $199 deposit locks in your dates. Fully refundable within 72 hours.',
      'I\'ll need a credit card to hold the reservation. You won\'t be charged until checkout.',
      'A small booking fee of $149 and you\'re confirmed. I\'ll email you the itinerary.',
      'Card number, expiration, and CVV — and your tropical getaway is booked!',
      'Put down $249 today and the rest is due 30 days before departure.',
    ],
    resolve: [
      'The resort is on Booking.com and TripAdvisor with 4.5 stars.',
      'I can send you a link to the resort\'s official website right now.',
      'We\'re accredited by the Better Business Bureau with an A+ rating.',
      'Call the resort\'s front desk directly — they\'ll confirm our partnership.',
      'Google "Caribbean Premier Travel." We\'ve been in business since 2008.',
    ],
  },
  tax_irs: {
    strong: [
      'Federal agents have been dispatched to your home address.',
      'A bench warrant for your arrest has already been signed by the judge.',
      'Your bank accounts will be frozen and your wages garnished starting tomorrow.',
      'This is a federal offense. The penalties include up to 5 years imprisonment.',
      'The U.S. Marshals Service has been notified. This is your final opportunity.',
    ],
    soft: [
      'This is actually a routine collections matter. Nothing to be alarmed about.',
      'According to case file #TC-4892, you have an outstanding balance from 2019.',
      'Many taxpayers find themselves in this situation. It\'s more common than you think.',
      'The IRS just wants what\'s owed. Once paid, this goes away completely.',
      'I see cases like yours every day. A quick payment and it\'s resolved.',
    ],
    back: [
      'Let me transfer you to my supervisor, Agent Williams, for authorization...',
      'One moment while I pull up your complete tax history...',
      'I need to verify your Social Security number against our records...',
      'Let me check the latest audit report... yes, the amount is confirmed.',
      'I\'m going to conference in our collections department to expedite this.',
    ],
    accelerate: [
      'You have until 5 PM today before the warrant becomes active.',
      'Officers are 30 minutes away from your location. This is NOT a drill.',
      'Your employer has already been contacted. Garnishment begins Friday.',
      'The court hearing is scheduled for tomorrow. You can avoid it by paying now.',
      'I\'ve done everything I can to delay this. I can\'t hold them off any longer.',
    ],
    capitalize: [
      'A payment of $4,327 settles your account in full. How would you like to pay?',
      'Wire transfer is the fastest way to stop the enforcement action.',
      'For urgent cases, we accept payment via gift cards to our registered account.',
      'I can process your payment right now. What card would you like to use?',
      'Pay $4,327 today and I\'ll personally close your case file.',
    ],
    resolve: [
      'My badge number is IRS-4892. Call the main IRS line to verify.',
      'Your case reference is TC-2024-48271. Quote it when you call back.',
      'I can provide our Washington D.C. office address for your records.',
      'The IRS sent you a notice last month. Check your mail from January.',
      'I\'m going to give you a callback number that goes through our main switchboard.',
    ],
  },
  advance_fee: {
    strong: [
      'My friend, your share alone would be 4.2 million US dollars.',
      'This money has been sitting in a vault for 3 years waiting for someone like you.',
      'My late father was the finance minister. This is a once-in-a-lifetime opportunity.',
      'Nobody else in the world can claim this inheritance. Only you can help.',
      'Imagine what you could do with $4.2 million. A new house, retire early...',
    ],
    soft: [
      'I chose you specifically because I could see you are a person of integrity.',
      'My father always said: trust the Americans. They keep their word.',
      'I have been praying for months to find someone trustworthy. God sent you.',
      'I know this is unusual, but extraordinary circumstances call for extraordinary trust.',
      'You are the only one who has responded with kindness. The others all ignored me.',
    ],
    back: [
      'The Central Bank requires one additional form to release the funds...',
      'There is a small bureaucratic issue — the probate court needs a filing...',
      'My lawyer, Mr. Okonkwo, is preparing the final transfer documents...',
      'The estate executor requires a third-party verification before disbursement.',
      'Let me consult with the bank\'s foreign transfer department about the timeline.',
    ],
    accelerate: [
      'The government will seize the entire estate if we don\'t act by Friday!',
      'My visa expires next week. After that, I cannot authorize the transfer.',
      'The bank is under audit. Once they freeze accounts, the money is gone forever.',
      'Political unrest in my country means the window is closing FAST.',
      'Another party is claiming rights to the estate. We must move before they do.',
    ],
    capitalize: [
      'A transfer fee of $500 is all that stands between you and 4.2 million.',
      'The bank requires a $750 international processing fee. After that, the millions are yours.',
      'Just $400 for the legal filing, and Mr. Okonkwo will release the funds.',
      'Wire $600 to cover the tax certificate. It\'s the last step, I promise.',
      'The notarization costs $350. Once paid, the full amount transfers within 48 hours.',
    ],
    resolve: [
      'I will send you a photo of my passport and my father\'s death certificate.',
      'Here is the bank\'s official reference number: CBN-2024-847291.',
      'My lawyer will provide a signed affidavit. His bar number is NGA-4827.',
      'I can arrange a three-way call with the bank manager to confirm.',
      'Google my father\'s name: Minister Abubakar. You will see the news articles.',
    ],
  },
  job: {
    strong: [
      'Our top performers earn $10,000 in their first month alone!',
      'Lisa from Ohio started 6 months ago. She just bought a brand new BMW.',
      'This position has UNLIMITED earning potential. The sky is truly the limit.',
      'We had someone earn $50,000 in their first quarter. Not typical, but possible.',
      'Imagine telling your boss you quit because you found something better. That\'s this.',
    ],
    soft: [
      'Your background is exactly what we\'re looking for. You\'d be a perfect fit.',
      'Honestly? Your application was the strongest we\'ve reviewed all month.',
      'The hiring committee was really impressed. They flagged your file personally.',
      'We think you have real potential here. This could change your career.',
      'Most people work jobs they hate. This is your chance to actually enjoy Mondays.',
    ],
    back: [
      'Let me check with HR about your start date availability...',
      'Just a few more steps in the onboarding process, then you\'re all set.',
      'I need to verify one thing with our compliance department. One moment...',
      'Let me pull up the full job description and benefits package for you.',
      'Our training coordinator needs a couple of details before we can finalize.',
    ],
    accelerate: [
      'I have 50 applicants for this position and you\'re my top pick. But I can\'t hold it.',
      'The cohort starts Monday. If you\'re not in, the slot goes to the next candidate.',
      'My hiring authority expires at 5 PM today. After that, I can\'t guarantee anything.',
      'Another candidate just called to accept. I\'m giving you first right of refusal.',
      'The position was supposed to close yesterday. I pulled strings to keep it open for you.',
    ],
    capitalize: [
      'The training materials package costs $200. You start earning immediately after.',
      'A $150 equipment deposit secures your workstation. It\'s refundable after 90 days.',
      'Background check and onboarding fee is $175. Standard for all new hires.',
      'Send the $250 software license fee and we\'ll activate your agent account today.',
      'Once we receive the $200 processing fee, I\'ll send your employee ID and login.',
    ],
    resolve: [
      'Look us up on LinkedIn. We have over 12,000 employees worldwide.',
      'I can connect you with three current employees who can vouch for us.',
      'We were just featured in Forbes\' list of fastest-growing companies.',
      'Our CEO does a public Q&A on YouTube every month. Very transparent.',
      'Check Glassdoor — we have a 4.2 star rating from real employees.',
    ],
  },
  romance: {
    strong: [
      'I have never, ever felt this way about anyone before in my life.',
      'When I read your messages, my heart beats so fast I can barely breathe.',
      'You are the reason I smile every morning. I can\'t imagine life without you.',
      'I dream about you every single night. Is that crazy? I don\'t care if it is.',
      'I\'ve been hurt so many times, but with you... it\'s different. You\'re my everything.',
    ],
    soft: [
      'You have the most beautiful soul I\'ve ever encountered. Inside and out.',
      'The way you talk about your family — it shows what an incredible person you are.',
      'I feel so comfortable with you. Like I can finally be myself.',
      'Every conversation with you makes me feel like the luckiest person alive.',
      'Your kindness, your warmth — you make the world a better place just by existing.',
    ],
    back: [
      'I want to tell you something, but I\'m afraid you\'ll think less of me...',
      'My last relationship destroyed me. I need to take things slow, okay?',
      'I don\'t usually open up like this. There\'s something about you that\'s different.',
      'Can I be honest? I\'ve been holding back because I don\'t want to scare you away.',
      'There\'s a reason I haven\'t talked about my past. It\'s... complicated.',
    ],
    accelerate: [
      'I\'m saving every penny for my flight to come see you. It\'s all I think about.',
      'My contract ends next month and then NOTHING will keep us apart.',
      'When we finally meet, I\'m going to hold you and never let go.',
      'I told my mother about you. She says I\'ve never sounded this happy.',
      'I\'ve already started looking at apartments in your city. Is that too fast?',
    ],
    capitalize: [
      'My love, something terrible happened. I was in an accident and the hospital bills...',
      'I\'m so ashamed to ask, but my wallet was stolen and I can\'t pay my rent this month.',
      'The platform is holding my paycheck and I need $800 for a flight to see you.',
      'My mother needs surgery and I\'m $2,000 short. I don\'t know what to do.',
      'Baby, I hate asking, but could you help with $500? Just until I get paid Friday.',
    ],
    resolve: [
      'I\'ll video call you this weekend, I swear! My phone camera just broke.',
      'Let me send you more photos right now. Look — that\'s me at the beach.',
      'How can you doubt what we have? After everything we\'ve shared?',
      'I can\'t believe you\'d question my feelings. This is exactly what my ex did.',
      'Ask me anything about myself. Test me. I have nothing to hide from you.',
    ],
  },
  investment: {
    strong: [
      'Look at this — 847% returns in the last quarter alone. The numbers don\'t lie.',
      'Our algorithm predicted the last 3 Bitcoin crashes before they happened.',
      'Even in our WORST month, our clients still saw +32% returns.',
      'Last month we turned $5,000 into $47,000 for a client in Dallas.',
      'The hedge fund managers on Wall Street wish they had access to this technology.',
    ],
    soft: [
      'The technology behind our platform is based on quantum machine learning.',
      'I\'d love to walk you through the algorithm. It\'s actually fascinating.',
      'Our AI analyzes 10 million data points per second across 47 exchanges.',
      'The whitepaper has been peer-reviewed by MIT and Stanford researchers.',
      'Think of it like compound interest, but accelerated by artificial intelligence.',
    ],
    back: [
      'Here\'s our audited performance report from PricewaterhouseCoopers...',
      'Let me pull up the real-time dashboard. You can see the trades happening live.',
      'I\'ll send you our quarterly report. The data speaks for itself.',
      'Let me show you the historical backtesting — the model works in all market conditions.',
      'I want to make sure you fully understand the opportunity before you commit.',
    ],
    accelerate: [
      'The Series B funding round closes at midnight. After that, the price doubles.',
      'Bitcoin is about to surge — our AI is showing a 94% confidence signal right now.',
      'Early investors get 3x the token allocation. This window won\'t last.',
      'Our platform launches publicly next month. Right now, you get the insider price.',
      'Three spots left in the founders\' tier. After that, it\'s standard rates.',
    ],
    capitalize: [
      'Minimum investment is $5,000 to activate your trading account.',
      'Wire your stake to our custodial account and watch your dashboard light up.',
      'Transfer $10,000 and you\'ll be in our VIP tier with priority withdrawals.',
      'Send the funds to this wallet address and your bot starts trading within the hour.',
      'A $7,500 initial deposit gets you into the founders\' pool with bonus returns.',
    ],
    resolve: [
      'We\'re registered with the SEC. You can verify at investor.gov.',
      'Our CEO was just featured on Bloomberg and CNBC last week.',
      'I can connect you with three current investors who\'ll share their experience.',
      'Check our TrustPilot page — over 2,000 five-star reviews from real clients.',
      'Here\'s our regulatory filing number: SEC-2024-847291. Look it up yourself.',
    ],
  },
}

// ── Mark responses per scam type (contextual, realistic) ──────
// Keyed by scam ID → cell situation → array of response variants
export const MARK_RESPONSES = {
  delivery: {
    neutral: ['OK, I\'m listening. What do I need to do?', 'Go on...', 'Alright, what\'s the next step?', 'I see. And then what?', 'Mmhmm, continue.'],
    interested: ['Oh! I have been expecting a package!', 'Wait, yes — I did order something recently!', 'Oh no, I really need that delivery!', 'Yes! I was wondering where that was!', 'That must be my Amazon order!'],
    concerned: ['Wait... why do you need my card number for a delivery?', 'How do I know you\'re actually from the shipping company?', 'This feels off. Real carriers leave a slip at the door.', 'I\'ve never had to pay to receive a package before.', 'My son said to be careful about calls like this...'],
    hesitant: ['Let me think about this for a moment...', 'Can I call you back? I want to check my tracking.', 'Hold on, I need to find my order confirmation first.', 'Give me a minute, I want to look this up.', 'I\'m not sure. Let me think.'],
    tempted: ['You know what, I DO really need that package.', 'Fine, let\'s just get this done. What do you need?', 'OK, I can\'t afford to lose this delivery.', 'Alright, alright, let\'s hurry up and fix this.'],
    suspicious: ['I just checked — my tracking says it\'s being delivered today.', 'Wait, UPS doesn\'t call people. They leave notes.', 'I\'m going to call the carrier directly.', 'This doesn\'t add up. The real company has my address.', 'My neighbor said this is a scam.'],
    convinced: ['OK, what do you need from me?', 'Fine, let\'s just resolve this.', 'Alright, I trust you. What\'s next?', 'OK, go ahead.', 'Sure, tell me what to do.'],
  },
  family_emergency: {
    neutral: ['Oh my... what happened?', 'Tell me everything.', 'Are you hurt?', 'Oh dear, slow down. What\'s going on?', 'OK, OK, I\'m listening.'],
    interested: ['Of course I\'ll help! Tell me what you need!', 'Anything for you, sweetheart!', 'How much do you need? I\'ll get it right now.', 'Don\'t worry, we\'ll figure this out!', 'I\'ll do whatever it takes to help.'],
    concerned: ['Wait... you don\'t sound like yourself.', 'Why can\'t I reach you at your normal number?', 'Let me call your mother first to make sure.', 'Something about this doesn\'t feel right...', 'Why can\'t you tell your parents?'],
    hesitant: ['I need to think about this...', 'Let me call your father and see what he says.', 'I don\'t know, honey. This is a lot of money.', 'Can you call me back from a number I recognize?', 'Give me a moment, I\'m overwhelmed.'],
    tempted: ['You\'re right, there\'s no time to waste!', 'OK, family is everything. I\'ll do it.', 'I can\'t stand the thought of you in trouble!', 'Of course! What kind of grandma would I be if I didn\'t help?'],
    suspicious: ['I just called your mother. She says you\'re at home watching TV.', 'You can\'t answer the question I asked. Who are you really?', 'I\'m going to hang up and call 911.', 'My grandson doesn\'t call me "Grandma." Nice try.', 'I saw this exact scam on the news last week.'],
    convinced: ['OK honey, I\'m going to the store right now.', 'I\'ll wire it. Just tell me where to send it.', 'Don\'t cry, baby. I\'m getting the money right now.', 'Grandma\'s going to fix this. Don\'t worry.', 'Let me get my purse.'],
  },
  prize_lottery: {
    neutral: ['Really? I won something?', 'Hmm, I don\'t remember entering anything...', 'OK, tell me more.', 'I\'m listening.', 'Is this for real?'],
    interested: ['Oh my goodness! Fifty thousand dollars?!', 'I can\'t believe it! This is amazing!', 'Wait, seriously?! I never win anything!', 'Oh wow! What do I need to do to claim it?', 'This is the best news I\'ve gotten all year!'],
    concerned: ['I didn\'t enter any contest though...', 'Why would I need to PAY to receive a prize?', 'This sounds like those scams my friend warned me about.', 'Can you send me something in writing first?', 'How did you get my phone number?'],
    hesitant: ['I need to think about this...', 'Let me talk to my husband first.', 'Can I call you back tomorrow?', 'I want to look into this before I do anything.', 'This seems too good to be true...'],
    tempted: ['$50,000 would change everything!', 'Oh my... I could finally pay off my mortgage!', 'Think of what I could do with that money!', 'I\'ve always dreamed of something like this!'],
    suspicious: ['I\'m going to look up your company right now.', 'Real lotteries don\'t call you and ask for money.', 'I\'ve reported this number to the FTC.', 'My son works in law enforcement. Want me to ask him?', 'Why would a legitimate prize require a fee?'],
    convinced: ['OK, I\'ll pay the fee! I don\'t want to lose this!', 'Take my card number. I\'m SO excited!', 'Yes! Let\'s do this! What do you need?', 'I can\'t wait to tell my family!', 'Just tell me where to send it!'],
  },
  charity: {
    neutral: ['That does sound terrible. Tell me more.', 'I see. What organization are you with?', 'Mm, I have been hearing about that on the news.', 'Go on, I\'m listening.', 'What kind of help do they need?'],
    interested: ['Oh, that\'s heartbreaking. I want to help!', 'I\'d love to donate something. How can I help?', 'Yes, I feel so bad for those poor families.', 'I was just telling my friend I wanted to do something.', 'That really touches my heart.'],
    concerned: ['How do I know the money actually goes to the families?', 'I\'ve never heard of your organization before.', 'Can you send me paperwork? I don\'t donate over the phone.', 'Why are you calling me instead of being on the ground helping?', 'A lot of fake charities pop up after disasters...'],
    hesitant: ['I need to discuss this with my spouse first.', 'Can I think about it and call you back?', 'I usually donate to my church. Let me check with my pastor.', 'I want to research your organization first.', 'Let me pray on it and get back to you.'],
    tempted: ['You\'re right, I should act now while the matching is active!', 'Those poor children... OK, I can\'t just sit here and do nothing.', 'A double impact? That\'s hard to pass up.', 'If there\'s a matching donor, my money goes twice as far!'],
    suspicious: ['I just Googled your organization. Nothing comes up.', 'The real Red Cross doesn\'t cold-call people.', 'I only donate through verified channels like GoFundMe.', 'My financial advisor says never donate over the phone.', 'I\'m going to verify your tax-exempt status with the IRS.'],
    convinced: ['Alright, here\'s my card. God bless those families.', 'Yes, take my donation. I want to help however I can.', 'Let\'s do it. Every little bit helps, right?', 'OK, I\'m in. What do you need from me?', 'Bless your heart for doing this work. Here\'s my payment.'],
  },
  tech_support: {
    neutral: ['Oh dear, really? What should I do?', 'A virus? Oh no...', 'I see something on my screen. Is that the warning?', 'OK, what do I need to do?', 'I\'m not very good with computers. Help me.'],
    interested: ['Oh thank goodness you called! I knew something was wrong!', 'YES! My computer HAS been running slow! You must be right!', 'Please help me! I have all my family photos on here!', 'I can\'t lose my files! Please fix it!', 'My grandson set up my computer. He\'d be so upset if I got a virus.'],
    concerned: ['Wait, how can you see my computer? I didn\'t give you access.', 'Microsoft doesn\'t call people, do they?', 'My nephew said these calls are always scams.', 'Why do I have to pay? Isn\'t Windows security supposed to be free?', 'I\'m going to ask my neighbor. He\'s good with computers.'],
    hesitant: ['I don\'t know about this... let me ask someone first.', 'Can I take your number and call you back?', 'I need to think about this. $299 is a lot of money.', 'Let me turn off my computer and figure this out later.', 'I want to take it to the Geek Squad first.'],
    tempted: ['You can see the hackers on my computer?! Fix it, please!', 'My bank account?! Oh no, please help me RIGHT NOW!', 'OK OK, I\'ll do whatever you say. Just make them stop!', 'If they\'re downloading my photos, I need you to stop them!'],
    suspicious: ['I just called Microsoft. They said they never make outbound calls.', 'My grandson says what you showed me is just normal Windows processes.', 'If this were real, my antivirus would have caught it.', 'I\'m going to hang up and take my computer to a real tech shop.', 'You\'re not from Microsoft. I can tell.'],
    convinced: ['OK, please fix it! What do I need to buy?', 'Just tell me how to pay and make this go away.', 'Yes, protect my computer! Here\'s my card.', '$299 is worth it if it saves my files.', 'Go ahead, I trust you. Fix it please.'],
  },
  vacation: {
    neutral: ['Hmm, that does sound nice.', '$199? For a whole cruise?', 'I\'m listening. Tell me more about it.', 'Interesting. What\'s included?', 'Where exactly is this resort?'],
    interested: ['Oh wow, I\'ve been wanting to take a vacation!', '$199?! That\'s incredible! Tell me everything!', 'My husband and I were JUST talking about a getaway!', 'An ocean view for that price? Sign me up!', 'I haven\'t had a real vacation in 3 years!'],
    concerned: ['That price seems way too low. What\'s the catch?', 'Are there hidden fees? This sounds too good to be true.', 'I tried Googling your travel agency and nothing comes up.', 'Why do I need to book RIGHT NOW if it\'s such a good deal?', 'Can you send me something in writing first?'],
    hesitant: ['I need to check my work schedule first.', 'Let me talk to my husband before I commit to anything.', 'Can I call you back after I look at my calendar?', 'I don\'t usually make decisions like this on the spot.', 'Give me a day to think about it.'],
    tempted: ['You know what? I DO deserve a vacation!', 'Only 2 spots left? I can\'t miss this!', 'My friend would be SO jealous if I went to the Bahamas!', 'OK, you convinced me. White sand and cocktails, here I come!'],
    suspicious: ['I checked — that resort doesn\'t have a partnership with any third-party agency.', 'The BBB has no record of your company.', 'My travel agent friend says this is a classic vacation scam.', 'Real resorts don\'t sell through cold calls.', 'I called the hotel directly. They\'ve never heard of you.'],
    convinced: ['Book it! I\'m so excited!', 'Take my card! This is going to be amazing!', 'Yes! Lock in my dates right now!', 'I can\'t wait! How do I pay?', 'Let\'s do it. I deserve this!'],
  },
  tax_irs: {
    neutral: ['Uh... what? I owe taxes?', 'The IRS? Are you serious?', 'OK, tell me what this is about.', 'I don\'t understand. I filed my taxes.', 'What do you mean, a warrant?'],
    interested: ['Oh God. How do I fix this?', 'I had no idea! What do I need to do?', 'Please, I can\'t go to jail! Tell me how to pay!', 'I\'ll do whatever it takes to resolve this!', 'I don\'t want any trouble with the IRS!'],
    concerned: ['Wait, the IRS sends letters. They don\'t call people.', 'Why are you asking for gift cards? That\'s not how the IRS works.', 'Let me call the IRS directly to verify this.', 'I\'m going to ask my accountant about this.', 'This sounds like that IRS phone scam I heard about.'],
    hesitant: ['I need to check my records first.', 'Let me call my tax preparer.', 'Can you give me a day to look into this?', 'I don\'t make payments over the phone.', 'I want to verify this before I do anything.'],
    tempted: ['Officers are coming HERE?! OK, what do I pay?!', 'I can\'t have my wages garnished! I\'ll pay!', 'Please don\'t freeze my accounts! I have bills!', 'If paying this makes it go away, fine!'],
    suspicious: ['I just called the real IRS. There\'s no balance on my account.', 'The real IRS would never threaten arrest over the phone.', 'Gift cards? Seriously? The IRS takes checks and bank transfers.', 'I\'m recording this call. What\'s your real name?', 'I\'ve reported this number to the FTC.'],
    convinced: ['OK, OK. Just tell me where to send the money.', 'I\'ll pay. I can\'t risk going to jail.', 'Fine. What kind of gift cards do you need?', 'I\'ll wire it right now. Please stop the officers.', 'Take my card. Just make this go away.'],
  },
  advance_fee: {
    neutral: ['A prince? Really?', 'That\'s... quite a story.', 'Go on, I\'m intrigued.', '$15 million? Hmm.', 'How did you find me?'],
    interested: ['$4.2 million?! Tell me more!', 'I\'ve always dreamed of something like this happening!', 'What would I need to do on my end?', 'This could change my life! What\'s the process?', 'I can\'t believe you chose ME!'],
    concerned: ['Why would a stranger trust me with millions of dollars?', 'If you have $15 million, why can\'t you pay a $500 fee yourself?', 'This sounds exactly like a Nigerian prince scam.', 'I need to verify your identity before going further.', 'My bank said to be careful about international transfers.'],
    hesitant: ['I need to think about this carefully.', 'Let me consult with my financial advisor.', 'Can you send me official documents first?', 'I don\'t make financial decisions quickly.', 'This is a lot to process. Give me time.'],
    tempted: ['$4.2 million... I could retire!', 'The fee is nothing compared to what I\'d receive!', 'OK, what\'s $500 compared to $4 million?', 'I can\'t pass this up!'],
    suspicious: ['I Googled "Nigerian prince scam" and your script is word for word.', 'If this money exists, why haven\'t you used a real bank?', 'I showed your emails to my lawyer. He\'s laughing.', 'Why does every email you send come from a different address?', 'I\'ve forwarded this to the FBI\'s IC3 tip line.'],
    convinced: ['OK, I\'ll send the fee. When do I get my share?', 'Take my payment. I trust you.', 'Here\'s the wire transfer info. $500, right?', 'I\'ll pay. Just promise this is real.', 'Fine, what account do I send it to?'],
  },
  job: {
    neutral: ['$5,000 a week? Tell me more.', 'What kind of work is it exactly?', 'Is this remote?', 'I\'m listening. What does the job involve?', 'Hmm, interesting. Go on.'],
    interested: ['This is exactly what I\'ve been looking for!', '$10K in the first month? That\'s incredible!', 'I\'ve been job searching for weeks. This sounds perfect!', 'No experience needed? I can start right away!', 'When can I begin?'],
    concerned: ['Why do I need to pay to start a job?', 'Legitimate companies don\'t charge employees.', 'I can\'t find your company on LinkedIn or Glassdoor.', 'Why is the salary so much higher than market rate?', 'My career counselor says to be wary of upfront fees.'],
    hesitant: ['I need to research the company first.', 'Can I have a day to think about it?', 'Let me talk to my family before I commit.', 'This is moving too fast for me.', 'I want to see a real job description first.'],
    tempted: ['$10K a month from home? I\'d be crazy to say no!', 'I need this so badly. My unemployment runs out next week.', 'OK, the training fee is nothing compared to what I\'d earn!', 'If Lisa bought a BMW, I can afford $200!'],
    suspicious: ['I searched your company — the address is a vacant lot.', 'Real employers pay for training, not the other way around.', 'The email came from a Gmail account, not a corporate domain.', 'I showed this to my friend in HR. She says it\'s a scam.', 'Why can\'t I find any employees on LinkedIn?'],
    convinced: ['OK, sign me up! I\'ll pay the fee.', 'Let me get my card. I\'m ready to start!', 'I\'m doing this. I need the money too badly to pass up.', 'Take my payment. When do I start?', 'Fine, $200 is worth it for this kind of money.'],
  },
  romance: {
    neutral: ['That\'s sweet of you to say.', 'You really think so?', 'We do have a special connection.', 'I enjoy talking to you too.', 'Go on... I\'m blushing.'],
    interested: ['I feel the same way! I\'ve never connected with anyone like this!', 'You make me feel so special. Nobody has ever talked to me like you do.', 'I think I\'m falling for you too...', 'When can we meet? I can\'t wait!', 'I dream about you too. Is that weird?'],
    concerned: ['Why won\'t you ever video call me?', 'You always have an excuse not to meet up.', 'I showed your photos to a friend and she said they look like stock photos.', 'We\'ve been talking for months but I\'ve never heard your voice.', 'My daughter says I should be more careful online.'],
    hesitant: ['I need to slow down a bit.', 'This is moving really fast for me.', 'Can we just... take a step back?', 'I\'m not sure I\'m ready for this.', 'Let me process my feelings.'],
    tempted: ['Oh my gosh, a flight to see me?! Really?!', 'I would do anything to finally meet you!', 'You told your mother about me? That\'s so serious!', 'OK, I admit it — I\'m completely in love with you.'],
    suspicious: ['I reverse image searched your photos. They belong to a fitness model in Brazil.', 'You\'ve asked me for money three times now. Real love doesn\'t cost money.', 'My friend said this is textbook romance scam behavior.', 'Why did you get angry when I asked to video call?', 'I\'m talking to the police about this.'],
    convinced: ['I\'ll send the money, baby. I love you.', 'Of course I\'ll help! You\'d do the same for me.', 'Don\'t worry about the hospital bills. I\'ll take care of it.', 'Here — take my card info. Get better soon, my love.', 'Anything for you. Just promise me we\'ll meet soon.'],
  },
  investment: {
    neutral: ['300% returns? Tell me more about this.', 'What kind of algorithm?', 'I\'m listening. How does it work?', 'Hmm, interesting. Continue.', 'And what\'s the minimum to start?'],
    interested: ['847%?! That\'s insane! How do I get in?', 'I have some savings I\'ve been wanting to invest!', 'My 401k has barely grown. This could be the answer!', 'When can I start seeing returns?', 'I want in! What do I need to do?'],
    concerned: ['No legitimate investment guarantees returns.', 'Is this registered with the SEC?', 'How is 847% even possible without massive risk?', 'My financial advisor never heard of your platform.', 'This sounds like a Ponzi scheme to me.'],
    hesitant: ['Let me run this by my accountant first.', 'I don\'t make investment decisions on the spot.', 'Can I review the prospectus first?', 'I want to do my own research.', 'Give me a week to think about it.'],
    tempted: ['If the round closes tonight, I don\'t want to miss out!', '$5,000 could turn into $50,000? I\'d be stupid not to!', 'My friend missed Bitcoin. I\'m NOT making the same mistake!', 'Early investors always win big. I need to get in NOW!'],
    suspicious: ['I checked the SEC database. Your company isn\'t registered.', 'The crypto wallet you sent me traces to known fraud rings.', 'There are zero verifiable records of your "MIT peer review."', 'TrustPilot says all your reviews were posted on the same day.', 'I\'m reporting this to the FBI\'s financial crimes unit.'],
    convinced: ['Take my money! I\'m transferring $5,000 right now.', 'I\'m all in. Send me the wire instructions.', 'Here\'s my investment. Don\'t let me down!', 'Let\'s do $10,000 for the VIP tier.', 'I trust you. Activate my account.'],
  },
}

// ── Per-scam response type names (Torn uses different labels per scam) ──
// Keys map to action types: strong, soft, back, accelerate
export const RESPONSE_TYPE_NAMES = {
  delivery:         { strong: 'Professional', soft: 'Terse', back: 'Reassuring', accelerate: 'Threatening' },
  family_emergency: { strong: 'Desperate', soft: 'Emotional', back: 'Stalling', accelerate: 'Panicked' },
  prize_lottery:    { strong: 'Enthusiastic', soft: 'Credible', back: 'Procedural', accelerate: 'Urgent' },
  charity:          { strong: 'Heartbreaking', soft: 'Compassionate', back: 'Informative', accelerate: 'Urgent' },
  tech_support:     { strong: 'Alarming', soft: 'Reassuring', back: 'Technical', accelerate: 'Critical' },
  vacation:         { strong: 'Enticing', soft: 'Exclusive', back: 'Detailed', accelerate: 'Scarce' },
  tax_irs:          { strong: 'Threatening', soft: 'Procedural', back: 'Bureaucratic', accelerate: 'Escalating' },
  advance_fee:      { strong: 'Lavish', soft: 'Trusting', back: 'Bureaucratic', accelerate: 'Desperate' },
  job:              { strong: 'Motivating', soft: 'Flattering', back: 'Administrative', accelerate: 'Pressuring' },
  romance:          { strong: 'Passionate', soft: 'Tender', back: 'Vulnerable', accelerate: 'Devoted' },
  investment:       { strong: 'Impressive', soft: 'Technical', back: 'Analytical', accelerate: 'Exclusive' },
}

// ── Narrative templates (third-person story text like Torn's outcomeContent) ──
// Each template uses {mark} for mark name, {email} for email, {scam} for scam name.
// Templates are per scam type → situation → array of variants.
export const NARRATIVE_TEMPLATES = {
  delivery: {
    email_read: [
      'You compose a delivery notification email to {mark} at {email}, claiming their package couldn\'t be delivered and requires address confirmation. The email includes a convincing tracking number and carrier branding.',
      'An urgent delivery failure notice is drafted for {mark}. The message warns that their package will be returned to sender within 24 hours unless they verify their address immediately.',
    ],
    strong: [
      'You press {mark} with urgency about their undelivered package. "{playerLine}" {mark} shifts uncomfortably — the pressure is working.',
      'Taking a firm, professional tone, you warn {mark} about the tight timeline. "{playerLine}" The mark seems to take the deadline seriously.',
    ],
    soft: [
      'You soften your approach, showing empathy for {mark}\'s delivery troubles. "{playerLine}" They seem to appreciate the understanding tone.',
      'With a reassuring voice, you promise {mark} a smooth resolution. "{playerLine}" The mark relaxes slightly.',
    ],
    back: [
      'You buy time, pretending to check {mark}\'s shipment status. "{playerLine}" The pause gives the mark a moment to think.',
      'Stalling for time, you put {mark} through a series of verification steps. "{playerLine}" They wait patiently.',
    ],
    accelerate: [
      'You ratchet up the pressure on {mark}, adding a ticking clock. "{playerLine}" The urgency builds.',
      'You paint a picture of consequences for {mark} if they don\'t act now. "{playerLine}" The tension mounts.',
    ],
    capitalize: [
      'You make your move, asking {mark} for payment details to process the redelivery. "{playerLine}" This is the moment of truth.',
    ],
    concern: [
      '{mark} raises a red flag. "{markLine}" Their suspicion is palpable — you need to address this carefully.',
    ],
    concern_resolve_success: [
      'You deftly address {mark}\'s concern with a convincing explanation. "{playerLine}" They seem satisfied — for now.',
    ],
    concern_resolve_fail: [
      'Your attempt to reassure {mark} falls flat. "{markLine}" They\'re still not convinced.',
    ],
    hesitation: [
      '{mark} goes quiet. "{markLine}" They need a moment to process before continuing.',
    ],
    temptation: [
      '{mark}\'s eyes light up. "{markLine}" The hook is set — they drift further into your narrative.',
    ],
    sensitivity: [
      'You hit a nerve with {mark}. "{markLine}" They pull back sharply, growing more guarded.',
    ],
    fail: [
      '{mark} sees right through the scam. "{markLine}" It\'s over — they\'re reaching for their phone to report you.',
    ],
    suspicion: [
      'Suspicion has been building too long. {mark}\'s patience has run out entirely — they disconnect and file a report.',
    ],
    overshot: [
      'You pushed too far too fast. {mark} caught on when the story stopped making sense and walked away.',
    ],
    capitalize_success: [
      '{mark} hands over their payment details. "{markLine}" The scam is complete — you pocket the {reward} reward.',
    ],
    neutral: [
      '{mark} listens attentively. "{markLine}" The conversation continues.',
      'The exchange with {mark} proceeds normally. "{markLine}" You maintain control of the narrative.',
    ],
    reward_landing: [
      '{mark} is engaged and receptive. "{markLine}" You sense an opening to capitalize.',
    ],
  },
  // Generic fallback used for scam types without custom templates
  _default: {
    email_read: [
      'You craft a convincing message to {mark} at {email}, setting up the {scam} scheme. The bait is set.',
      'A carefully worded email lands in {mark}\'s inbox at {email}. Your {scam} pitch is polished and believable.',
    ],
    strong: [
      'You apply heavy pressure on {mark}. "{playerLine}" The bold approach pushes the conversation forward.',
      'Taking an aggressive stance, you press {mark} hard. "{playerLine}" They seem shaken by the intensity.',
    ],
    soft: [
      'You take a gentler approach with {mark}. "{playerLine}" The softer tone builds rapport.',
      'With measured words, you coax {mark} along. "{playerLine}" Trust builds slowly.',
    ],
    back: [
      'You pull back, giving {mark} breathing room. "{playerLine}" Sometimes patience pays off.',
      'You stall for time with {mark}. "{playerLine}" The pause resets the dynamic.',
    ],
    accelerate: [
      'You amplify the urgency for {mark}. "{playerLine}" The pressure builds without making a move yet.',
      'Building tension, you tighten the screws on {mark}. "{playerLine}" The clock is ticking louder.',
    ],
    capitalize: [
      'You go for the close, asking {mark} for what you came for. "{playerLine}" Everything hinges on this moment.',
    ],
    concern: [
      '{mark} raises a concern. "{markLine}" You\'ll need to address this before proceeding.',
    ],
    concern_resolve_success: [
      'You skillfully defuse {mark}\'s worry. "{playerLine}" The concern fades — but suspicion advances.',
    ],
    concern_resolve_fail: [
      '{mark} isn\'t buying your explanation. "{markLine}" The concern persists.',
    ],
    hesitation: [
      '{mark} hesitates. "{markLine}" They need time before you can continue.',
    ],
    temptation: [
      '{mark} takes the bait. "{markLine}" Greed pulls them forward on the bar.',
    ],
    sensitivity: [
      'You struck a sensitive chord with {mark}. "{markLine}" They recoil, and you lose ground.',
    ],
    fail: [
      '{mark} catches on to your scheme. "{markLine}" Game over.',
    ],
    suspicion: [
      'Too much suspicion has built up. {mark} ends the conversation and reports you.',
    ],
    overshot: [
      'You overplayed your hand. {mark} saw through everything when you pushed too far.',
    ],
    capitalize_success: [
      '{mark} falls for it completely. "{markLine}" You collect a {reward} reward.',
    ],
    neutral: [
      '{mark} continues the conversation. "{markLine}"',
      'The exchange with {mark} moves along. "{markLine}"',
    ],
    reward_landing: [
      '{mark} is receptive and engaged. "{markLine}" An opportunity to capitalize presents itself.',
    ],
  },
}

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
