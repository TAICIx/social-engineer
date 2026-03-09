<script setup>
import { MARK_PERSONALITIES, LEVEL_CONFIG, SCAM_CONTEXTS } from '@/data/conDialogue'

const props = defineProps({
  availableScams: { type: Array, required: true },
  mark: { type: Object, required: true },
  markName: { type: String, required: true },
  currentLevel: { type: Number, required: true },
  selectedScamId: { type: String, default: null },
})

const emit = defineEmits(['selectLevel', 'selectScam', 'start'])

const levels = [1, 2, 3, 4, 5]

function levelLabel(level) {
  return MARK_PERSONALITIES[level]?.label || 'Unknown'
}

function levelConfig(level) {
  return LEVEL_CONFIG[level]
}

function scamContext(scamId) {
  return SCAM_CONTEXTS[scamId] || ''
}
</script>

<template>
  <div class="target">
    <div class="target__panel">
      <!-- Header -->
      <div class="target__header">
        <span class="target__badge font-mono">TARGET ACQUIRED</span>
        <span class="target__classification font-mono">ACTIVE</span>
      </div>

      <!-- Mark dossier -->
      <div class="target__dossier">
        <div class="target__avatar">
          <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </div>
        <div class="target__info">
          <span class="target__name">{{ markName }}</span>
          <span class="target__demo">{{ mark.label }}</span>
          <span class="target__concern font-mono">Concern resist: {{ Math.round(mark.concernSuccessRate * 100) }}%</span>
        </div>
      </div>

      <div class="target__divider"></div>

      <!-- Level selection -->
      <h3 class="target__section-title font-mono">SELECT DIFFICULTY</h3>
      <div class="level-grid">
        <button
          v-for="level in levels"
          :key="level"
          class="level-btn"
          :class="{ 'level-btn--selected': currentLevel === level }"
          @click="emit('selectLevel', level)"
        >
          <span class="level-btn__num font-mono">{{ level }}</span>
          <span class="level-btn__label">{{ levelLabel(level) }}</span>
          <span class="level-btn__meta font-mono">
            R:{{ levelConfig(level).startingResistance }}
            T:{{ levelConfig(level).maxTurns }}
          </span>
        </button>
      </div>

      <div class="target__divider"></div>

      <!-- Scam selection -->
      <h3 class="target__section-title font-mono">SELECT APPROACH</h3>
      <div class="scam-list">
        <button
          v-for="scam in availableScams"
          :key="scam.id"
          class="scam-btn"
          :class="{ 'scam-btn--selected': selectedScamId === scam.id }"
          @click="emit('selectScam', scam.id)"
        >
          <div class="scam-btn__header">
            <span class="scam-btn__tier font-mono">TIER {{ scam.tier }}</span>
            <span class="scam-btn__name">{{ scam.name }}</span>
          </div>
          <p class="scam-btn__opening">"{{ scam.openingLine }}"</p>
        </button>
      </div>

      <!-- Context preview -->
      <div v-if="selectedScamId" class="target__context">
        <span class="target__context-label font-mono">SCENARIO BRIEF</span>
        <p class="target__context-text">{{ scamContext(selectedScamId) }}</p>
      </div>

      <div class="target__divider"></div>

      <!-- Start -->
      <button
        class="target__engage font-mono"
        :disabled="!selectedScamId"
        @click="emit('start')"
      >
        ENGAGE TARGET
      </button>
    </div>
  </div>
</template>

<style scoped>
.target {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.target__panel {
  max-width: 600px;
  width: 100%;
  background: var(--bg-card, #12121c);
  border: 1px solid var(--border, #1e1e30);
  border-radius: 6px;
  padding: 24px 20px;
}

.target__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.target__badge {
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: var(--accent, #00bcd4);
}

.target__classification {
  font-size: 9px;
  letter-spacing: 0.12em;
  color: var(--success, #00ff88);
  border: 1px solid rgba(0, 255, 136, 0.25);
  padding: 3px 8px;
  border-radius: 2px;
}

.target__divider {
  height: 1px;
  background: var(--border, #1e1e30);
  margin: 16px 0;
}

.target__section-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--text-muted, #555570);
  margin-bottom: 10px;
}

/* Dossier */
.target__dossier {
  display: flex;
  align-items: center;
  gap: 14px;
}

.target__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--bg-elevated, #1a1a28);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted, #555570);
  flex-shrink: 0;
}

.target__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.target__name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary, #d4d4e0);
}

.target__demo {
  font-size: 12px;
  color: var(--text-secondary, #8888a0);
}

.target__concern {
  font-size: 10px;
  color: var(--text-muted, #555570);
}

/* Level grid */
.level-grid {
  display: flex;
  gap: 6px;
}

.level-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 4px;
  background: var(--bg-panel, #0e0e16);
  border: 1px solid var(--border, #1e1e30);
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  color: inherit;
  transition: all 0.15s;
}

.level-btn:hover {
  border-color: var(--border-light, #2a2a42);
}

.level-btn--selected {
  border-color: var(--accent, #00bcd4) !important;
  background: rgba(0, 188, 212, 0.05);
}

.level-btn__num {
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary, #d4d4e0);
}

.level-btn--selected .level-btn__num {
  color: var(--accent, #00bcd4);
}

.level-btn__label {
  font-size: 9px;
  color: var(--text-secondary, #8888a0);
}

.level-btn__meta {
  font-size: 8px;
  color: var(--text-muted, #555570);
}

/* Scam list */
.scam-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 240px;
  overflow-y: auto;
}

.scam-btn {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  background: var(--bg-panel, #0e0e16);
  border: 1px solid var(--border, #1e1e30);
  border-radius: 4px;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  color: inherit;
  transition: all 0.15s;
}

.scam-btn:hover {
  border-color: var(--border-light, #2a2a42);
}

.scam-btn--selected {
  border-color: var(--accent, #00bcd4) !important;
  background: rgba(0, 188, 212, 0.04);
}

.scam-btn__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.scam-btn__tier {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--text-muted, #555570);
  background: var(--bg-elevated, #1a1a28);
  padding: 2px 6px;
  border-radius: 2px;
}

.scam-btn__name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary, #d4d4e0);
}

.scam-btn__opening {
  font-size: 11px;
  font-style: italic;
  color: var(--text-secondary, #8888a0);
  line-height: 1.4;
}

/* Context */
.target__context {
  margin-top: 10px;
  padding: 10px;
  background: var(--bg-panel, #0e0e16);
  border: 1px solid var(--border, #1e1e30);
  border-radius: 4px;
}

.target__context-label {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-muted, #555570);
  display: block;
  margin-bottom: 4px;
}

.target__context-text {
  font-size: 11px;
  color: var(--text-secondary, #8888a0);
  line-height: 1.6;
}

/* Engage button */
.target__engage {
  width: 100%;
  padding: 14px;
  background: rgba(0, 188, 212, 0.1);
  border: 1px solid rgba(0, 188, 212, 0.3);
  border-radius: 4px;
  color: var(--accent, #00bcd4);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.15em;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.target__engage:hover:not(:disabled) {
  background: rgba(0, 188, 212, 0.18);
  border-color: var(--accent, #00bcd4);
}

.target__engage:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Scrollbar for scam list */
.scam-list::-webkit-scrollbar { width: 3px; }
.scam-list::-webkit-scrollbar-track { background: transparent; }
.scam-list::-webkit-scrollbar-thumb { background: var(--border, #1e1e30); border-radius: 2px; }
</style>
