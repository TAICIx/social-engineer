/**
 * Daily seed utilities — deterministic daily content.
 * Same LCG as scam-or-not and scambench.
 */

export function getDailySeed() {
  const n = new Date()
  return n.getFullYear() * 10000 + (n.getMonth() + 1) * 100 + n.getDate()
}

export function getChallengeNumber() {
  const epoch = new Date(2025, 0, 1)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.floor((today - epoch) / 86400000) + 1
}

export function getTodayKey() {
  const n = new Date()
  const y = n.getFullYear()
  const m = String(n.getMonth() + 1).padStart(2, '0')
  const d = String(n.getDate()).padStart(2, '0')
  return `${y}${m}${d}`
}

/** LCG-based seeded PRNG — returns next seed and a float [0, 1) */
export function seededRandom(seed) {
  const next = (seed * 9301 + 49297) % 233280
  return { next, value: next / 233280 }
}

/** Get a random int in [min, max] inclusive using seeded PRNG */
export function seededRandInt(seed, min, max) {
  const { next, value } = seededRandom(seed)
  return { next, value: min + Math.floor(value * (max - min + 1)) }
}

/** Seeded shuffle (Fisher-Yates) */
export function seededShuffle(arr, seed) {
  const r = [...arr]
  let m = r.length
  let t, i
  while (m) {
    seed = (seed * 9301 + 49297) % 233280
    i = Math.floor((seed / 233280) * m--)
    t = r[m]
    r[m] = r[i]
    r[i] = t
  }
  return r
}
