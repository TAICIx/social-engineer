<script setup>
import { ref } from 'vue'
import { SCAM_TYPES } from '@/data/scenarios'
import { MARK_SCENARIOS } from '@/data/markDialogue'

const props = defineProps({
  gameResult: { type: String, required: true },
  wasScam: { type: Boolean, required: true },
  scenarioId: { type: String, required: true },
  scamType: { type: Object, default: null },
  callerIdentity: { type: String, default: '' },
  turnAtVerdict: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  currentLevel: { type: Number, default: 1 },
  chatLog: { type: Array, default: () => [] },
  redFlagSummary: { type: Array, default: () => [] },
  shareText: { type: String, default: '' },
})

const emit = defineEmits(['restart', 'home'])

const copied = ref(false)

const resultConfig = {
  correct_scam: {
    title: 'SCAM DETECTED',
    subtitle: 'You saw through the deception.',
    color: '#00ff88',
    icon: '[OK]',
  },
  correct_legit: {
    title: 'CORRECTLY TRUSTED',
    subtitle: 'Good judgment. This was legitimate.',
    color: '#00ff88',
    icon: '[OK]',
  },
  fell_for_it: {
    title: 'YOU GOT SCAMMED',
    subtitle: 'The caller successfully deceived you.',
    color: '#ff3344',
    icon: '[!!]',
  },
  paranoid: {
    title: 'FALSE ALARM',
    subtitle: 'You accused a legitimate caller. Opportunity lost.',
    color: '#ffaa00',
    icon: '[?]',
  },
  timeout: {
    title: 'TIME EXPIRED',
    subtitle: 'You didn\'t make a call in time.',
    color: '#555570',
    icon: '[--]',
  },
}

const result = resultConfig[props.gameResult] || resultConfig.timeout

const debrief = props.scamType?.debrief

function copyShare() {
  navigator.clipboard.writeText(props.shareText).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }).catch(() => {})
}
</script>

<template>
  <div class="debrief">
    <div class="debrief__panel">
      <!-- Result header -->
      <div class="debrief__result" :style="{ borderColor: result.color }">
        <span class="debrief__result-icon font-mono" :style="{ color: result.color }">{{ result.icon }}</span>
        <div>
          <h2 class="debrief__result-title font-mono" :style="{ color: result.color }">{{ result.title }}</h2>
          <p class="debrief__result-sub">{{ result.subtitle }}</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="debrief__stats">
        <div class="debrief__stat">
          <span class="debrief__stat-label font-mono">SCORE</span>
          <span class="debrief__stat-value font-mono" :style="{ color: score > 0 ? '#00ff88' : '#ff3344' }">{{ score }}</span>
        </div>
        <div class="debrief__stat">
          <span class="debrief__stat-label font-mono">TURNS</span>
          <span class="debrief__stat-value font-mono">{{ turnAtVerdict }}</span>
        </div>
        <div class="debrief__stat">
          <span class="debrief__stat-label font-mono">LEVEL</span>
          <span class="debrief__stat-value font-mono">{{ currentLevel }}</span>
        </div>
        <div class="debrief__stat">
          <span class="debrief__stat-label font-mono">REALITY</span>
          <span class="debrief__stat-value font-mono" :style="{ color: wasScam ? '#ff3344' : '#00ff88' }">
            {{ wasScam ? 'SCAM' : 'LEGIT' }}
          </span>
        </div>
      </div>

      <div class="debrief__divider"></div>

      <!-- Red flags summary -->
      <div v-if="redFlagSummary.length > 0" class="debrief__section">
        <h3 class="debrief__section-title font-mono">RED FLAGS DETECTED</h3>
        <div class="debrief__flags">
          <div v-for="flag in redFlagSummary" :key="flag.id" class="debrief__flag">
            <span class="debrief__flag-dot" :style="{ background: flag.color }"></span>
            <span class="debrief__flag-label">{{ flag.label }}</span>
            <span class="debrief__flag-count font-mono">x{{ flag.count }}</span>
          </div>
        </div>
      </div>

      <div v-if="redFlagSummary.length > 0" class="debrief__divider"></div>

      <!-- Annotated transcript -->
      <div class="debrief__section">
        <h3 class="debrief__section-title font-mono">CONVERSATION TRANSCRIPT</h3>
        <div class="debrief__transcript">
          <div
            v-for="(entry, i) in chatLog"
            :key="i"
            class="debrief__line"
            :class="{
              'debrief__line--caller': entry.sender === 'caller',
              'debrief__line--player': entry.sender === 'player',
              'debrief__line--system': entry.sender === 'system',
            }"
          >
            <span class="debrief__line-sender font-mono">
              {{ entry.sender === 'caller' ? 'CALLER' : entry.sender === 'player' ? 'YOU' : 'SYS' }}
            </span>
            <span class="debrief__line-text">{{ entry.text }}</span>
            <div v-if="entry.redFlags?.length" class="debrief__line-flags">
              <span
                v-for="flag in entry.redFlags"
                :key="flag.id"
                class="debrief__line-flag font-mono"
                :style="{ color: flag.color, borderColor: flag.color }"
              >
                {{ flag.label }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="debrief__divider"></div>

      <!-- Intel report -->
      <div v-if="debrief && wasScam" class="debrief__section">
        <h3 class="debrief__section-title font-mono">INTEL REPORT — {{ scamType?.name?.toUpperCase() }}</h3>

        <div class="debrief__intel">
          <div class="debrief__intel-block">
            <span class="debrief__intel-label font-mono">HOW IT WORKS</span>
            <p class="debrief__intel-text">{{ debrief.howItWorks }}</p>
          </div>
          <div class="debrief__intel-block">
            <span class="debrief__intel-label font-mono">WHY IT WORKS</span>
            <p class="debrief__intel-text">{{ debrief.whyItWorks }}</p>
          </div>
          <div class="debrief__intel-block">
            <span class="debrief__intel-label font-mono">HOW TO SPOT IT</span>
            <p class="debrief__intel-text">{{ debrief.howToSpot }}</p>
          </div>
        </div>
      </div>

      <div v-if="debrief && wasScam" class="debrief__divider"></div>

      <!-- Actions -->
      <div class="debrief__actions">
        <button class="debrief__btn debrief__btn--share font-mono" @click="copyShare">
          {{ copied ? 'COPIED' : 'SHARE RESULT' }}
        </button>
        <button class="debrief__btn debrief__btn--restart font-mono" @click="emit('restart')">
          NEW SCENARIO
        </button>
        <button class="debrief__btn debrief__btn--home font-mono" @click="emit('home')">
          BASE
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.debrief {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 20px 0;
  overflow-y: auto;
}

.debrief__panel {
  max-width: 700px;
  width: 100%;
  background: var(--bg-card, #12121c);
  border: 1px solid var(--border, #1e1e30);
  border-radius: 6px;
  padding: 24px 20px;
}

.debrief__result {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 2px solid;
  margin-bottom: 16px;
}

.debrief__result-icon {
  font-size: 24px;
  font-weight: 900;
}

.debrief__result-title {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.debrief__result-sub {
  font-size: 12px;
  color: var(--text-secondary, #8888a0);
  margin-top: 2px;
}

/* Stats */
.debrief__stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.debrief__stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.debrief__stat-label {
  font-size: 8px;
  letter-spacing: 0.1em;
  color: var(--text-muted, #555570);
}

.debrief__stat-value {
  font-size: 18px;
  font-weight: 900;
  color: var(--text-primary, #d4d4e0);
}

.debrief__divider {
  height: 1px;
  background: var(--border, #1e1e30);
  margin: 16px 0;
}

.debrief__section-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--text-muted, #555570);
  margin-bottom: 10px;
}

/* Red flags */
.debrief__flags {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.debrief__flag {
  display: flex;
  align-items: center;
  gap: 8px;
}

.debrief__flag-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.debrief__flag-label {
  font-size: 12px;
  color: var(--text-primary, #d4d4e0);
  flex: 1;
}

.debrief__flag-count {
  font-size: 10px;
  color: var(--text-secondary, #8888a0);
}

/* Transcript */
.debrief__transcript {
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 4px;
}

.debrief__line {
  padding: 6px 8px;
  border-radius: 4px;
}

.debrief__line--caller {
  background: var(--bg-elevated, #1a1a28);
}

.debrief__line--player {
  background: var(--mark-accent-dim, rgba(255, 170, 0, 0.08));
}

.debrief__line--system {
  text-align: center;
}

.debrief__line-sender {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
  display: block;
  margin-bottom: 2px;
}

.debrief__line--caller .debrief__line-sender { color: var(--mark-caller, #ff5722); }
.debrief__line--player .debrief__line-sender { color: var(--mark-accent, #ffaa00); }
.debrief__line--system .debrief__line-sender { color: var(--text-muted, #555570); }

.debrief__line-text {
  font-size: 12px;
  color: var(--text-primary, #d4d4e0);
  line-height: 1.5;
}

.debrief__line--system .debrief__line-text {
  font-size: 10px;
  color: var(--text-muted, #555570);
}

.debrief__line-flags {
  display: flex;
  gap: 4px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.debrief__line-flag {
  font-size: 8px;
  letter-spacing: 0.04em;
  padding: 2px 6px;
  border: 1px solid;
  border-radius: 2px;
  opacity: 0.8;
}

/* Intel report */
.debrief__intel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.debrief__intel-block {
  padding: 10px;
  background: var(--bg-panel, #0e0e16);
  border: 1px solid var(--border, #1e1e30);
  border-radius: 4px;
}

.debrief__intel-label {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--mark-accent, #ffaa00);
  display: block;
  margin-bottom: 4px;
}

.debrief__intel-text {
  font-size: 12px;
  color: var(--text-secondary, #8888a0);
  line-height: 1.6;
}

/* Actions */
.debrief__actions {
  display: flex;
  gap: 8px;
}

.debrief__btn {
  flex: 1;
  padding: 10px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  border: 1px solid var(--border, #1e1e30);
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  background: var(--bg-panel, #0e0e16);
  color: var(--text-secondary, #8888a0);
}

.debrief__btn:hover {
  border-color: var(--border-light, #2a2a42);
  color: var(--text-primary, #d4d4e0);
}

.debrief__btn--share {
  color: var(--mark-accent, #ffaa00);
  border-color: rgba(255, 170, 0, 0.2);
}

.debrief__btn--restart {
  color: var(--mark-accent, #ffaa00);
  border-color: rgba(255, 170, 0, 0.2);
}

/* Scrollbar */
.debrief__transcript::-webkit-scrollbar { width: 3px; }
.debrief__transcript::-webkit-scrollbar-track { background: transparent; }
.debrief__transcript::-webkit-scrollbar-thumb { background: var(--border, #1e1e30); border-radius: 2px; }
</style>
