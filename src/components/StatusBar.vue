<script setup>
defineProps({
  scamType: { type: Object, required: true },
  mark: { type: Object, required: true },
  markEmail: { type: String, required: true },
  accelLevel: { type: Number, default: 0 },
  maxAccel: { type: Number, default: 5 },
})

const emit = defineEmits(['toggleLegend'])
</script>

<template>
  <div class="info-row">
    <div class="info-row__left">
      <!-- Mark avatar -->
      <span class="info-row__avatar">{{ mark.emoji }}</span>

      <!-- Email in mono -->
      <span class="info-row__email font-mono">{{ markEmail }}</span>

      <!-- Scam type pill -->
      <span class="info-row__scam-pill">
        {{ scamType.emoji }} {{ scamType.name }}
      </span>
    </div>

    <div class="info-row__right">
      <!-- Acceleration stacks -->
      <span v-if="accelLevel > 0" class="info-row__accel font-mono">
        &#x26A1; {{ accelLevel }}/{{ maxAccel }}
      </span>

      <!-- Help toggle -->
      <button class="info-row__help" @click="emit('toggleLegend')" title="Cell legend">
        (?)
      </button>
    </div>
  </div>
</template>

<style scoped>
.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  margin: 0 auto;
  gap: 8px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.info-row__left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
}

.info-row__avatar {
  font-size: 24px;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  border-radius: 50%;
}

.info-row__email {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-row__scam-pill {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--bg-elevated);
  padding: 3px 8px;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
}

.info-row__right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.info-row__accel {
  font-size: 11px;
  font-weight: 600;
  color: var(--accent-yellow);
  background: rgba(146, 64, 14, 0.15);
  padding: 3px 8px;
  border-radius: 4px;
}

.info-row__help {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  background: none;
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 6px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.info-row__help:hover {
  border-color: var(--border-light);
  color: var(--text-secondary);
}

@media (max-width: 480px) {
  .info-row__email {
    display: none;
  }
}
</style>
