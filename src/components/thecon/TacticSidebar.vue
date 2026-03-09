<script setup>
import { PRINCIPLES, PRINCIPLE_IDS } from '@/data/cialdini'
import { EMOTION_DISPLAY } from '@/data/conDialogue'

const props = defineProps({
  lastAnalysis: { type: Object, default: null },
  principleUsageMap: { type: Object, default: () => ({}) },
  emotionalState: { type: String, default: 'neutral' },
  rapport: { type: Number, default: 0 },
})

function scoreWidth(score) {
  // Scale 0-3 to 0-100%
  return Math.min((score / 3) * 100, 100) + '%'
}

function usageWidth(pid) {
  const usage = props.principleUsageMap[pid]
  if (!usage) return '0%'
  // Scale: each use = ~15% of bar, cap at 100
  return Math.min(usage.count * 15, 100) + '%'
}

const emotionData = EMOTION_DISPLAY
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__header">
      <span class="sidebar__title font-mono">TACTIC ANALYSIS</span>
    </div>

    <!-- Last message analysis -->
    <div v-if="lastAnalysis" class="sidebar__section">
      <span class="sidebar__section-title font-mono">LAST MESSAGE</span>

      <div v-if="lastAnalysis.detectedPrinciples.length > 0" class="analysis-list">
        <div
          v-for="p in lastAnalysis.detectedPrinciples"
          :key="p.id"
          class="analysis-item"
        >
          <div class="analysis-item__header">
            <span class="analysis-item__dot" :style="{ background: p.color }"></span>
            <span class="analysis-item__name">{{ p.name }}</span>
            <span class="analysis-item__score font-mono">{{ p.score.toFixed(1) }}</span>
          </div>
          <div class="analysis-item__bar">
            <div class="analysis-item__fill" :style="{ width: scoreWidth(p.score), background: p.color }"></div>
          </div>
          <div v-if="p.keywords.length" class="analysis-item__keywords font-mono">
            {{ p.keywords.join(', ') }}
          </div>
        </div>
      </div>

      <div v-else class="analysis-none font-mono">
        No principles detected.
      </div>

      <!-- Effectiveness note -->
      <p class="analysis-feedback">{{ lastAnalysis.feedback }}</p>
    </div>

    <div v-else class="sidebar__section">
      <span class="sidebar__section-title font-mono">LAST MESSAGE</span>
      <p class="analysis-none font-mono">Send a message to see analysis.</p>
    </div>

    <!-- Principle usage summary -->
    <div class="sidebar__section">
      <span class="sidebar__section-title font-mono">PRINCIPLE USAGE</span>
      <div class="usage-list">
        <div v-for="pid in PRINCIPLE_IDS" :key="pid" class="usage-item">
          <span class="usage-item__dot" :style="{ background: PRINCIPLES[pid].color }"></span>
          <span class="usage-item__name">{{ PRINCIPLES[pid].name }}</span>
          <div class="usage-item__bar">
            <div
              class="usage-item__fill"
              :style="{ width: usageWidth(pid), background: PRINCIPLES[pid].color }"
            ></div>
          </div>
          <span class="usage-item__count font-mono">{{ principleUsageMap[pid]?.count || 0 }}</span>
        </div>
      </div>
    </div>

    <!-- Mark psych profile -->
    <div class="sidebar__section">
      <span class="sidebar__section-title font-mono">MARK PROFILE</span>
      <div class="psych-row">
        <span class="psych-row__label">Emotional State</span>
        <span
          class="psych-row__val font-mono"
          :style="{ color: emotionData[emotionalState]?.color }"
        >
          {{ emotionData[emotionalState]?.label || 'NEUTRAL' }}
        </span>
      </div>
      <div class="psych-row">
        <span class="psych-row__label">Rapport</span>
        <span class="psych-row__val font-mono" :style="{ color: rapport > 30 ? '#4caf50' : '#8888a0' }">
          {{ rapport }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  background: var(--bg-card, #12121c);
  border: 1px solid var(--border, #1e1e30);
  border-radius: 4px;
  overflow-y: auto;
  max-height: 580px;
}

.sidebar__header {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border, #1e1e30);
}

.sidebar__title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--text-muted, #555570);
}

.sidebar__section {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border, #1e1e30);
}

.sidebar__section:last-child {
  border-bottom: none;
}

.sidebar__section-title {
  display: block;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-muted, #555570);
  margin-bottom: 8px;
}

/* Analysis items */
.analysis-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.analysis-item__header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.analysis-item__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.analysis-item__name {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary, #d4d4e0);
  flex: 1;
}

.analysis-item__score {
  font-size: 10px;
  color: var(--text-secondary, #8888a0);
}

.analysis-item__bar {
  height: 3px;
  background: var(--bg-elevated, #1a1a28);
  border-radius: 2px;
  margin-top: 3px;
  overflow: hidden;
}

.analysis-item__fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.analysis-item__keywords {
  font-size: 9px;
  color: var(--text-muted, #555570);
  margin-top: 2px;
  word-break: break-word;
}

.analysis-none {
  font-size: 10px;
  color: var(--text-muted, #555570);
  font-style: italic;
}

.analysis-feedback {
  font-size: 10px;
  color: var(--text-secondary, #8888a0);
  margin-top: 8px;
  line-height: 1.5;
}

/* Usage list */
.usage-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.usage-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.usage-item__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.usage-item__name {
  font-size: 10px;
  color: var(--text-secondary, #8888a0);
  width: 80px;
  flex-shrink: 0;
}

.usage-item__bar {
  flex: 1;
  height: 3px;
  background: var(--bg-elevated, #1a1a28);
  border-radius: 2px;
  overflow: hidden;
}

.usage-item__fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.usage-item__count {
  font-size: 9px;
  color: var(--text-muted, #555570);
  width: 16px;
  text-align: right;
  flex-shrink: 0;
}

/* Psych profile */
.psych-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 0;
}

.psych-row__label {
  font-size: 10px;
  color: var(--text-muted, #555570);
}

.psych-row__val {
  font-size: 11px;
  font-weight: 700;
}

/* Scrollbar */
.sidebar::-webkit-scrollbar { width: 3px; }
.sidebar::-webkit-scrollbar-track { background: transparent; }
.sidebar::-webkit-scrollbar-thumb { background: var(--border, #1e1e30); border-radius: 2px; }

@media (max-width: 700px) {
  .sidebar {
    max-height: 280px;
  }
}
</style>
