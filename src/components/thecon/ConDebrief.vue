<script setup>
import { ref } from 'vue'
import { PRINCIPLES, PRINCIPLE_IDS } from '@/data/cialdini'

const props = defineProps({
  won: { type: Boolean, required: true },
  gameResult: { type: String, required: true },
  scamType: { type: Object, required: true },
  markName: { type: String, required: true },
  turnNumber: { type: Number, required: true },
  resistance: { type: Number, required: true },
  suspicion: { type: Number, required: true },
  chatLog: { type: Array, required: true },
  principleUsageMap: { type: Object, required: true },
  dominantStrategy: { type: String, default: null },
  currentLevel: { type: Number, required: true },
  shareText: { type: String, required: true },
})

const emit = defineEmits(['restart', 'home'])

const copied = ref(false)

const resultTitle = props.won ? 'MARK COMPROMISED' : 'OPERATION FAILED'
const resultClass = props.won ? 'result--success' : 'result--failure'

const resultReasons = {
  success: 'The mark fell for the scam. They handed over what you asked for.',
  reported: 'The mark grew too suspicious and ended the conversation.',
  timeout: 'You ran out of turns. The mark lost interest and walked away.',
  busted: 'The mark saw through your approach.',
}

// Used principles for counter-tactics section
const usedPrinciples = PRINCIPLE_IDS.filter(
  pid => (props.principleUsageMap[pid]?.count || 0) > 0
)

async function copyShare() {
  try {
    await navigator.clipboard.writeText(props.shareText)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = props.shareText
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>

<template>
  <div class="debrief">
    <!-- Result header -->
    <div class="debrief-header" :class="resultClass">
      <span class="debrief-header__badge font-mono">{{ won ? 'SUCCESS' : 'FAILURE' }}</span>
      <h2 class="debrief-header__title font-mono">{{ resultTitle }}</h2>
      <p class="debrief-header__reason">{{ resultReasons[gameResult] || gameResult }}</p>

      <div class="debrief-stats">
        <div class="debrief-stat">
          <span class="debrief-stat__val font-mono">{{ turnNumber }}</span>
          <span class="debrief-stat__label font-mono">TURNS</span>
        </div>
        <div class="debrief-stat">
          <span class="debrief-stat__val font-mono">{{ resistance }}%</span>
          <span class="debrief-stat__label font-mono">FINAL RESIST</span>
        </div>
        <div class="debrief-stat">
          <span class="debrief-stat__val font-mono">{{ suspicion }}</span>
          <span class="debrief-stat__label font-mono">SUSPICION</span>
        </div>
        <div class="debrief-stat">
          <span class="debrief-stat__val font-mono">LV{{ currentLevel }}</span>
          <span class="debrief-stat__label font-mono">DIFFICULTY</span>
        </div>
      </div>
    </div>

    <!-- Annotated transcript -->
    <div class="debrief-section">
      <h3 class="debrief-section__title font-mono">ANNOTATED TRANSCRIPT</h3>
      <div class="transcript">
        <div
          v-for="(msg, i) in chatLog"
          :key="i"
          class="transcript-msg"
          :class="{
            'transcript-msg--player': msg.sender === 'player',
            'transcript-msg--mark': msg.sender === 'mark',
            'transcript-msg--system': msg.sender === 'system',
          }"
        >
          <div class="transcript-msg__header">
            <span class="transcript-msg__sender font-mono">
              {{ msg.sender === 'player' ? 'YOU' : msg.sender === 'mark' ? markName.toUpperCase() : 'SYS' }}
            </span>
            <div v-if="msg.analysis?.detectedPrinciples?.length" class="transcript-msg__principles">
              <span
                v-for="p in msg.analysis.detectedPrinciples"
                :key="p.id"
                class="transcript-principle font-mono"
                :style="{ color: p.color, borderColor: p.color }"
              >
                {{ p.name }}
              </span>
            </div>
          </div>
          <p class="transcript-msg__text">{{ msg.text }}</p>
        </div>
      </div>
    </div>

    <!-- Persuasion profile -->
    <div v-if="dominantStrategy" class="debrief-section">
      <h3 class="debrief-section__title font-mono">PERSUASION PROFILE</h3>
      <p class="debrief-dominant">
        Dominant strategy:
        <span :style="{ color: PRINCIPLES[dominantStrategy]?.color }">
          {{ PRINCIPLES[dominantStrategy]?.name }}
        </span>
        (used {{ principleUsageMap[dominantStrategy]?.count || 0 }} times)
      </p>
      <div class="profile-bars">
        <div v-for="pid in PRINCIPLE_IDS" :key="pid" class="profile-bar">
          <span class="profile-bar__name">{{ PRINCIPLES[pid].name }}</span>
          <div class="profile-bar__track">
            <div
              class="profile-bar__fill"
              :style="{
                width: Math.min((principleUsageMap[pid]?.count || 0) * 15, 100) + '%',
                background: PRINCIPLES[pid].color,
              }"
            ></div>
          </div>
          <span class="profile-bar__count font-mono">{{ principleUsageMap[pid]?.count || 0 }}</span>
        </div>
      </div>
    </div>

    <!-- Intel report (scam debrief) -->
    <div class="debrief-section">
      <h3 class="debrief-section__title font-mono">INTEL REPORT: {{ scamType.name.toUpperCase() }}</h3>
      <div class="intel-grid">
        <div class="intel-item">
          <h4 class="intel-item__title font-mono">METHODOLOGY</h4>
          <p>{{ scamType.debrief.howItWorks }}</p>
        </div>
        <div class="intel-item">
          <h4 class="intel-item__title font-mono">PSYCHOLOGICAL EXPLOITATION</h4>
          <p>{{ scamType.debrief.whyItWorks }}</p>
        </div>
        <div class="intel-item">
          <h4 class="intel-item__title font-mono">COUNTERMEASURES</h4>
          <p>{{ scamType.debrief.howToSpot }}</p>
        </div>
      </div>
    </div>

    <!-- Counter-tactics (educational) -->
    <div v-if="usedPrinciples.length" class="debrief-section">
      <h3 class="debrief-section__title font-mono">HOW TO RESIST THESE TACTICS</h3>
      <div class="counter-list">
        <div v-for="pid in usedPrinciples" :key="pid" class="counter-item">
          <div class="counter-item__header">
            <span class="counter-item__dot" :style="{ background: PRINCIPLES[pid].color }"></span>
            <span class="counter-item__name">{{ PRINCIPLES[pid].name }}</span>
          </div>
          <ul class="counter-item__tactics">
            <li v-for="(tactic, j) in PRINCIPLES[pid].counterTactics" :key="j">{{ tactic }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="debrief-actions">
      <button class="debrief-btn debrief-btn--share font-mono" @click="copyShare">
        {{ copied ? 'COPIED' : 'SHARE INTEL' }}
      </button>
      <button class="debrief-btn debrief-btn--restart font-mono" @click="emit('restart')">
        NEW TARGET
      </button>
      <button class="debrief-btn debrief-btn--home font-mono" @click="emit('home')">
        RETURN TO BASE
      </button>
    </div>
  </div>
</template>

<style scoped>
.debrief {
  flex: 1;
  max-width: 720px;
  margin: 0 auto;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

/* Result header */
.debrief-header {
  text-align: center;
  padding: 24px 20px;
  border-radius: 6px;
  border: 1px solid var(--border, #1e1e30);
}

.result--success {
  background: linear-gradient(135deg, rgba(0, 188, 212, 0.06), rgba(0, 188, 212, 0.02));
  border-color: rgba(0, 188, 212, 0.2);
}

.result--failure {
  background: linear-gradient(135deg, rgba(255, 51, 68, 0.06), rgba(255, 51, 68, 0.02));
  border-color: rgba(255, 51, 68, 0.2);
}

.debrief-header__badge {
  display: inline-block;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
  padding: 3px 10px;
  border-radius: 2px;
  margin-bottom: 10px;
}

.result--success .debrief-header__badge {
  color: var(--accent, #00bcd4);
  background: rgba(0, 188, 212, 0.1);
  border: 1px solid rgba(0, 188, 212, 0.2);
}

.result--failure .debrief-header__badge {
  color: var(--danger, #ff3344);
  background: rgba(255, 51, 68, 0.1);
  border: 1px solid rgba(255, 51, 68, 0.2);
}

.debrief-header__title {
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}

.result--success .debrief-header__title { color: var(--accent, #00bcd4); }
.result--failure .debrief-header__title { color: var(--danger, #ff3344); }

.debrief-header__reason {
  font-size: 12px;
  color: var(--text-secondary, #8888a0);
  margin-bottom: 18px;
  line-height: 1.5;
}

.debrief-stats {
  display: flex;
  justify-content: center;
  gap: 28px;
}

.debrief-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.debrief-stat__val {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary, #d4d4e0);
}

.debrief-stat__label {
  font-size: 8px;
  letter-spacing: 0.1em;
  color: var(--text-muted, #555570);
}

/* Sections */
.debrief-section {
  background: var(--bg-card, #12121c);
  border: 1px solid var(--border, #1e1e30);
  border-radius: 4px;
  padding: 16px;
}

.debrief-section__title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-muted, #555570);
  margin-bottom: 12px;
}

/* Transcript */
.transcript {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}

.transcript::-webkit-scrollbar { width: 3px; }
.transcript::-webkit-scrollbar-thumb { background: var(--border, #1e1e30); border-radius: 2px; }

.transcript-msg {
  padding: 6px 10px;
  border-radius: 4px;
  background: var(--bg-panel, #0e0e16);
}

.transcript-msg--system {
  text-align: center;
  background: transparent;
}

.transcript-msg__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 3px;
}

.transcript-msg__sender {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.transcript-msg--player .transcript-msg__sender { color: var(--accent, #00bcd4); }
.transcript-msg--mark .transcript-msg__sender { color: var(--text-muted, #555570); }
.transcript-msg--system .transcript-msg__sender { color: var(--warning, #ffaa00); }

.transcript-msg__text {
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-secondary, #8888a0);
}

.transcript-msg--player .transcript-msg__text { color: var(--accent, #00bcd4); opacity: 0.8; }
.transcript-msg--system .transcript-msg__text { font-style: italic; font-size: 10px; color: var(--text-muted, #555570); }

.transcript-msg__principles {
  display: flex;
  gap: 4px;
}

.transcript-principle {
  font-size: 8px;
  letter-spacing: 0.04em;
  padding: 1px 5px;
  border: 1px solid;
  border-radius: 2px;
}

/* Persuasion profile */
.debrief-dominant {
  font-size: 12px;
  color: var(--text-secondary, #8888a0);
  margin-bottom: 12px;
}

.debrief-dominant span {
  font-weight: 700;
}

.profile-bars {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.profile-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-bar__name {
  font-size: 10px;
  color: var(--text-secondary, #8888a0);
  width: 85px;
  flex-shrink: 0;
}

.profile-bar__track {
  flex: 1;
  height: 4px;
  background: var(--bg-elevated, #1a1a28);
  border-radius: 2px;
  overflow: hidden;
}

.profile-bar__fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.4s ease;
}

.profile-bar__count {
  font-size: 9px;
  color: var(--text-muted, #555570);
  width: 16px;
  text-align: right;
}

/* Intel report */
.intel-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.intel-item__title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--accent, #00bcd4);
  margin-bottom: 4px;
}

.intel-item p {
  font-size: 12px;
  line-height: 1.7;
  color: var(--text-secondary, #8888a0);
}

/* Counter tactics */
.counter-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.counter-item__header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.counter-item__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.counter-item__name {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary, #d4d4e0);
}

.counter-item__tactics {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 14px;
}

.counter-item__tactics li {
  font-size: 11px;
  color: var(--text-secondary, #8888a0);
  line-height: 1.5;
  position: relative;
  padding-left: 10px;
}

.counter-item__tactics li::before {
  content: '>';
  position: absolute;
  left: 0;
  color: var(--text-muted, #555570);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
}

/* Actions */
.debrief-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.debrief-btn {
  padding: 10px 24px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.debrief-btn--share {
  background: rgba(0, 188, 212, 0.1);
  border: 1px solid rgba(0, 188, 212, 0.3);
  color: var(--accent, #00bcd4);
}

.debrief-btn--share:hover { background: rgba(0, 188, 212, 0.18); }

.debrief-btn--restart {
  background: rgba(0, 255, 136, 0.08);
  border: 1px solid rgba(0, 255, 136, 0.25);
  color: var(--success, #00ff88);
}

.debrief-btn--restart:hover { background: rgba(0, 255, 136, 0.15); }

.debrief-btn--home {
  background: none;
  border: 1px solid var(--border, #1e1e30);
  color: var(--text-muted, #555570);
}

.debrief-btn--home:hover { border-color: var(--border-light, #2a2a42); color: var(--text-secondary, #8888a0); }
</style>
