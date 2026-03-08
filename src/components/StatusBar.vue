<script setup>
defineProps({
  round: { type: Number, required: true },
  accelLevel: { type: Number, default: 0 },
  maxAccel: { type: Number, default: 5 },
  scamType: { type: Object, required: true },
  mark: { type: Object, required: true },
  markName: { type: String, required: true },
  suspicionLine: { type: Number, default: 0 },
  tier: { type: Number, required: true },
})
</script>

<template>
  <div class="status-bar">
    <div class="status-bar__left">
      <div class="status-item">
        <span class="status-item__label">Round</span>
        <span class="status-item__value font-mono">{{ round }}</span>
      </div>
      <div class="status-item">
        <span class="status-item__label">Tier</span>
        <span class="status-item__value font-mono">{{ tier }}</span>
      </div>
      <div class="status-item" v-if="accelLevel > 0">
        <span class="status-item__label">Accel</span>
        <span class="status-item__value font-mono" style="color: var(--accent-yellow);">
          {{ accelLevel }}/{{ maxAccel }}
        </span>
      </div>
    </div>

    <div class="status-bar__center">
      <span class="status-bar__scam">{{ scamType.emoji }} {{ scamType.name }}</span>
      <span class="status-bar__vs">vs</span>
      <span class="status-bar__mark">{{ mark.emoji }} {{ markName }}</span>
    </div>

    <div class="status-bar__right">
      <div v-if="suspicionLine > 0" class="suspicion-indicator">
        <span class="suspicion-indicator__icon">&#x1F6A8;</span>
        <span class="suspicion-indicator__text font-mono">{{ suspicionLine }}/50</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  max-width: 680px;
  margin: 0 auto;
  gap: 12px;
  flex-wrap: wrap;
}

.status-bar__left {
  display: flex;
  gap: 16px;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.status-item__label {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  font-weight: 600;
}

.status-item__value {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.status-bar__center {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.status-bar__scam {
  color: var(--text-primary);
  font-weight: 600;
}

.status-bar__vs {
  color: var(--text-muted);
  font-size: 11px;
  font-style: italic;
}

.status-bar__mark {
  color: var(--text-secondary);
  font-weight: 500;
}

.status-bar__right {
  display: flex;
  align-items: center;
}

.suspicion-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(185, 28, 28, 0.15);
  border: 1px solid rgba(185, 28, 28, 0.3);
  border-radius: 6px;
}

.suspicion-indicator__icon {
  font-size: 14px;
}

.suspicion-indicator__text {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-red-light);
}

@media (max-width: 540px) {
  .status-bar { flex-direction: column; gap: 8px; }
  .status-bar__left { justify-content: center; }
}
</style>
