<script setup>
import { ACTION_EMOJIS } from '@/data/scenarios'

const props = defineProps({
  canCapitalize: { type: Boolean, default: false },
  isHesitating: { type: Boolean, default: false },
  mustResolveConcern: { type: Boolean, default: false },
  accelLevel: { type: Number, default: 0 },
  maxAccel: { type: Number, default: 5 },
  disabled: { type: Boolean, default: false },
  round: { type: Number, default: 0 },
  rewardTierLabel: { type: String, default: '' },
})

const emit = defineEmits(['action', 'hover'])

const actions = ['strong', 'soft', 'back', 'accelerate', 'capitalize']

function doAction(action) {
  if (props.disabled) return
  emit('action', action)
}

function onHover(action) {
  emit('hover', action)
}

function onLeave() {
  emit('hover', null)
}
</script>

<template>
  <div class="actions-row">
    <!-- Concern overlay -->
    <template v-if="mustResolveConcern">
      <div class="actions-row__buttons actions-row__buttons--disabled">
        <button
          v-for="a in actions"
          :key="a"
          class="emoji-btn emoji-btn--greyed"
          disabled
        >
          <span class="emoji-btn__face">{{ ACTION_EMOJIS[a].emoji }}</span>
        </button>
      </div>
      <div class="actions-row__counter actions-row__counter--concern">
        <button class="resolve-btn" @click="doAction('resolve_concern')" :disabled="disabled">
          RESOLVE
        </button>
        <span class="counter-num font-mono">{{ round }}</span>
      </div>
    </template>

    <!-- Hesitation overlay -->
    <template v-else-if="isHesitating">
      <div class="actions-row__buttons actions-row__buttons--disabled">
        <button
          v-for="a in actions"
          :key="a"
          class="emoji-btn emoji-btn--greyed"
          disabled
        >
          <span class="emoji-btn__face">{{ ACTION_EMOJIS[a].emoji }}</span>
        </button>
      </div>
      <div class="actions-row__counter actions-row__counter--hesitation">
        <button class="skip-btn" @click="doAction('skip')" :disabled="disabled">
          SKIP
        </button>
        <span class="hesitation-msg">The target needs time to think</span>
      </div>
    </template>

    <!-- Normal actions -->
    <template v-else>
      <div class="actions-row__buttons">
        <button
          v-for="a in actions"
          :key="a"
          class="emoji-btn"
          :class="{
            'emoji-btn--capitalize-glow': a === 'capitalize' && canCapitalize,
            'emoji-btn--disabled': a === 'capitalize' && !canCapitalize,
            'emoji-btn--disabled': a === 'accelerate' && accelLevel >= maxAccel,
          }"
          :disabled="disabled || (a === 'capitalize' && !canCapitalize) || (a === 'accelerate' && accelLevel >= maxAccel)"
          @click="doAction(a)"
          @mouseenter="onHover(a)"
          @mouseleave="onLeave"
          :title="ACTION_EMOJIS[a].label"
        >
          <span class="emoji-btn__face">{{ ACTION_EMOJIS[a].emoji }}</span>
          <span v-if="a === 'capitalize' && canCapitalize" class="emoji-btn__tier">{{ rewardTierLabel }}</span>
        </button>
      </div>
      <div class="actions-row__counter">
        <span class="counter-label font-mono">RESPOND</span>
        <span class="counter-num font-mono">{{ round }}</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.actions-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 auto;
  width: 100%;
  flex-shrink: 0;
}

.actions-row__buttons {
  display: flex;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.actions-row__buttons--disabled {
  opacity: 0.35;
  pointer-events: none;
}

.emoji-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px solid var(--border);
  background: var(--bg-card);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.15s ease;
  padding: 0;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .emoji-btn {
    width: 44px;
    height: 44px;
  }
  .emoji-btn__face {
    font-size: 24px !important;
  }
}

.emoji-btn:hover:not(:disabled) {
  border-color: var(--accent-green-light);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.emoji-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.emoji-btn--greyed {
  filter: grayscale(1);
  opacity: 0.3 !important;
}

.emoji-btn__face {
  font-size: 28px;
  line-height: 1;
}

.emoji-btn__tier {
  position: absolute;
  bottom: -6px;
  right: -4px;
  background: var(--accent-yellow);
  color: #000;
  font-size: 8px;
  font-weight: 800;
  padding: 1px 4px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
}

/* Capitalize golden glow */
.emoji-btn--capitalize-glow {
  border-color: var(--accent-yellow) !important;
  box-shadow: 0 0 12px var(--capitalize-glow);
  animation: cap-pulse 1.5s ease-in-out infinite;
}

@keyframes cap-pulse {
  0%, 100% { box-shadow: 0 0 8px var(--capitalize-glow); }
  50% { box-shadow: 0 0 20px var(--capitalize-glow); }
}

.emoji-btn--disabled {
  opacity: 0.35;
}

/* Counter section */
.actions-row__counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 70px;
  flex-shrink: 0;
}

.actions-row__counter--concern {
  gap: 6px;
}

.actions-row__counter--hesitation {
  gap: 4px;
  min-width: 80px;
}

.counter-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.06em;
}

.counter-num {
  font-size: 22px;
  font-weight: 800;
  color: var(--text-primary);
}

.resolve-btn {
  padding: 8px 16px;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid var(--accent-purple);
  color: var(--accent-purple);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: 0.04em;
  transition: all 0.15s;
}

.resolve-btn:hover:not(:disabled) {
  background: rgba(139, 92, 246, 0.3);
}

.skip-btn {
  padding: 8px 16px;
  background: rgba(146, 64, 14, 0.2);
  border: 1px solid var(--accent-yellow);
  color: var(--accent-yellow);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: 0.04em;
  transition: all 0.15s;
}

.skip-btn:hover:not(:disabled) {
  background: rgba(146, 64, 14, 0.3);
}

.hesitation-msg {
  font-size: 9px;
  color: var(--text-muted);
  text-align: center;
  line-height: 1.3;
}
</style>
