<script setup>
import { ref } from 'vue'
import { useSocialEngineer } from '@/composables/useSocialEngineer'
import ProgressBar from '@/components/ProgressBar.vue'
import ActionButtons from '@/components/ActionButtons.vue'
import StatusBar from '@/components/StatusBar.vue'
import CellLegend from '@/components/CellLegend.vue'
import ChatLog from '@/components/ChatLog.vue'
import EndScreen from '@/components/EndScreen.vue'

const {
  scamType,
  mark,
  markName,
  markEmail,
  challengeNumber,
  TOTAL_CELLS,
  MAX_ACCEL,
  gamePhase,
  barCells,
  position,
  round,
  accelerationStacks,
  accelLevel,
  isHesitating,
  mustResolveConcern,
  suspicionLine,
  moveHistory,
  won,
  endReason,
  capitalizeValue,
  canCapitalize,
  tier,
  rangePreview,
  rewardTierLabel,
  chatLog,
  startGame,
  move,
  resolveConcern,
  resetGame,
  getShareText,
} = useSocialEngineer()

const hoveredAction = ref(null)
const showLegend = ref(false)

function handleRestart() {
  resetGame()
}

function handleAction(action) {
  if (action === 'resolve_concern') {
    resolveConcern()
  } else if (action === 'skip') {
    move('strong')
  } else {
    move(action)
  }
}

function handleHover(action) {
  hoveredAction.value = action
}
</script>

<template>
  <div class="app-container">
    <!-- Header -->
    <header class="app-header">
      <h1 class="app-header__title">Social Engineer</h1>
      <p class="app-header__sub font-mono">#{{ challengeNumber }}</p>
    </header>

    <!-- START SCREEN -->
    <div v-if="gamePhase === 'start'" class="start-screen">
      <div class="start-screen__card">
        <div class="start-screen__scam-badge">
          <span class="start-screen__scam-emoji">{{ scamType.emoji }}</span>
          <span class="start-screen__scam-tier font-mono">TIER {{ scamType.tier }}</span>
        </div>
        <h2 class="start-screen__scam-name">{{ scamType.name }}</h2>
        <p class="start-screen__opening">"{{ scamType.openingLine }}"</p>

        <div class="start-screen__divider"></div>

        <div class="start-screen__mark">
          <span class="start-screen__mark-label">Your Mark</span>
          <span class="start-screen__mark-emoji">{{ mark.emoji }}</span>
          <span class="start-screen__mark-name">{{ markName }}</span>
          <span class="start-screen__mark-email font-mono">{{ markEmail }}</span>
          <span class="start-screen__mark-demo">{{ mark.label }}</span>
          <span class="start-screen__mark-rate font-mono">
            Concern resist: {{ Math.round(mark.concernSuccessRate * 100) }}%
          </span>
        </div>

        <div class="start-screen__divider"></div>

        <p class="start-screen__instructions">
          Navigate the persuasion bar by choosing emotional responses.
          Each response moves your position — land on a reward zone and capitalize to win.
          Watch out for concerns, hesitation, and suspicion that closes in after round 4.
        </p>

        <button class="start-screen__btn" @click="startGame">
          Begin Scam
        </button>
      </div>
    </div>

    <!-- PLAYING SCREEN -->
    <div v-else-if="gamePhase === 'playing'" class="play-screen">
      <StatusBar
        :scam-type="scamType"
        :mark="mark"
        :mark-email="markEmail"
        :accel-level="accelLevel"
        :max-accel="MAX_ACCEL"
        @toggle-legend="showLegend = !showLegend"
      />

      <!-- Chat conversation — takes up the bulk of the screen -->
      <ChatLog
        :messages="chatLog"
        :mark-emoji="mark.emoji"
        :mark-name="markName"
      />

      <!-- Suspicion warning -->
      <div v-if="suspicionLine > 0" class="suspicion-warning">
        Suspicion rising — {{ suspicionLine }}/50 cells consumed
      </div>

      <!-- Progress bar -->
      <ProgressBar
        :cells="barCells"
        :position="position"
        :suspicion-line="suspicionLine"
        :range-preview="rangePreview"
        :hovered-action="hoveredAction"
        :is-hesitating="isHesitating"
        :must-resolve-concern="mustResolveConcern"
      />

      <!-- Action buttons -->
      <ActionButtons
        :can-capitalize="canCapitalize"
        :is-hesitating="isHesitating"
        :must-resolve-concern="mustResolveConcern"
        :accel-level="accelLevel"
        :max-accel="MAX_ACCEL"
        :round="round"
        :reward-tier-label="rewardTierLabel"
        @action="handleAction"
        @hover="handleHover"
      />

      <CellLegend :visible="showLegend" @close="showLegend = false" />
    </div>

    <!-- END SCREEN -->
    <div v-else-if="gamePhase === 'ended'" class="end-phase">
      <EndScreen
        :won="won"
        :end-reason="endReason"
        :capitalize-value="capitalizeValue"
        :round="round"
        :position="position"
        :scam-type="scamType"
        :mark="mark"
        :mark-name="markName"
        :move-history="moveHistory"
        :bar-cells="barCells"
        :challenge-number="challengeNumber"
        :share-text="getShareText()"
        @restart="handleRestart"
      />
    </div>

    <!-- Footer -->
    <footer class="app-footer">
      <p>An educational game by <a href="https://scambench.com" target="_blank" rel="noopener">ScamBench</a></p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  overflow: hidden;
}

/* Header */
.app-header {
  text-align: center;
  padding: 12px 0 6px;
  flex-shrink: 0;
}

.app-header__title {
  font-size: 22px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.app-header__sub {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 1px;
}

/* Start Screen */
.start-screen {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  overflow-y: auto;
}

.start-screen__card {
  max-width: 480px;
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px 28px;
  text-align: center;
}

.start-screen__scam-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px;
}

.start-screen__scam-emoji { font-size: 40px; }

.start-screen__scam-tier {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  background: var(--bg-elevated);
  padding: 3px 10px;
  border-radius: 4px;
  letter-spacing: 0.06em;
}

.start-screen__scam-name {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.start-screen__opening {
  font-size: 14px;
  font-style: italic;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 4px;
}

.start-screen__divider {
  height: 1px;
  background: var(--border);
  margin: 18px 0;
}

.start-screen__mark {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.start-screen__mark-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  font-weight: 700;
}

.start-screen__mark-emoji { font-size: 32px; }

.start-screen__mark-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.start-screen__mark-email {
  font-size: 12px;
  color: var(--text-secondary);
}

.start-screen__mark-demo {
  font-size: 13px;
  color: var(--text-secondary);
}

.start-screen__mark-rate {
  font-size: 11px;
  color: var(--text-muted);
}

.start-screen__instructions {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 18px 0 20px;
}

.start-screen__btn {
  padding: 14px 40px;
  background: var(--accent-green);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  letter-spacing: 0.02em;
}

.start-screen__btn:hover {
  background: var(--accent-green-light);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(110, 143, 112, 0.4);
}

/* Play Screen — full height chat-app layout */
.play-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 6px 0 10px;
  min-height: 0;
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
}

/* Suspicion warning */
.suspicion-warning {
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: var(--accent-red-light);
  background: rgba(185, 28, 28, 0.1);
  border: 1px solid rgba(185, 28, 28, 0.2);
  border-radius: 6px;
  padding: 5px 12px;
  flex-shrink: 0;
  animation: pulse-red 2s ease-in-out infinite;
}

@keyframes pulse-red {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

/* End Phase */
.end-phase {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

/* Footer */
.app-footer {
  text-align: center;
  padding: 8px 0;
  font-size: 11px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.app-footer a {
  color: var(--accent-green-light);
  text-decoration: none;
}

.app-footer a:hover {
  text-decoration: underline;
}
</style>
