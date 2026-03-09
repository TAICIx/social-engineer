/**
 * The Mark — Dialogue data, scenario configs, legit dialogue lines.
 * Defense game: you're the target, figure out if the caller is legit or a scammer.
 */

// ── Scenario types (each has a scam and legit version) ────────
export const MARK_SCENARIOS = {
  delivery: {
    playerProfile: 'You ordered a new laptop online 3 days ago. You\'re expecting a delivery this week.',
    scamSetup: 'Someone calls about a delivery issue with your package.',
    legitSetup: 'A delivery driver calls about finding your address.',
    legitCompany: 'FedEx',
  },
  family_emergency: {
    playerProfile: 'You have a grandson named Jake who\'s away at college. You haven\'t heard from him in a few days.',
    scamSetup: 'You get a panicked call from someone claiming to be a relative.',
    legitSetup: 'Your nephew calls from a friend\'s phone — he locked himself out of his apartment.',
    legitCompany: null,
  },
  prize_lottery: {
    playerProfile: 'You entered a raffle at a local car dealership last weekend.',
    scamSetup: 'Someone calls saying you won a massive prize.',
    legitSetup: 'The dealership calls — you won a $50 gift card from the raffle.',
    legitCompany: 'Anderson Auto Group',
  },
  tech_support: {
    playerProfile: 'Your home computer has been running slow lately. You\'re not very tech-savvy.',
    scamSetup: 'Someone calls claiming to be from your computer\'s manufacturer.',
    legitSetup: 'Your internet provider calls about a service outage in your area.',
    legitCompany: 'Comcast',
  },
  charity: {
    playerProfile: 'You regularly donate to your local food bank. There was a hurricane last week.',
    scamSetup: 'A caller asks for donations to help hurricane victims.',
    legitSetup: 'Your local food bank calls about their annual giving drive.',
    legitCompany: 'Community Food Bank',
  },
  job: {
    playerProfile: 'You\'ve been job hunting for 3 months. You posted your resume on Indeed last week.',
    scamSetup: 'Someone reaches out about an amazing job opportunity.',
    legitSetup: 'A recruiter from a company you applied to calls about an interview.',
    legitCompany: 'Meridian Consulting',
  },
  investment: {
    playerProfile: 'You have some savings and have been thinking about investing. You mentioned it on social media.',
    scamSetup: 'Someone contacts you about an exclusive investment opportunity.',
    legitSetup: 'Your bank\'s financial advisor follows up on your inquiry about mutual funds.',
    legitCompany: 'Wells Fargo Advisors',
  },
  romance: {
    playerProfile: 'You joined a dating app 2 weeks ago after your divorce. You matched with someone attractive.',
    scamSetup: 'Your match starts messaging you with intense interest.',
    legitSetup: 'Your match messages you — they seem genuinely interested in getting to know you.',
    legitCompany: null,
  },
  tax_irs: {
    playerProfile: 'You filed your taxes last month. You\'re expecting a refund but haven\'t received it yet.',
    scamSetup: 'Someone calls claiming to be from the IRS about your tax return.',
    legitSetup: 'Your accountant calls with a question about a deduction on your return.',
    legitCompany: 'H&R Block',
  },
  vacation: {
    playerProfile: 'You signed up for a travel newsletter and entered a vacation giveaway at a trade show.',
    scamSetup: 'Someone calls about a vacation package you "won."',
    legitSetup: 'The travel company calls — you won a $200 travel voucher from the trade show.',
    legitCompany: 'AAA Travel',
  },
  advance_fee: {
    playerProfile: 'Your great-uncle passed away recently. You know he had some assets but details are unclear.',
    scamSetup: 'A "lawyer" contacts you about an inheritance.',
    legitSetup: 'Your family\'s estate attorney contacts you about the will reading.',
    legitCompany: 'Morrison & Associates',
  },
}

// ── Scam caller phases (progression through the scam) ─────────
export const SCAM_PHASES = ['opener', 'build', 'pressure', 'accelerate', 'capitalize']

// Maps scam phases to PLAYER_LINES action categories
export const PHASE_TO_ACTION = {
  opener: 'soft',
  build: 'soft',
  pressure: 'strong',
  accelerate: 'accelerate',
  capitalize: 'capitalize',
}

// ── Legit caller dialogue per scenario ────────────────────────
// Natural, non-manipulative dialogue. No pressure, no urgency tricks.
export const LEGIT_LINES = {
  delivery: {
    opener: [
      'Hi, this is Marcus with FedEx. I\'m trying to deliver a package to your address but I can\'t find the building number. Is this the right contact?',
      'Hello, FedEx driver here. I have a package for this address but the gate code isn\'t working. Could you help me out?',
    ],
    followup: [
      'The tracking number is 7749-2841-3366. You can verify that on fedex.com if you want.',
      'I\'m parked on Oak Street. The GPS brought me to the wrong side of the building.',
      'No rush — I can leave it at the leasing office if that\'s easier for you.',
      'I have about 30 more stops today, but I can swing back by in a couple hours if now isn\'t good.',
      'If you want, I can just leave it at your door. I\'ll take a photo for confirmation.',
    ],
    questioned: [
      'Totally fair to double-check. My truck number is 4417 — you can call FedEx at 1-800-463-3339 and give them that.',
      'I get it, lots of scams out there. You can track the package yourself on the app and it\'ll show my route.',
      'No worries at all. If you\'d rather pick it up at the FedEx location on Main Street, I can redirect it there.',
    ],
    closing: [
      'Alright, I left it by your front door. You should see the delivery confirmation in your email. Have a good one!',
      'Package delivered. You\'ll get a photo notification in the app. Take care!',
    ],
  },
  family_emergency: {
    opener: [
      'Hey, it\'s Danny. Sorry for calling from a weird number — I locked myself out of my apartment and my phone died. I\'m using my roommate\'s phone.',
      'Hi, it\'s your nephew. I know this number looks different — I\'m borrowing a friend\'s phone because mine is dead.',
    ],
    followup: [
      'Yeah it\'s dumb, I left my keys inside when I went to take the trash out. The locksmith says it\'ll be about $80.',
      'I already called the building manager but he\'s out until tomorrow. I just need to figure out where to sleep tonight.',
      'Could I crash at your place tonight? I can take the bus over. Or I might just ask my roommate to let me in when he gets back from work.',
      'It\'s not a big deal honestly. More annoying than anything. I just wanted to let you know in case you tried calling my regular number.',
    ],
    questioned: [
      'It\'s Danny — remember when we had that barbecue at your place last July? I accidentally broke that garden gnome and we superglued it back.',
      'You can call mom if you want — she knows my roommate\'s number. Or just text my regular number and I\'ll get it when the locksmith opens up.',
      'Ha, fair enough. What do you want me to prove? Ask me anything.',
    ],
    closing: [
      'Roommate just got back, crisis over! Sorry to bother you. See you at Thanksgiving.',
      'Locksmith just got here. Thanks for talking me through it. I owe you one.',
    ],
  },
  prize_lottery: {
    opener: [
      'Hi, this is Sarah from Anderson Auto Group. You entered our raffle last Saturday at the dealership? Great news — you won a $50 gift card!',
      'Hello! Calling from Anderson Auto. You filled out a raffle ticket at our event last weekend. You won one of our prizes!',
    ],
    followup: [
      'It\'s a $50 Visa gift card. Nothing huge, but hey, free money is free money.',
      'You can pick it up at the dealership anytime this week. We\'re open 9 to 6. Just bring your ID so we can match the entry.',
      'No, there\'s no fee or anything. It\'s a promotional giveaway — we\'re just trying to get people to come look at the new models.',
      'We\'ll have you sign a quick release form for tax purposes — anything over $25 we have to report. Standard stuff.',
    ],
    questioned: [
      'Totally understand. Our number is listed on our website — andersonautogroup.com. You can call the front desk and they\'ll confirm.',
      'You can also check our Facebook page — we posted the winner list this morning. Your name should be on there.',
      'We\'re not asking for any payment info. Just come by with your ID. That\'s it.',
    ],
    closing: [
      'Great, we\'ll see you this week then. Ask for Sarah at the front desk. Congrats again!',
      'Sounds good. The card will be at the front desk whenever you\'re ready to grab it. Have a good day!',
    ],
  },
  tech_support: {
    opener: [
      'Hi, this is Comcast customer support. We\'re seeing a service disruption in your area and wanted to let you know we\'re working on it.',
      'Hello, calling from Comcast technical services. There\'s been an outage on your street and we\'re dispatching a crew.',
    ],
    followup: [
      'The issue started about 2 hours ago. It\'s affecting internet and cable for about 40 homes in your neighborhood.',
      'Our technicians are on-site now. We expect it to be resolved by this evening.',
      'You don\'t need to do anything on your end. Once we fix the node, your service should come back automatically.',
      'If it\'s not back by 8 PM tonight, give us a call at the number on your bill and we\'ll send someone to check your specific connection.',
    ],
    questioned: [
      'You can verify this outage on our website — comcast.com/outages. Enter your zip code and it\'ll show the active report.',
      'Our call center number is 1-800-266-2278 — same as what\'s on your bill. You can call back to confirm if you\'d like.',
      'We\'re not asking for any account information right now. This is just a courtesy notification.',
    ],
    closing: [
      'That\'s all from us. Again, should be fixed by tonight. Sorry for the inconvenience.',
      'We\'ll send a text update when service is restored. Thanks for your patience.',
    ],
  },
  charity: {
    opener: [
      'Hi, this is Tom from Community Food Bank. We\'re doing our annual winter giving drive and I\'m reaching out to past donors.',
      'Hello! Calling from the Community Food Bank. You donated last year and we wanted to update you on how your gift helped.',
    ],
    followup: [
      'Last year your donation helped us serve 12,000 meals. We\'re hoping to beat that this year.',
      'We have a few ways to give — you can donate on our website, mail a check, or drop off at any of our 3 locations.',
      'Even $20 covers meals for a family of four for a day. But there\'s absolutely no pressure.',
      'If you want to do something other than money, we always need volunteers during the holidays.',
    ],
    questioned: [
      'Absolutely — our website is communityfoodbank.org. We\'re a registered 501(c)(3) and you can look us up on Charity Navigator.',
      'I totally understand wanting to verify. You can call our main office at 555-0142 during business hours.',
      'We never ask for credit card numbers over the phone. If you want to donate, our website has a secure portal.',
    ],
    closing: [
      'Thanks for considering it. No rush at all — our drive runs through the end of January. Have a great evening!',
      'We appreciate your past support. Even just spreading the word helps. Take care!',
    ],
  },
  job: {
    opener: [
      'Hi, this is Rachel Park from Meridian Consulting. I came across your resume on Indeed and I think you might be a good fit for a role we\'re hiring for.',
      'Hello, I\'m calling from Meridian Consulting. We saw your application for the project coordinator position. Do you have a few minutes to chat?',
    ],
    followup: [
      'The role is a project coordinator position. It\'s full-time, in our downtown office, starting around $55K depending on experience.',
      'I\'d love to set up a formal interview — either in person or video, whichever works better for you.',
      'You can check out our company on LinkedIn — Meridian Consulting. We\'ve been around since 2014, about 200 employees.',
      'The hiring process is usually two interviews and a skills assessment. No fees or anything like that, obviously.',
    ],
    questioned: [
      'Smart to check. Our company website is meridianconsulting.com. The job posting is also still live on Indeed — you can cross-reference.',
      'My LinkedIn is linkedin.com/in/rachelpark-meridian. Feel free to look me up.',
      'We\'d never ask you to pay for anything. If a "job" asks for money, that\'s always a scam. We\'re not that.',
    ],
    closing: [
      'Great, I\'ll send you an email with the interview details. You\'ll see it from rachel@meridianconsulting.com. Looking forward to meeting you!',
      'I\'ll follow up with an email. Take your time reviewing the job description and let me know if you have questions. Talk soon!',
    ],
  },
  investment: {
    opener: [
      'Hi, this is James from Wells Fargo Advisors. You spoke with our branch about opening an investment account last week? I\'m following up on that.',
      'Hello, Wells Fargo Advisors calling. You had a meeting with our financial planning team recently. I wanted to continue that conversation.',
    ],
    followup: [
      'Based on what you told our team, a diversified mutual fund portfolio might be a good starting point. Something moderate-risk.',
      'Typical returns for the funds we\'d recommend are 7-10% annually, historically. But of course, nothing is guaranteed — the market has risk.',
      'I\'d recommend coming into the branch so we can go through your options in person. No commitment needed, just information.',
      'You can also browse our fund options on wellsfargoadvisors.com. All the performance data is public.',
    ],
    questioned: [
      'Absolutely, take your time. Our branch number is on your bank statement. You can call and ask for the advisory desk to confirm this call.',
      'I wouldn\'t recommend investing anything until you\'re fully comfortable. There\'s never a rush with legitimate investing.',
      'We\'re SEC-registered. You can verify our advisors on FINRA\'s BrokerCheck website — brokercheck.finra.org.',
    ],
    closing: [
      'No pressure at all. Think it over, do your research, and call us when you\'re ready. Our door is always open.',
      'I\'ll email you some educational materials about the funds we discussed. Take your time. Talk soon.',
    ],
  },
  romance: {
    opener: [
      'Hey! I saw we matched. I loved your photo at the hiking trail — is that Glacier Point? I was there last summer!',
      'Hi! Your profile made me smile. I love that you mentioned cooking — I\'m a total food nerd. What\'s your go-to dish?',
    ],
    followup: [
      'I work in marketing, pretty boring stuff honestly. But it pays the bills and I get to be creative sometimes.',
      'I\'ve been on this app for about a month. Honestly most conversations fizzle out — it\'s nice to actually talk to someone real.',
      'Would you want to grab coffee sometime? I know a great spot downtown if you\'re in the area.',
      'No pressure on meeting up. I get it — the app world is weird. We can just keep chatting if you prefer.',
    ],
    questioned: [
      'Ha, fair enough. Here\'s my Instagram — you can see I\'m a real person and not a catfish. @jamie_outdoors',
      'Happy to video chat first if that makes you more comfortable. I totally get the caution.',
      'I have nothing to hide. Ask me anything. I\'m an open book.',
    ],
    closing: [
      'This was really nice. Let me know when you\'re free for that coffee. No rush.',
      'I gotta run but I really enjoyed talking. Let\'s pick this up later?',
    ],
  },
  tax_irs: {
    opener: [
      'Hi, this is Karen from H&R Block. I prepared your taxes last month and I have a quick question about one of your deductions before we finalize.',
      'Hello, calling from H&R Block. Your return is almost processed but I noticed something on your Schedule C that I need to clarify.',
    ],
    followup: [
      'It\'s about the home office deduction. You listed 400 square feet but your total home square footage seems low. Can you double-check that number?',
      'It\'s not a problem — just want to make sure we have it right before the IRS processes it. Errors on deductions can trigger audits.',
      'If the numbers are correct, no issue. I just want to make sure we filed accurately.',
      'Your refund estimate is still $1,847. This won\'t change that — it\'s just a documentation thing.',
    ],
    questioned: [
      'You can call our office directly — the number is on the paperwork I gave you. Ask for Karen in tax prep.',
      'I\'d never ask for payment over the phone. Your prep fee was already paid when you came in.',
      'If you want, just stop by the office with your home measurements. We can sort it out in person.',
    ],
    closing: [
      'Perfect, that clears it up. I\'ll finalize the return today. You should see your refund in 2-3 weeks.',
      'Great, thanks for confirming. Everything looks good. You\'ll get an email when the IRS accepts the return.',
    ],
  },
  vacation: {
    opener: [
      'Hi, this is AAA Travel calling. You entered our giveaway at the Home & Garden Expo? You won a $200 travel voucher!',
      'Hello! AAA Travel here. Good news — you won one of our expo prizes. It\'s a $200 voucher toward any AAA-booked trip.',
    ],
    followup: [
      'The voucher is $200 off any trip booked through our AAA travel portal. It\'s good for 12 months.',
      'There\'s no catch, honestly. We run these giveaways to get new AAA members interested in our travel services.',
      'You can use it on flights, hotels, car rentals — anything in our booking system.',
      'If you\'re already a AAA member, it stacks with your member discount.',
    ],
    questioned: [
      'Our number is on aaa.com — you can verify this call through them. We\'re the regional AAA office.',
      'We don\'t need any payment info. The voucher is a code we\'ll email you. You apply it at checkout on our site.',
      'Feel free to come into any AAA branch and ask about the expo giveaway. They\'ll have the info.',
    ],
    closing: [
      'I\'ll email the voucher code to the address you gave at the expo. You\'ll see it from travel@aaa.com. Enjoy!',
      'Congratulations! The code is valid for a year, so no rush. Happy travels!',
    ],
  },
  advance_fee: {
    opener: [
      'Hello, this is David Morrison from Morrison & Associates. I\'m handling your great-uncle Gerald\'s estate. The family asked me to reach out about the will reading.',
      'Hi, calling from Morrison & Associates law firm. I\'m the executor for Gerald\'s estate. Your mother gave me your number.',
    ],
    followup: [
      'The will reading is scheduled for next Thursday at 2 PM at our office downtown. Can you make it?',
      'I can\'t discuss specifics over the phone, but Gerald did name you in the will. You\'ll want to be there.',
      'You\'ll need to bring a photo ID and your relationship documentation — a birth certificate or family records.',
      'Our office is at 445 Court Street, Suite 200. Free parking in the back lot.',
    ],
    questioned: [
      'Absolutely — our firm is listed with the State Bar. You can look us up at morrisonlaw.com or call the Bar Association.',
      'Your mother can confirm she spoke with me last Tuesday. I met with her and your aunt at the office.',
      'We don\'t charge beneficiaries. Estate fees come out of the estate itself. You won\'t pay anything.',
    ],
    closing: [
      'We\'ll see you Thursday then. If anything changes, my direct line is 555-0187. Condolences about Gerald.',
      'I\'ll send a confirmation letter to your mailing address. See you at the reading.',
    ],
  },
}

// ── Red flag patterns (what makes a caller suspicious) ────────
// Used to detect manipulation in caller messages for the sidebar
export const RED_FLAG_PATTERNS = [
  { id: 'urgency', label: 'Creates Urgency', color: '#ff3344', patterns: [
    /\b(right now|immediately|urgent|hurry|rush|asap|act now|don't wait)\b/i,
    /\b(today only|expires|deadline|last chance|running out|before it's too late)\b/i,
    /\b(minutes?|hours?) (left|remaining|to act)\b/i,
  ]},
  { id: 'fear', label: 'Uses Fear/Threats', color: '#f44336', patterns: [
    /\b(arrest|jail|prison|warrant|lawsuit|legal action|court)\b/i,
    /\b(hack(ed|er|ing)|stolen|breach|compromised|infected|virus)\b/i,
    /\b(hurt|danger|trouble|risk|threat)\b/i,
  ]},
  { id: 'too_good', label: 'Too Good To Be True', color: '#e91e63', patterns: [
    /\b(won|winner|congratulations|selected|chosen)\b/i,
    /\$\d{3,}|\d+,\d{3}/,
    /\b(guarantee|guaranteed|risk.?free|100%)\b/i,
    /\b(free|no.?cost|complimentary)\b.{0,20}\b(money|cash|prize|gift|trip|vacation)\b/i,
  ]},
  { id: 'pressure', label: 'Pressures Decision', color: '#ff5722', patterns: [
    /\b(now or never|once in a lifetime|limited|only \d+ left)\b/i,
    /\b(don't (think|wait|hesitate)|stop asking|just do it)\b/i,
    /\b(other (people|customers|buyers) are waiting)\b/i,
  ]},
  { id: 'payment', label: 'Requests Payment', color: '#ff9800', patterns: [
    /\b(gift.?card|wire|transfer|western union|moneygram)\b/i,
    /\b(card number|bank account|routing number|payment)\b/i,
    /\b(bitcoin|crypto|btc|venmo|zelle|cashapp)\b/i,
    /\b(fee|deposit|upfront|advance|processing)\b.{0,15}\b(\$|pay|send|cost)\b/i,
  ]},
  { id: 'info_harvest', label: 'Harvests Personal Info', color: '#ffaa00', patterns: [
    /\b(ssn|social security|date of birth|passport|driver.?s? licen[cs]e)\b/i,
    /\b(password|login|pin|verification code|otp|credentials)\b/i,
    /\b(confirm your|verify your|need your).{0,15}\b(identity|address|number|details|info)\b/i,
  ]},
  { id: 'secrecy', label: 'Demands Secrecy', color: '#9c27b0', patterns: [
    /\b(don't tell|keep this between|secret|confidential|don't share)\b/i,
    /\b(just between (us|you and me))\b/i,
    /\b(nobody (else )?needs to know)\b/i,
  ]},
  { id: 'emotional', label: 'Emotional Manipulation', color: '#2196f3', patterns: [
    /\b(please|begging|desperate|crying|scared|terrified|dying)\b/i,
    /\b(you're (my|the) only (hope|one|person))\b/i,
    /\b(how could you|don't you care|heartless)\b/i,
  ]},
  { id: 'evasion', label: 'Avoids Verification', color: '#607d8b', patterns: [
    /\b(don't (call|check|verify|worry about))\b/i,
    /\b(no time (for|to) (that|verify|check))\b/i,
    /\b(just trust me|take my word)\b/i,
  ]},
]

// ── Player response categories (detect what the player is doing) ──
export const PLAYER_INTENT_PATTERNS = {
  questioning: [
    /\b(who (are|is) (you|this)|what company|where are you calling from)\b/i,
    /\b(can (you|I) verify|how (do|can) I (check|verify|confirm))\b/i,
    /\b(is this (real|legit|legitimate)|prove it|what's your)\b/i,
    /\b(website|phone number|address|badge|id number|employee)\b/i,
    /\b(why (do you|should I)|what (exactly|specifically))\b/i,
  ],
  concerned: [
    /\b(scam|suspicious|don't (trust|believe)|not sure|sounds (fake|fishy|off|weird))\b/i,
    /\b(uncomfortable|nervous|uneasy|sketchy|shady)\b/i,
    /\b(red flag|warning|alarm)\b/i,
    /\b(i('ll| will) (call|check|verify) (myself|on my own))\b/i,
  ],
  willing: [
    /\b(ok(ay)?|sure|yes|sounds good|alright|fine|let's do it|go ahead)\b/i,
    /\b(how do I|what do I need|where do I|tell me more)\b/i,
    /\b(i('ll| will) (do|send|pay|give|provide))\b/i,
    /\b(makes sense|i (believe|trust) you)\b/i,
  ],
  resistant: [
    /\b(no|stop|don't (contact|call)|leave me alone|not interested)\b/i,
    /\b(hang(ing)? up|goodbye|reporting|blocking)\b/i,
    /\b(i('m| am) (done|not doing|refusing))\b/i,
  ],
}

// ── Difficulty levels ─────────────────────────────────────────
export const MARK_DIFFICULTY = {
  1: {
    label: 'Obvious',
    description: 'Clear red flags. Heavy-handed tactics.',
    scamSubtlety: 0.2,     // low = very obvious scam
    maxTurns: 12,
    speedBonusThreshold: 4, // call it in ≤4 turns for speed bonus
  },
  2: {
    label: 'Suspicious',
    description: 'Some red flags, but the caller is more polished.',
    scamSubtlety: 0.4,
    maxTurns: 14,
    speedBonusThreshold: 5,
  },
  3: {
    label: 'Tricky',
    description: 'Scammer is skilled. Harder to distinguish from legit.',
    scamSubtlety: 0.6,
    maxTurns: 16,
    speedBonusThreshold: 6,
  },
  4: {
    label: 'Convincing',
    description: 'Very polished delivery. Few obvious tells.',
    scamSubtlety: 0.8,
    maxTurns: 18,
    speedBonusThreshold: 7,
  },
  5: {
    label: 'Expert',
    description: 'Near-perfect act. Only subtle inconsistencies reveal the truth.',
    scamSubtlety: 1.0,
    maxTurns: 20,
    speedBonusThreshold: 8,
  },
}
