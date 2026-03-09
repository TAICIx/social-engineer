<script setup>
const props = defineProps({
  mark: { type: Object, required: true },
  markName: { type: String, required: true },
  markEmail: { type: String, required: true },
  lastLine: { type: String, default: '' },
  composure: { type: String, default: 'engaged' },
  threatLevel: { type: Number, default: 0 },
  isHesitating: { type: Boolean, default: false },
  mustResolveConcern: { type: Boolean, default: false },
})

const composureLabels = {
  engaged: { text: 'ENGAGED', color: '#00ff88' },
  wary: { text: 'WARY', color: '#ffaa00' },
  suspicious: { text: 'SUSPICIOUS', color: '#ff8800' },
  uncertain: { text: 'UNCERTAIN', color: '#ffaa00' },
  alarmed: { text: 'ALARMED', color: '#ff3344' },
}
</script>

<template>
  <div class="readout">
    <div class="readout__header">
      <span class="readout__title font-mono">MARK READOUT</span>
      <span
        class="readout__composure font-mono"
        :style="{ color: composureLabels[composure]?.color }"
      >
        {{ composureLabels[composure]?.text || composure }}
      </span>
    </div>

    <!-- Mark identity -->
    <div class="readout__identity">
      <div class="readout__avatar">
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
      </div>
      <div class="readout__info">
        <span class="readout__name">{{ markName }}</span>
        <span class="readout__email font-mono">{{ markEmail }}</span>
        <span class="readout__demo">{{ mark.label }}</span>
      </div>
    </div>

    <!-- Threat level bar -->
    <div class="readout__threat">
      <span class="readout__threat-label font-mono">THREAT LEVEL</span>
      <div class="readout__threat-bar">
        <div
          class="readout__threat-fill"
          :class="{
            'readout__threat-fill--low': threatLevel <= 25,
            'readout__threat-fill--mid': threatLevel > 25 && threatLevel <= 50,
            'readout__threat-fill--high': threatLevel > 50,
          }"
          :style="{ width: threatLevel + '%' }"
        ></div>
      </div>
      <span class="readout__threat-val font-mono">{{ threatLevel }}%</span>
    </div>

    <!-- Alert states -->
    <div v-if="mustResolveConcern" class="readout__alert readout__alert--concern font-mono">
      CONCERN DETECTED — REQUIRES RESOLUTION
    </div>
    <div v-else-if="isHesitating" class="readout__alert readout__alert--hesitation font-mono">
      MARK HESITATING — STANDBY REQUIRED
    </div>

    <!-- Last spoken line -->
    <div v-if="lastLine" class="readout__last-line">
      <span class="readout__last-line-label font-mono">LAST INTERCEPT</span>
      <p class="readout__last-line-text">"{{ lastLine }}"</p>
    </div>
  </div>
</template>

<style scoped>
.readout {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.readout__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.readout__title {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--text-muted);
}

.readout__composure {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
}

/* ── Identity ───────────────────────────────────────── */
.readout__identity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.readout__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  flex-shrink: 0;
}

.readout__info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.readout__name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}

.readout__email {
  font-size: 10px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.readout__demo {
  font-size: 10px;
  color: var(--text-muted);
}

/* ── Threat level ───────────────────────────────────── */
.readout__threat {
  display: flex;
  align-items: center;
  gap: 8px;
}

.readout__threat-label {
  font-size: 8px;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  flex-shrink: 0;
}

.readout__threat-bar {
  flex: 1;
  height: 4px;
  background: var(--bg-elevated);
  border-radius: 2px;
  overflow: hidden;
}

.readout__threat-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.readout__threat-fill--low { background: var(--success); }
.readout__threat-fill--mid { background: var(--warning); }
.readout__threat-fill--high {
  background: var(--danger);
  animation: threat-pulse 1.5s ease-in-out infinite;
}

.readout__threat-val {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-primary);
  width: 28px;
  text-align: right;
  flex-shrink: 0;
}

/* ── Alert states ───────────────────────────────────── */
.readout__alert {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 6px 10px;
  border-radius: 3px;
  text-align: center;
}

.readout__alert--concern {
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.readout__alert--hesitation {
  color: var(--warning);
  background: rgba(255, 170, 0, 0.06);
  border: 1px solid rgba(255, 170, 0, 0.15);
}

/* ── Last line ──────────────────────────────────────── */
.readout__last-line {
  border-top: 1px solid var(--border);
  padding-top: 8px;
}

.readout__last-line-label {
  font-size: 8px;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  display: block;
  margin-bottom: 4px;
}

.readout__last-line-text {
  font-size: 11px;
  color: var(--text-secondary);
  font-style: italic;
  line-height: 1.5;
}
</style>
