<script setup>
import { ref } from 'vue'
import { CELL_TYPES } from '@/data/scenarios'

const emit = defineEmits(['restart'])

const props = defineProps({
  won: { type: Boolean, required: true },
  endReason: { type: String, required: true },
  capitalizeValue: { type: String, default: '' },
  round: { type: Number, required: true },
  position: { type: Number, required: true },
  scamType: { type: Object, required: true },
  mark: { type: Object, required: true },
  markName: { type: String, required: true },
  moveHistory: { type: Array, required: true },
  barCells: { type: Array, required: true },
  challengeNumber: { type: Number, required: true },
  shareText: { type: String, required: true },
})

const copied = ref(false)

const resultTitle = props.won ? 'Scam Successful' : 'Busted!'
const resultEmoji = props.won ? '\u{1F4B0}' : '\u{1F4A5}'

const reasonText = {
  capitalized: `Capitalized at position ${props.position} for a ${props.capitalizeValue} reward!`,
  busted: 'You landed on a fail cell. The mark caught on and reported you.',
  suspicion: 'Suspicion caught up to you. Too slow!',
  concern_failed: 'Suspicion consumed your position while resolving concerns.',
  overshot: 'You went past the end of the bar. The mark got away.',
}

function cellPatternClass(type) {
  if (type === 'temptation') return 'mini-cell--temptation'
  if (type === 'sensitivity') return 'mini-cell--sensitivity'
  if (type === 'hesitation') return 'mini-cell--hesitation'
  if (type === 'concern') return 'mini-cell--concern'
  return ''
}

async function copyShare() {
  try {
    await navigator.clipboard.writeText(props.shareText)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = props.shareText
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>

<template>
  <div class="end-screen">
    <!-- Result header -->
    <div class="end-header" :class="won ? 'end-header--win' : 'end-header--loss'">
      <span class="end-header__emoji">{{ resultEmoji }}</span>
      <h2 class="end-header__title">{{ resultTitle }}</h2>
      <p class="end-header__reason">{{ reasonText[endReason] || endReason }}</p>
      <div class="end-header__stats">
        <div class="end-stat">
          <span class="end-stat__value font-mono">{{ round }}</span>
          <span class="end-stat__label">Rounds</span>
        </div>
        <div class="end-stat">
          <span class="end-stat__value font-mono">{{ position }}</span>
          <span class="end-stat__label">Position</span>
        </div>
        <div class="end-stat">
          <span class="end-stat__value font-mono">{{ moveHistory.length }}</span>
          <span class="end-stat__label">Moves</span>
        </div>
      </div>
    </div>

    <!-- Mini bar journey -->
    <div class="end-journey">
      <h3 class="end-section-title">YOUR JOURNEY</h3>
      <div class="mini-bar">
        <div
          v-for="(cell, i) in barCells"
          :key="i"
          class="mini-cell"
          :class="[
            cellPatternClass(cell),
            { 'mini-cell--player': i === position }
          ]"
          :style="{ backgroundColor: CELL_TYPES[cell]?.color || 'var(--cell-neutral)' }"
        ></div>
      </div>
    </div>

    <!-- Educational Debrief -->
    <div class="end-debrief">
      <h3 class="end-section-title">
        {{ scamType.emoji }} LEARN ABOUT: {{ scamType.name.toUpperCase() }} SCAMS
      </h3>
      <div class="debrief-card">
        <div class="debrief-item">
          <h4>How It Works</h4>
          <p>{{ scamType.debrief.howItWorks }}</p>
        </div>
        <div class="debrief-item">
          <h4>Why It Works</h4>
          <p>{{ scamType.debrief.whyItWorks }}</p>
        </div>
        <div class="debrief-item">
          <h4>How to Spot It</h4>
          <p>{{ scamType.debrief.howToSpot }}</p>
        </div>
      </div>
    </div>

    <!-- Share + Restart -->
    <div class="end-actions">
      <button class="end-btn end-btn--share" @click="copyShare">
        {{ copied ? 'COPIED!' : 'SHARE RESULTS' }}
      </button>
      <button class="end-btn end-btn--restart" @click="emit('restart')">
        PLAY AGAIN
      </button>
    </div>
  </div>
</template>

<style scoped>
.end-screen {
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.end-header {
  text-align: center;
  padding: 20px 16px;
  border-radius: 4px;
  border: 1px solid var(--border);
}

.end-header--win {
  background: linear-gradient(135deg, rgba(45, 74, 46, 0.3), rgba(74, 140, 77, 0.15));
  border-color: rgba(110, 143, 112, 0.4);
}

.end-header--loss {
  background: linear-gradient(135deg, rgba(153, 27, 27, 0.2), rgba(127, 29, 29, 0.1));
  border-color: rgba(185, 28, 28, 0.3);
}

.end-header__emoji {
  font-size: 40px;
  display: block;
  margin-bottom: 6px;
}

.end-header__title {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 4px;
}

.end-header--win .end-header__title { color: var(--accent-green-light); }
.end-header--loss .end-header__title { color: var(--accent-red-light); }

.end-header__reason {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 14px;
}

.end-header__stats {
  display: flex;
  justify-content: center;
  gap: 28px;
}

.end-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.end-stat__value {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.end-stat__label {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  font-weight: 600;
}

/* Journey */
.end-journey {
  padding: 14px;
  background: var(--bg-torn-panel);
  border: 1px solid var(--border);
  border-radius: 4px;
}

.end-section-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 10px;
  text-align: center;
}

.mini-bar {
  display: flex;
  gap: 1px;
}

.mini-cell {
  flex: 1;
  height: 12px;
  border-radius: 1px;
  position: relative;
  transition: transform 0.2s;
}

.mini-cell--player {
  transform: scaleY(2);
  box-shadow: 0 0 6px rgba(110, 143, 112, 0.5);
}

/* Mini bar patterns */
.mini-cell--temptation::after,
.mini-cell--sensitivity::after,
.mini-cell--hesitation::after,
.mini-cell--concern::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.mini-cell--temptation::after {
  background: repeating-linear-gradient(-60deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 3px);
}

.mini-cell--sensitivity::after {
  background: repeating-linear-gradient(60deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 3px);
}

.mini-cell--hesitation::after {
  background: radial-gradient(circle 1px, rgba(255,255,255,0.15) 100%, transparent 100%);
  background-size: 4px 4px;
}

.mini-cell--concern::after {
  background:
    repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 3px),
    repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 3px);
}

/* Debrief */
.end-debrief {
  padding: 16px;
  background: var(--bg-torn-panel);
  border: 1px solid var(--border);
  border-radius: 4px;
}

.debrief-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.debrief-item h4 {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--accent-green-light);
  margin-bottom: 3px;
}

.debrief-item p {
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Actions */
.end-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.end-btn {
  padding: 9px 28px;
  border: none;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: 0.04em;
  transition: background 0.15s;
}

.end-btn--share {
  background: var(--accent-green);
  color: #fff;
}

.end-btn--share:hover {
  background: var(--accent-green-light);
}

.end-btn--restart {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.end-btn--restart:hover {
  border-color: var(--border-light);
  color: var(--text-primary);
}
</style>
