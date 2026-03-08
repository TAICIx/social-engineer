<script setup>
const props = defineProps({
  canCapitalize: { type: Boolean, default: false },
  isHesitating: { type: Boolean, default: false },
  mustResolveConcern: { type: Boolean, default: false },
  accelLevel: { type: Number, default: 0 },
  maxAccel: { type: Number, default: 5 },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['action'])

function doAction(action) {
  if (props.disabled) return
  emit('action', action)
}
</script>

<template>
  <!-- Concern resolution overlay -->
  <div v-if="mustResolveConcern" class="action-panel">
    <p class="action-panel__label" style="color: var(--accent-purple);">
      The mark is suspicious. You must address their concern.
    </p>
    <button
      class="action-btn action-btn--concern"
      @click="doAction('resolve_concern')"
      :disabled="disabled"
    >
      <span class="action-btn__icon">&#x1F5E3;&#xFE0F;</span>
      <span class="action-btn__text">
        <strong>Address Concern</strong>
        <small>Success depends on mark type</small>
      </span>
    </button>
  </div>

  <!-- Hesitation notice -->
  <div v-else-if="isHesitating" class="action-panel">
    <p class="action-panel__label" style="color: var(--accent-yellow);">
      The mark is hesitating. You must skip this turn.
    </p>
    <button
      class="action-btn action-btn--skip"
      @click="doAction('skip')"
      :disabled="disabled"
    >
      <span class="action-btn__icon">&#x23ED;&#xFE0F;</span>
      <span class="action-btn__text">
        <strong>Skip Turn</strong>
        <small>Wait for the mark to come around</small>
      </span>
    </button>
  </div>

  <!-- Normal actions -->
  <div v-else class="action-panel">
    <div class="action-grid">
      <button class="action-btn action-btn--strong" @click="doAction('strong')" :disabled="disabled">
        <span class="action-btn__icon">&#x1F4AA;</span>
        <span class="action-btn__text">
          <strong>Strong Forward</strong>
          <small>Big jump, imprecise</small>
        </span>
      </button>

      <button class="action-btn action-btn--soft" @click="doAction('soft')" :disabled="disabled">
        <span class="action-btn__icon">&#x1F91D;</span>
        <span class="action-btn__text">
          <strong>Soft Forward</strong>
          <small>Small, precise</small>
        </span>
      </button>

      <button class="action-btn action-btn--back" @click="doAction('back')" :disabled="disabled">
        <span class="action-btn__icon">&#x1F519;</span>
        <span class="action-btn__text">
          <strong>Retreat</strong>
          <small>Step backward</small>
        </span>
      </button>

      <button
        class="action-btn action-btn--accel"
        @click="doAction('accelerate')"
        :disabled="disabled || accelLevel >= maxAccel"
      >
        <span class="action-btn__icon">&#x26A1;</span>
        <span class="action-btn__text">
          <strong>Accelerate</strong>
          <small>{{ accelLevel }}/{{ maxAccel }} stacks</small>
        </span>
        <span v-if="accelLevel > 0" class="action-btn__badge">{{ accelLevel }}x</span>
      </button>

      <button
        class="action-btn action-btn--capitalize"
        @click="doAction('capitalize')"
        :disabled="disabled || !canCapitalize"
        :class="{ 'action-btn--glow': canCapitalize }"
      >
        <span class="action-btn__icon">&#x1F4B0;</span>
        <span class="action-btn__text">
          <strong>Capitalize</strong>
          <small>{{ canCapitalize ? 'Cash out now!' : 'Land on reward cell' }}</small>
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.action-panel {
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
}

.action-panel__label {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

@media (max-width: 640px) {
  .action-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 400px) {
  .action-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  font-family: inherit;
}

.action-btn:hover:not(:disabled) {
  border-color: var(--border-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.action-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.action-btn__icon {
  font-size: 24px;
  line-height: 1;
}

.action-btn__text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.action-btn__text strong {
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.action-btn__text small {
  font-size: 9px;
  color: var(--text-muted);
  white-space: nowrap;
}

.action-btn__badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--accent-yellow);
  color: #000;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  font-family: 'JetBrains Mono', monospace;
}

.action-btn--strong:hover:not(:disabled) { border-color: #6e8f70; }
.action-btn--soft:hover:not(:disabled) { border-color: #9FB6A1; }
.action-btn--back:hover:not(:disabled) { border-color: #999; }
.action-btn--accel:hover:not(:disabled) { border-color: var(--accent-yellow); }
.action-btn--concern { border-color: var(--accent-purple); background: rgba(91, 33, 182, 0.15); width: 100%; }
.action-btn--skip { border-color: var(--accent-yellow); background: rgba(146, 64, 14, 0.15); width: 100%; }

.action-btn--capitalize:hover:not(:disabled) { border-color: var(--accent-green); }
.action-btn--glow {
  border-color: var(--accent-green) !important;
  box-shadow: 0 0 12px rgba(110, 143, 112, 0.4);
  animation: capitalize-pulse 1.5s ease-in-out infinite;
}

@keyframes capitalize-pulse {
  0%, 100% { box-shadow: 0 0 8px rgba(110, 143, 112, 0.3); }
  50% { box-shadow: 0 0 20px rgba(110, 143, 112, 0.6); }
}
</style>
