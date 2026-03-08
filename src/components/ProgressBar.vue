<script setup>
import { computed } from 'vue'
import { CELL_TYPES } from '@/data/scenarios'

const props = defineProps({
  cells: { type: Array, required: true },
  position: { type: Number, required: true },
  suspicionLine: { type: Number, default: 0 },
  rangePreview: { type: Object, default: () => ({}) },
  hoveredAction: { type: String, default: null },
  isHesitating: { type: Boolean, default: false },
  mustResolveConcern: { type: Boolean, default: false },
})

function cellStyle(type) {
  const meta = CELL_TYPES[type] || CELL_TYPES.neutral
  return { backgroundColor: meta.color }
}

// Determine which range overlay colors apply to a given cell index
function rangeOverlayStyle(index) {
  const rp = props.rangePreview
  if (!rp || Object.keys(rp).length === 0) return null

  const hovered = props.hoveredAction
  const overlays = []

  const rangeColors = {
    back: 'var(--range-back)',
    soft: 'var(--range-soft)',
    strong: 'var(--range-strong)',
    accelerate: 'var(--range-accel)',
  }

  for (const [action, [lo, hi]] of Object.entries(rp)) {
    if (index >= lo && index <= hi) {
      overlays.push(action)
    }
  }

  if (overlays.length === 0) return null

  // If hovering a specific action, only show that range fully; dim others
  if (hovered && overlays.includes(hovered)) {
    return { backgroundColor: rangeColors[hovered], opacity: 1 }
  }
  if (hovered && !overlays.includes(hovered)) {
    // This cell is in some other range — show at reduced opacity
    return { backgroundColor: rangeColors[overlays[0]], opacity: 0.3 }
  }

  // No hover: show first matching range at low opacity
  return { backgroundColor: rangeColors[overlays[0]], opacity: 0.5 }
}

// Reward cell labels
function rewardLabel(type) {
  if (type === 'reward_high') return '$$$'
  if (type === 'reward_medium') return '$$'
  if (type === 'reward_low') return '$'
  return ''
}

const playerLeft = computed(() => {
  const total = props.cells.length
  return `${(props.position / total) * 100}%`
})
</script>

<template>
  <div class="bar-wrapper" :class="{ 'bar-wrapper--hesitating': isHesitating }">
    <div class="bar-container">
      <div
        v-for="(cell, i) in cells"
        :key="i"
        class="bar-cell"
        :class="{
          'bar-cell--suspicion': cell === 'suspicion',
          'bar-cell--concern-active': cell === 'concern' && mustResolveConcern && i === position,
        }"
        :style="cellStyle(cell)"
        :title="`Cell ${i}: ${CELL_TYPES[cell]?.label || cell}`"
      >
        <!-- Range overlay -->
        <div
          v-if="rangeOverlayStyle(i)"
          class="bar-cell__overlay"
          :style="rangeOverlayStyle(i)"
        ></div>

        <!-- Reward label on wider screens -->
        <span v-if="rewardLabel(cell)" class="bar-cell__reward-label">{{ rewardLabel(cell) }}</span>
      </div>

      <!-- Player triangle marker (below bar) -->
      <div class="bar-player-marker" :style="{ left: playerLeft }">
        <span class="bar-player-marker__triangle">&#x25BC;</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bar-wrapper {
  width: 100%;
  margin: 0 auto;
  transition: opacity 0.3s;
  flex-shrink: 0;
}

.bar-wrapper--hesitating {
  opacity: 0.5;
}

.bar-container {
  display: flex;
  gap: 1px;
  padding: 8px 10px 20px;
  background: var(--bg-secondary);
  border-radius: 6px;
  border: 1px solid var(--border);
  position: relative;
}

.bar-cell {
  flex: 1;
  height: 32px;
  border-radius: 2px;
  position: relative;
  min-width: 0;
  transition: background-color 0.2s;
}

@media (max-width: 480px) {
  .bar-cell {
    height: 24px;
  }
}

.bar-cell--suspicion {
  animation: suspicion-pulse 1.5s ease-in-out infinite;
}

.bar-cell--concern-active {
  box-shadow: inset 0 0 6px rgba(139, 92, 246, 0.6);
}

@keyframes suspicion-pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.bar-cell__overlay {
  position: absolute;
  inset: 0;
  border-radius: 2px;
  pointer-events: none;
  transition: opacity 0.15s;
}

.bar-cell__reward-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 7px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  pointer-events: none;
  font-family: 'JetBrains Mono', monospace;
}

@media (max-width: 480px) {
  .bar-cell__reward-label {
    display: none;
  }
}

/* Player position marker — black triangle below bar */
.bar-player-marker {
  position: absolute;
  bottom: 2px;
  transform: translateX(-50%);
  transition: left 0.3s ease;
  z-index: 10;
}

.bar-player-marker__triangle {
  font-size: 12px;
  color: #000;
  text-shadow: 0 0 4px rgba(110, 143, 112, 0.8), 0 0 8px rgba(110, 143, 112, 0.4);
  line-height: 1;
}
</style>
