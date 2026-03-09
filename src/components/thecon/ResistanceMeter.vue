<script setup>
import { EMOTION_DISPLAY } from '@/data/conDialogue'

const props = defineProps({
  resistance: { type: Number, required: true },
  suspicion: { type: Number, required: true },
  suspicionThreshold: { type: Number, required: true },
  rapport: { type: Number, default: 0 },
  emotionalState: { type: String, default: 'neutral' },
  turnNumber: { type: Number, default: 0 },
  maxTurns: { type: Number, default: 20 },
})

const emotionData = EMOTION_DISPLAY
</script>

<template>
  <div class="meters">
    <!-- Resistance -->
    <div class="meter">
      <div class="meter__header">
        <span class="meter__label font-mono">RESISTANCE</span>
        <span class="meter__val font-mono">{{ resistance }}%</span>
      </div>
      <div class="meter__track">
        <div
          class="meter__fill meter__fill--resistance"
          :style="{ width: resistance + '%' }"
        ></div>
      </div>
    </div>

    <!-- Suspicion -->
    <div class="meter">
      <div class="meter__header">
        <span class="meter__label font-mono">SUSPICION</span>
        <span class="meter__val font-mono">{{ suspicion }}/{{ suspicionThreshold }}</span>
      </div>
      <div class="meter__track">
        <div
          class="meter__fill meter__fill--suspicion"
          :class="{ 'meter__fill--danger': suspicion > suspicionThreshold * 0.6 }"
          :style="{ width: Math.min((suspicion / suspicionThreshold) * 100, 100) + '%' }"
        ></div>
        <!-- Threshold marker -->
        <div class="meter__threshold" :style="{ left: '100%' }"></div>
      </div>
    </div>

    <!-- Status row -->
    <div class="meters__status">
      <div class="status-item">
        <span class="status-item__label font-mono">EMOTION</span>
        <span
          class="status-item__val font-mono"
          :style="{ color: emotionData[emotionalState]?.color || '#8888a0' }"
        >
          {{ emotionData[emotionalState]?.label || 'NEUTRAL' }}
        </span>
      </div>
      <div class="status-item">
        <span class="status-item__label font-mono">RAPPORT</span>
        <span class="status-item__val font-mono" :style="{ color: rapport > 30 ? '#4caf50' : '#8888a0' }">
          {{ rapport }}
        </span>
      </div>
      <div class="status-item">
        <span class="status-item__label font-mono">TURNS</span>
        <span class="status-item__val font-mono" :class="{ 'status-item__val--warn': turnNumber >= maxTurns - 3 }">
          {{ turnNumber }}/{{ maxTurns }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.meters {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
  background: var(--bg-card, #12121c);
  border: 1px solid var(--border, #1e1e30);
  border-radius: 4px;
}

.meter {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meter__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meter__label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-muted, #555570);
}

.meter__val {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-primary, #d4d4e0);
}

.meter__track {
  height: 6px;
  background: var(--bg-elevated, #1a1a28);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.meter__fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}

.meter__fill--resistance {
  background: linear-gradient(90deg, #ff3344, #ffaa00, #00bcd4);
}

.meter__fill--suspicion {
  background: #ff5722;
}

.meter__fill--danger {
  background: #ff3344;
  animation: meter-pulse 1.2s ease-in-out infinite;
}

@keyframes meter-pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

/* Status row */
.meters__status {
  display: flex;
  gap: 16px;
  padding-top: 4px;
  border-top: 1px solid var(--border, #1e1e30);
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.status-item__label {
  font-size: 8px;
  letter-spacing: 0.1em;
  color: var(--text-muted, #555570);
}

.status-item__val {
  font-size: 11px;
  font-weight: 700;
}

.status-item__val--warn {
  color: #ff5722;
}
</style>
