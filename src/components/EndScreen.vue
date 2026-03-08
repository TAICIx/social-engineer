<script setup>
import { ref } from 'vue'
import { CELL_TYPES } from '@/data/scenarios'

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
  concern_failed: `${props.markName} saw through your lie and called the authorities.`,
  overshot: 'You went past the end of the bar. The mark got away.',
}

async function copyShare() {
  try {
    await navigator.clipboard.writeText(props.shareText)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback
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
    <div class="end-screen__header" :class="won ? 'end-screen__header--win' : 'end-screen__header--loss'">
      <span class="end-screen__emoji">{{ resultEmoji }}</span>
      <h2 class="end-screen__title">{{ resultTitle }}</h2>
      <p class="end-screen__reason">{{ reasonText[endReason] || endReason }}</p>
      <div class="end-screen__stats">
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
    <div class="end-screen__journey">
      <h3 class="end-screen__section-title">Your Journey</h3>
      <div class="mini-bar">
        <div
          v-for="(cell, i) in barCells"
          :key="i"
          class="mini-cell"
          :class="{
            'mini-cell--player': i === position,
          }"
          :style="{ backgroundColor: CELL_TYPES[cell]?.color || 'var(--cell-neutral)' }"
        ></div>
      </div>
    </div>

    <!-- Educational Debrief -->
    <div class="end-screen__debrief">
      <h3 class="end-screen__section-title">
        {{ scamType.emoji }} Learn About: {{ scamType.name }} Scams
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

    <!-- Share -->
    <div class="end-screen__share">
      <button class="share-btn" @click="copyShare">
        {{ copied ? 'Copied!' : 'Share Results' }}
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
  gap: 20px;
}

.end-screen__header {
  text-align: center;
  padding: 24px 20px;
  border-radius: 12px;
  border: 1px solid var(--border);
}

.end-screen__header--win {
  background: linear-gradient(135deg, rgba(45, 74, 46, 0.3), rgba(74, 140, 77, 0.15));
  border-color: rgba(110, 143, 112, 0.4);
}

.end-screen__header--loss {
  background: linear-gradient(135deg, rgba(153, 27, 27, 0.2), rgba(127, 29, 29, 0.1));
  border-color: rgba(185, 28, 28, 0.3);
}

.end-screen__emoji {
  font-size: 48px;
  display: block;
  margin-bottom: 8px;
}

.end-screen__title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 6px;
}

.end-screen__header--win .end-screen__title { color: var(--accent-green-light); }
.end-screen__header--loss .end-screen__title { color: var(--accent-red-light); }

.end-screen__reason {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.end-screen__stats {
  display: flex;
  justify-content: center;
  gap: 32px;
}

.end-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.end-stat__value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.end-stat__label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  font-weight: 600;
}

.end-screen__journey {
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
}

.end-screen__section-title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
  margin-bottom: 12px;
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
  transition: transform 0.2s;
}

.mini-cell--player {
  transform: scaleY(2);
  border-radius: 2px;
  box-shadow: 0 0 6px rgba(110, 143, 112, 0.5);
}

.end-screen__debrief {
  padding: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
}

.debrief-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.debrief-item h4 {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--accent-green-light);
  margin-bottom: 4px;
}

.debrief-item p {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.end-screen__share {
  text-align: center;
}

.share-btn {
  padding: 12px 32px;
  background: var(--accent-green);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.share-btn:hover {
  background: var(--accent-green-light);
  transform: translateY(-1px);
}
</style>
