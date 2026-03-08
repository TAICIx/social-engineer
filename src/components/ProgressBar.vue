<script setup>
import { computed } from 'vue'
import { CELL_TYPES } from '@/data/scenarios'

const props = defineProps({
  cells: { type: Array, required: true },
  position: { type: Number, required: true },
  suspicionLine: { type: Number, default: 0 },
})

function cellStyle(type) {
  const meta = CELL_TYPES[type] || CELL_TYPES.neutral
  return { backgroundColor: meta.color }
}

function isPlayerHere(index) {
  return index === props.position
}
</script>

<template>
  <div class="progress-bar-wrapper">
    <div class="progress-bar">
      <div
        v-for="(cell, i) in cells"
        :key="i"
        class="cell"
        :class="{
          'cell--player': isPlayerHere(i),
          'cell--suspicion': cell === 'suspicion',
        }"
        :style="cellStyle(cell)"
        :title="`Cell ${i}: ${CELL_TYPES[cell]?.label || cell}`"
      >
        <span v-if="isPlayerHere(i)" class="cell__marker">&#x25BC;</span>
        <span v-if="isPlayerHere(i)" class="cell__player">&#x1F464;</span>
      </div>
    </div>

    <!-- Position indicator -->
    <div class="progress-bar__info">
      <span class="font-mono text-xs" style="color: var(--text-muted)">0</span>
      <span class="font-mono text-xs" style="color: var(--text-secondary)">
        Position: {{ position }} / {{ cells.length - 1 }}
      </span>
      <span class="font-mono text-xs" style="color: var(--text-muted)">{{ cells.length - 1 }}</span>
    </div>
  </div>
</template>

<style scoped>
.progress-bar-wrapper {
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
}

.progress-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.cell {
  flex: 0 0 calc((100% - 49 * 2px) / 50);
  aspect-ratio: 1;
  border-radius: 3px;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-width: 0;
}

/* Tablet: 25 per row */
@media (max-width: 768px) {
  .cell {
    flex: 0 0 calc((100% - 24 * 2px) / 25);
  }
}

/* Small mobile: 10 per row */
@media (max-width: 480px) {
  .cell {
    flex: 0 0 calc((100% - 9 * 2px) / 10);
  }
}

.cell--player {
  transform: scale(1.4);
  z-index: 10;
  box-shadow: 0 0 8px rgba(110, 143, 112, 0.6), 0 0 16px rgba(110, 143, 112, 0.3);
  border-radius: 3px;
}

.cell--suspicion {
  animation: suspicion-pulse 1.5s ease-in-out infinite;
}

@keyframes suspicion-pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.cell__marker {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 8px;
  color: var(--accent-green-light);
  line-height: 1;
}

.cell__player {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  line-height: 1;
}

@media (max-width: 480px) {
  .cell__player { font-size: 12px; }
  .cell__marker { font-size: 10px; top: -16px; }
}

.progress-bar__info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  padding: 0 12px;
}
</style>
