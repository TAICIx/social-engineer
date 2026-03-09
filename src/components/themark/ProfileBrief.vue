<script setup>
import { MARK_DIFFICULTY } from '@/data/markDialogue'

const props = defineProps({
  playerProfile: { type: String, required: true },
  scenarioSetup: { type: String, required: true },
  currentLevel: { type: Number, required: true },
  difficulty: { type: Object, required: true },
})

const emit = defineEmits(['selectLevel', 'start'])

const levels = [1, 2, 3, 4, 5]

function levelData(level) {
  return MARK_DIFFICULTY[level]
}
</script>

<template>
  <div class="brief">
    <div class="brief__panel">
      <!-- Header -->
      <div class="brief__header">
        <span class="brief__badge font-mono">INCOMING CONTACT</span>
        <span class="brief__status font-mono">UNVERIFIED</span>
      </div>

      <!-- Your profile -->
      <div class="brief__section">
        <span class="brief__section-title font-mono">YOUR IDENTITY</span>
        <p class="brief__profile">{{ playerProfile }}</p>
      </div>

      <div class="brief__divider"></div>

      <!-- Scenario -->
      <div class="brief__section">
        <span class="brief__section-title font-mono">SITUATION</span>
        <p class="brief__scenario">{{ scenarioSetup }}</p>
      </div>

      <div class="brief__divider"></div>

      <!-- Mission brief -->
      <div class="brief__section">
        <span class="brief__section-title font-mono">YOUR OBJECTIVE</span>
        <p class="brief__objective">Talk to the caller. Figure out if this is legitimate or a scam. Make your call before time runs out.</p>
        <div class="brief__outcomes">
          <div class="brief__outcome brief__outcome--good">
            <span class="brief__outcome-icon font-mono">+</span>
            <span>Correctly identify scam or legit = WIN</span>
          </div>
          <div class="brief__outcome brief__outcome--bad">
            <span class="brief__outcome-icon font-mono">-</span>
            <span>Fall for a scam or falsely accuse = LOSE</span>
          </div>
        </div>
      </div>

      <div class="brief__divider"></div>

      <!-- Difficulty -->
      <h3 class="brief__section-title font-mono">SELECT DIFFICULTY</h3>
      <div class="level-grid">
        <button
          v-for="level in levels"
          :key="level"
          class="level-btn"
          :class="{ 'level-btn--selected': currentLevel === level }"
          @click="emit('selectLevel', level)"
        >
          <span class="level-btn__num font-mono">{{ level }}</span>
          <span class="level-btn__label">{{ levelData(level).label }}</span>
          <span class="level-btn__meta font-mono">T:{{ levelData(level).maxTurns }}</span>
        </button>
      </div>

      <p class="brief__diff-desc">{{ difficulty.description }}</p>

      <div class="brief__divider"></div>

      <!-- Start -->
      <button
        class="brief__answer font-mono"
        @click="emit('start')"
      >
        ANSWER THE CALL
      </button>
    </div>
  </div>
</template>

<style scoped>
.brief {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.brief__panel {
  max-width: 600px;
  width: 100%;
  background: var(--bg-card, #12121c);
  border: 1px solid var(--border, #1e1e30);
  border-radius: 6px;
  padding: 24px 20px;
}

.brief__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.brief__badge {
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: var(--mark-accent, #ffaa00);
}

.brief__status {
  font-size: 9px;
  letter-spacing: 0.12em;
  color: var(--mark-accent, #ffaa00);
  border: 1px solid rgba(255, 170, 0, 0.25);
  padding: 3px 8px;
  border-radius: 2px;
  animation: pulse-glow 2s ease-in-out infinite;
}

.brief__divider {
  height: 1px;
  background: var(--border, #1e1e30);
  margin: 16px 0;
}

.brief__section {
  margin-bottom: 4px;
}

.brief__section-title {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--text-muted, #555570);
  margin-bottom: 8px;
}

.brief__profile {
  font-size: 13px;
  color: var(--text-primary, #d4d4e0);
  line-height: 1.6;
}

.brief__scenario {
  font-size: 13px;
  color: var(--text-secondary, #8888a0);
  line-height: 1.6;
  font-style: italic;
}

.brief__objective {
  font-size: 12px;
  color: var(--text-secondary, #8888a0);
  line-height: 1.5;
  margin-bottom: 10px;
}

.brief__outcomes {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.brief__outcome {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--text-secondary, #8888a0);
}

.brief__outcome--good .brief__outcome-icon {
  color: var(--mark-safe, #00ff88);
}

.brief__outcome--bad .brief__outcome-icon {
  color: var(--mark-danger, #ff3344);
}

.brief__outcome-icon {
  font-size: 14px;
  font-weight: 900;
  width: 18px;
  text-align: center;
}

.brief__diff-desc {
  font-size: 11px;
  color: var(--text-muted, #555570);
  margin-top: 8px;
  font-style: italic;
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
  border-color: var(--mark-accent, #ffaa00) !important;
  background: rgba(255, 170, 0, 0.05);
}

.level-btn__num {
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary, #d4d4e0);
}

.level-btn--selected .level-btn__num {
  color: var(--mark-accent, #ffaa00);
}

.level-btn__label {
  font-size: 9px;
  color: var(--text-secondary, #8888a0);
}

.level-btn__meta {
  font-size: 8px;
  color: var(--text-muted, #555570);
}

/* Answer button */
.brief__answer {
  width: 100%;
  padding: 14px;
  background: rgba(255, 170, 0, 0.1);
  border: 1px solid rgba(255, 170, 0, 0.3);
  border-radius: 4px;
  color: var(--mark-accent, #ffaa00);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.15em;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.brief__answer:hover {
  background: rgba(255, 170, 0, 0.18);
  border-color: var(--mark-accent, #ffaa00);
}
</style>
