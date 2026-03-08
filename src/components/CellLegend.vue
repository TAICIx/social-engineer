<script setup>
import { CELL_TYPES } from '@/data/scenarios'

defineProps({
  visible: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const legendItems = [
  'neutral', 'reward_low', 'reward_medium', 'reward_high',
  'temptation', 'sensitivity', 'concern', 'hesitation', 'fail',
]

const rangeItems = [
  { label: 'Backward', color: 'var(--range-back)' },
  { label: 'Soft Forward', color: 'var(--range-soft)' },
  { label: 'Strong Forward', color: 'var(--range-strong)' },
  { label: 'Accelerated', color: 'var(--range-accel)' },
]
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="legend-overlay" @click.self="emit('close')">
      <div class="legend-panel">
        <div class="legend-panel__header">
          <h3>Cell Legend</h3>
          <button class="legend-panel__close" @click="emit('close')">&times;</button>
        </div>

        <div class="legend-section">
          <h4 class="legend-section__title">Cell Types</h4>
          <div class="legend-grid">
            <div v-for="key in legendItems" :key="key" class="legend__item">
              <span class="legend__swatch" :style="{ backgroundColor: CELL_TYPES[key].color }"></span>
              <span class="legend__label">{{ CELL_TYPES[key].label }}</span>
            </div>
          </div>
        </div>

        <div class="legend-section">
          <h4 class="legend-section__title">Range Indicators</h4>
          <div class="legend-grid">
            <div v-for="r in rangeItems" :key="r.label" class="legend__item">
              <span class="legend__swatch" :style="{ backgroundColor: r.color }"></span>
              <span class="legend__label">{{ r.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.legend-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.legend-panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  max-width: 360px;
  width: 100%;
}

.legend-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.legend-panel__header h3 {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.legend-panel__close {
  font-size: 20px;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}

.legend-panel__close:hover {
  color: var(--text-primary);
}

.legend-section {
  margin-bottom: 14px;
}

.legend-section:last-child {
  margin-bottom: 0;
}

.legend-section__title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.legend-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
}

.legend__item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend__swatch {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  flex-shrink: 0;
}

.legend__label {
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
}
</style>
