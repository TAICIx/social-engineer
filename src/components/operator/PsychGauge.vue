<script setup>
import { computed } from 'vue'

const props = defineProps({
  cells: { type: Array, required: true },
  position: { type: Number, required: true },
  suspicionLine: { type: Number, default: 0 },
  totalCells: { type: Number, default: 50 },
  rangePreview: { type: Object, default: () => ({}) },
  hoveredAction: { type: String, default: null },
  canCapitalize: { type: Boolean, default: false },
  cellTypes: { type: Object, required: true },
})

// Cell colors for the gauge
function cellColor(type) {
  const colors = {
    neutral: 'var(--cell-neutral)',
    reward_low: 'var(--cell-reward-low)',
    reward_medium: 'var(--cell-reward-medium)',
    reward_high: 'var(--cell-reward-high)',
    concern: 'var(--cell-concern)',
    hesitation: 'var(--cell-hesitation)',
    fail: 'var(--cell-fail)',
    suspicion: 'var(--cell-suspicion)',
    temptation: 'var(--cell-temptation)',
    sensitivity: 'var(--cell-sensitivity)',
  }
  return colors[type] || colors.neutral
}

// Cell pattern class
function cellPatternClass(type) {
  if (type === 'temptation') return 'gauge-cell--temptation'
  if (type === 'sensitivity') return 'gauge-cell--sensitivity'
  if (type === 'hesitation') return 'gauge-cell--hesitation'
  if (type === 'concern') return 'gauge-cell--concern'
  if (type === 'suspicion') return 'gauge-cell--suspicion'
  return ''
}

// Range overlay
function rangeOverlayStyle(index) {
  const rp = props.rangePreview
  if (!rp || Object.keys(rp).length === 0) return null

  const hovered = props.hoveredAction
  const rangeColors = {
    back: 'var(--range-back)',
    soft: 'var(--range-soft)',
    strong: 'var(--range-strong)',
    accelerate: 'var(--range-accel)',
  }

  const overlays = []
  for (const [action, range] of Object.entries(rp)) {
    if (range && index >= range[0] && index <= range[1]) {
      overlays.push(action)
    }
  }
  if (overlays.length === 0) return null

  if (hovered && overlays.includes(hovered)) {
    return { backgroundColor: rangeColors[hovered], opacity: 1 }
  }
  if (hovered && !overlays.includes(hovered)) {
    return { backgroundColor: rangeColors[overlays[0]], opacity: 0.2 }
  }
  return { backgroundColor: rangeColors[overlays[0]], opacity: 0.4 }
}

// Cursor position as percentage
const cursorLeft = computed(() => {
  const cellWidth = 100 / props.totalCells
  return `${props.position * cellWidth + cellWidth / 2}%`
})

// Suspicion zone width
const suspicionWidth = computed(() => {
  return `${(props.suspicionLine / props.totalCells) * 100}%`
})

// Reward label
function rewardLabel(type) {
  if (type === 'reward_high') return 'H'
  if (type === 'reward_medium') return 'M'
  if (type === 'reward_low') return 'L'
  return ''
}

// Tick marks every 10 cells
const tickMarks = computed(() => {
  const ticks = []
  for (let i = 10; i < props.totalCells; i += 10) {
    ticks.push({ pos: (i / props.totalCells) * 100, label: i })
  }
  return ticks
})
</script>

<template>
  <div class="psych-gauge">
    <!-- Title bar -->
    <div class="psych-gauge__header">
      <span class="psych-gauge__title font-mono">PSYCH DISTANCE</span>
      <span class="psych-gauge__pos font-mono">{{ position }}/{{ totalCells - 1 }}</span>
    </div>

    <!-- Main gauge -->
    <div class="psych-gauge__track">
      <!-- Suspicion zone overlay -->
      <div v-if="suspicionLine > 0" class="psych-gauge__suspicion" :style="{ width: suspicionWidth }"></div>

      <!-- Cells -->
      <div class="psych-gauge__cells">
        <div
          v-for="(cell, i) in cells"
          :key="i"
          class="gauge-cell"
          :class="[
            cellPatternClass(cell),
            {
              'gauge-cell--current': i === position,
              'gauge-cell--capitalize': i === position && canCapitalize,
            }
          ]"
          :style="{ backgroundColor: cellColor(cell) }"
        >
          <div
            v-if="rangeOverlayStyle(i)"
            class="gauge-cell__overlay"
            :style="rangeOverlayStyle(i)"
          ></div>
          <span v-if="rewardLabel(cell)" class="gauge-cell__label font-mono">{{ rewardLabel(cell) }}</span>
        </div>
      </div>

      <!-- Cursor -->
      <div class="psych-gauge__cursor" :style="{ left: cursorLeft }">
        <div class="psych-gauge__cursor-line"></div>
        <div class="psych-gauge__cursor-dot" :class="{ 'psych-gauge__cursor-dot--extract': canCapitalize }"></div>
      </div>

      <!-- Tick marks -->
      <div class="psych-gauge__ticks">
        <div v-for="tick in tickMarks" :key="tick.label" class="psych-gauge__tick" :style="{ left: tick.pos + '%' }">
          <span class="psych-gauge__tick-label font-mono">{{ tick.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.psych-gauge {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 12px 14px;
}

.psych-gauge__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.psych-gauge__title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--text-muted);
}

.psych-gauge__pos {
  font-size: 10px;
  color: var(--accent);
}

/* ── Track ──────────────────────────────────────────── */
.psych-gauge__track {
  position: relative;
  padding-bottom: 16px;
}

.psych-gauge__cells {
  display: flex;
  gap: 1px;
  height: 32px;
  border-radius: 3px;
  overflow: hidden;
}

/* Suspicion zone */
.psych-gauge__suspicion {
  position: absolute;
  top: 0;
  left: 0;
  height: 32px;
  background: linear-gradient(90deg, rgba(255, 51, 68, 0.15), rgba(255, 51, 68, 0.05));
  border-right: 1px solid rgba(255, 51, 68, 0.4);
  z-index: 3;
  pointer-events: none;
  animation: threat-pulse 2s ease-in-out infinite;
}

/* ── Cells ──────────────────────────────────────────── */
.gauge-cell {
  flex: 1;
  min-width: 0;
  position: relative;
  transition: background-color 0.2s;
}

.gauge-cell--current {
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  z-index: 2;
}

.gauge-cell--capitalize {
  animation: cap-glow-op 2s ease-in-out infinite;
}

/* Patterns */
.gauge-cell--temptation::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(-60deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 5px);
  background-size: 12px 100%;
  animation: chevron-right 0.8s linear infinite;
  pointer-events: none;
}

.gauge-cell--sensitivity::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(60deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 5px);
  background-size: 12px 100%;
  animation: chevron-left 0.8s linear infinite;
  pointer-events: none;
}

.gauge-cell--hesitation::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle 1.5px, rgba(255,255,255,0.15) 100%, transparent 100%);
  background-size: 6px 6px;
  animation: dot-pulse 2s ease-in-out infinite;
  pointer-events: none;
}

.gauge-cell--concern::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.08) 3px, rgba(255,255,255,0.08) 4px),
    repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.08) 3px, rgba(255,255,255,0.08) 4px);
  pointer-events: none;
}

.gauge-cell--suspicion {
  animation: suspicion-creep 1.5s ease-in-out infinite;
}

.gauge-cell__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: opacity 0.15s;
}

.gauge-cell__label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 7px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
  z-index: 1;
}

/* ── Cursor ─────────────────────────────────────────── */
.psych-gauge__cursor {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  transition: left 0.3s ease;
  z-index: 5;
  pointer-events: none;
}

.psych-gauge__cursor-line {
  width: 2px;
  height: 32px;
  background: #fff;
  margin: 0 auto;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.4);
}

.psych-gauge__cursor-dot {
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  margin: 2px auto 0;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.4);
}

.psych-gauge__cursor-dot--extract {
  background: var(--success);
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.6);
}

/* ── Tick marks ─────────────────────────────────────── */
.psych-gauge__ticks {
  position: relative;
  height: 12px;
}

.psych-gauge__tick {
  position: absolute;
  transform: translateX(-50%);
}

.psych-gauge__tick::before {
  content: '';
  display: block;
  width: 1px;
  height: 4px;
  background: var(--border-light);
  margin: 0 auto;
}

.psych-gauge__tick-label {
  font-size: 7px;
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .psych-gauge__cells {
    height: 24px;
  }

  .psych-gauge__suspicion {
    height: 24px;
  }

  .psych-gauge__cursor-line {
    height: 24px;
  }
}
</style>
