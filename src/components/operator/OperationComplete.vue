<script setup>
import { ref } from 'vue'

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
  cellTypes: { type: Object, required: true },
  challengeNumber: { type: Number, required: true },
  shareText: { type: String, required: true },
  threatLevel: { type: Number, default: 0 },
})

const emit = defineEmits(['restart', 'home'])

const copied = ref(false)

const resultTitle = props.won ? 'EXTRACTION SUCCESSFUL' : 'OPERATION COMPROMISED'
const resultClass = props.won ? 'result--success' : 'result--failure'

const reasonText = {
  capitalized: `Intelligence extracted at position ${props.position}. Value: ${props.capitalizeValue}`,
  busted: 'Cover blown. Mark identified the operation and reported to authorities.',
  suspicion: 'Threat level exceeded safe parameters. Position consumed by suspicion.',
  concern_failed: 'Failed to resolve mark concerns. Operation untenable.',
  overshot: 'Target distance exceeded. Mark disengaged.',
}

function cellColor(type) {
  const colors = {
    neutral: '#151522',
    reward_low: '#0a3320',
    reward_medium: '#0d4a2a',
    reward_high: '#106635',
    concern: '#2d1560',
    hesitation: '#4a3d00',
    fail: '#4a0a0e',
    suspicion: '#3a0a0e',
    temptation: '#003838',
    sensitivity: '#4a0a30',
  }
  return colors[type] || colors.neutral
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
  <div class="op-complete">
    <!-- Result header -->
    <div class="result-header" :class="resultClass">
      <span class="result-header__badge font-mono">{{ won ? 'SUCCESS' : 'FAILURE' }}</span>
      <h2 class="result-header__title font-mono">{{ resultTitle }}</h2>
      <p class="result-header__reason">{{ reasonText[endReason] || endReason }}</p>

      <div class="result-stats">
        <div class="result-stat">
          <span class="result-stat__val font-mono">{{ round }}</span>
          <span class="result-stat__label font-mono">ROUNDS</span>
        </div>
        <div class="result-stat">
          <span class="result-stat__val font-mono">{{ position }}</span>
          <span class="result-stat__label font-mono">FINAL POS</span>
        </div>
        <div class="result-stat">
          <span class="result-stat__val font-mono">{{ moveHistory.length }}</span>
          <span class="result-stat__label font-mono">MOVES</span>
        </div>
        <div class="result-stat">
          <span class="result-stat__val font-mono">{{ threatLevel }}%</span>
          <span class="result-stat__label font-mono">THREAT</span>
        </div>
      </div>
    </div>

    <!-- Operation timeline (mini bar) -->
    <div class="op-timeline">
      <h3 class="op-section-title font-mono">OPERATION TIMELINE</h3>
      <div class="mini-gauge">
        <div
          v-for="(cell, i) in barCells"
          :key="i"
          class="mini-gauge__cell"
          :class="{ 'mini-gauge__cell--player': i === position }"
          :style="{ backgroundColor: cellColor(cell) }"
        ></div>
      </div>
    </div>

    <!-- Intel Report (debrief) -->
    <div class="intel-report">
      <div class="intel-report__header">
        <h3 class="op-section-title font-mono">INTEL REPORT</h3>
        <span class="intel-report__classification font-mono">CLASSIFIED</span>
      </div>

      <div class="intel-section">
        <h4 class="intel-section__title font-mono">METHODOLOGY</h4>
        <p class="intel-section__text">{{ scamType.debrief.howItWorks }}</p>
      </div>

      <div class="intel-section">
        <h4 class="intel-section__title font-mono">PSYCHOLOGICAL EXPLOITATION</h4>
        <p class="intel-section__text">{{ scamType.debrief.whyItWorks }}</p>
      </div>

      <div class="intel-section">
        <h4 class="intel-section__title font-mono">COUNTERMEASURES</h4>
        <p class="intel-section__text">{{ scamType.debrief.howToSpot }}</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="op-end-actions">
      <button class="op-end-btn op-end-btn--share font-mono" @click="copyShare">
        {{ copied ? 'COPIED' : 'SHARE INTEL' }}
      </button>
      <button class="op-end-btn op-end-btn--restart font-mono" @click="emit('restart')">
        NEW OPERATION
      </button>
      <button class="op-end-btn op-end-btn--home font-mono" @click="emit('home')">
        RETURN TO BASE
      </button>
    </div>
  </div>
</template>

<style scoped>
.op-complete {
  flex: 1;
  max-width: 680px;
  margin: 0 auto;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

/* ── Result header ──────────────────────────────────── */
.result-header {
  text-align: center;
  padding: 24px 20px;
  border-radius: 6px;
  border: 1px solid var(--border);
}

.result--success {
  background: linear-gradient(135deg, rgba(0, 255, 136, 0.06), rgba(0, 255, 136, 0.02));
  border-color: rgba(0, 255, 136, 0.2);
}

.result--failure {
  background: linear-gradient(135deg, rgba(255, 51, 68, 0.06), rgba(255, 51, 68, 0.02));
  border-color: rgba(255, 51, 68, 0.2);
}

.result-header__badge {
  display: inline-block;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
  padding: 3px 10px;
  border-radius: 2px;
  margin-bottom: 10px;
}

.result--success .result-header__badge {
  color: var(--success);
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.2);
}

.result--failure .result-header__badge {
  color: var(--danger);
  background: rgba(255, 51, 68, 0.1);
  border: 1px solid rgba(255, 51, 68, 0.2);
}

.result-header__title {
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}

.result--success .result-header__title { color: var(--success); }
.result--failure .result-header__title { color: var(--danger); }

.result-header__reason {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 18px;
  line-height: 1.5;
}

.result-stats {
  display: flex;
  justify-content: center;
  gap: 28px;
}

.result-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.result-stat__val {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.result-stat__label {
  font-size: 8px;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

/* ── Timeline ───────────────────────────────────────── */
.op-timeline {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 14px;
}

.op-section-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.mini-gauge {
  display: flex;
  gap: 1px;
}

.mini-gauge__cell {
  flex: 1;
  height: 10px;
  border-radius: 1px;
  transition: transform 0.2s;
}

.mini-gauge__cell--player {
  transform: scaleY(2.2);
  box-shadow: 0 0 6px rgba(0, 212, 255, 0.4);
}

/* ── Intel Report ───────────────────────────────────── */
.intel-report {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 18px;
}

.intel-report__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.intel-report__classification {
  font-size: 8px;
  letter-spacing: 0.12em;
  color: var(--danger);
  opacity: 0.5;
}

.intel-section {
  margin-top: 14px;
}

.intel-section__title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--accent);
  margin-bottom: 4px;
}

.intel-section__text {
  font-size: 12px;
  line-height: 1.7;
  color: var(--text-secondary);
}

/* ── Action buttons ─────────────────────────────────── */
.op-end-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.op-end-btn {
  padding: 10px 24px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.op-end-btn--share {
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: var(--accent);
}

.op-end-btn--share:hover {
  background: rgba(0, 212, 255, 0.18);
}

.op-end-btn--restart {
  background: rgba(0, 255, 136, 0.08);
  border: 1px solid rgba(0, 255, 136, 0.25);
  color: var(--success);
}

.op-end-btn--restart:hover {
  background: rgba(0, 255, 136, 0.15);
}

.op-end-btn--home {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-muted);
}

.op-end-btn--home:hover {
  border-color: var(--border-light);
  color: var(--text-secondary);
}
</style>
