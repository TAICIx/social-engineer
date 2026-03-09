<script setup>
const props = defineProps({
  action: { type: String, required: true },
  name: { type: String, required: true },
  range: { type: Array, default: null },
  color: { type: String, default: '#00d4ff' },
  disabled: { type: Boolean, default: false },
  accelLevel: { type: Number, default: null },
  maxAccel: { type: Number, default: 5 },
})

const emit = defineEmits(['execute', 'hover', 'leave'])

const descriptions = {
  strong: 'Aggressive forward push. Resets pressure.',
  soft: 'Cautious forward movement. Resets pressure.',
  back: 'Strategic retreat. Resets pressure.',
  accelerate: 'Build pressure. Next move gains range.',
}

const icons = {
  strong: '\u25B6\u25B6',
  soft: '\u25B6',
  back: '\u25C0',
  accelerate: '\u26A1',
}
</script>

<template>
  <button
    class="tactic-card"
    :class="{ 'tactic-card--disabled': disabled }"
    :style="{ '--tactic-color': color }"
    :disabled="disabled"
    @click="emit('execute')"
    @mouseenter="emit('hover')"
    @mouseleave="emit('leave')"
  >
    <div class="tactic-card__header">
      <span class="tactic-card__icon">{{ icons[action] || '\u25C6' }}</span>
      <span class="tactic-card__name">{{ name }}</span>
    </div>

    <p class="tactic-card__desc">{{ descriptions[action] || '' }}</p>

    <div class="tactic-card__range font-mono" v-if="range">
      <span v-if="action === 'back'" class="tactic-card__range-val">{{ range[0] }} to {{ range[1] }}</span>
      <span v-else class="tactic-card__range-val">+{{ range[0] }} to +{{ range[1] }}</span>
    </div>

    <div v-if="accelLevel !== null" class="tactic-card__accel font-mono">
      <span v-for="i in maxAccel" :key="i" class="tactic-card__pip" :class="{ 'tactic-card__pip--filled': i <= accelLevel }"></span>
    </div>
  </button>
</template>

<style scoped>
.tactic-card {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px 12px;
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 4px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
  color: inherit;
  position: relative;
  overflow: hidden;
}

.tactic-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 3px;
  background: var(--tactic-color);
  opacity: 0.5;
}

.tactic-card:hover:not(:disabled) {
  border-color: var(--tactic-color);
  background: color-mix(in srgb, var(--tactic-color) 5%, var(--bg-panel));
}

.tactic-card:hover:not(:disabled)::before {
  opacity: 1;
}

.tactic-card--disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.tactic-card__header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tactic-card__icon {
  font-size: 11px;
  color: var(--tactic-color);
}

.tactic-card__name {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.tactic-card__desc {
  font-size: 10px;
  color: var(--text-muted);
  line-height: 1.4;
}

.tactic-card__range {
  margin-top: auto;
}

.tactic-card__range-val {
  font-size: 11px;
  font-weight: 700;
  color: var(--tactic-color);
  letter-spacing: 0.04em;
}

/* ── Acceleration pips ──────────────────────────────── */
.tactic-card__accel {
  display: flex;
  gap: 3px;
  margin-top: 2px;
}

.tactic-card__pip {
  width: 12px;
  height: 3px;
  background: var(--bg-elevated);
  border-radius: 1px;
}

.tactic-card__pip--filled {
  background: var(--tactic-color);
}
</style>
