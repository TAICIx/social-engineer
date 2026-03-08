<script setup>
import { CELL_TYPES } from '@/data/scenarios'

const legendItems = [
  'neutral', 'reward_low', 'reward_medium', 'reward_high',
  'temptation', 'sensitivity', 'concern', 'hesitation', 'fail',
]
</script>

<template>
  <div class="legend">
    <div v-for="key in legendItems" :key="key" class="legend__item">
      <span class="legend__swatch" :style="{ backgroundColor: CELL_TYPES[key].color }"></span>
      <span class="legend__label">{{ CELL_TYPES[key].label }}</span>
    </div>
  </div>
</template>

<style scoped>
.legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 16px;
  max-width: 680px;
  margin: 0 auto;
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
  font-size: 10px;
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
}
</style>
