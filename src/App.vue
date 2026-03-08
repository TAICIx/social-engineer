<script setup>
import { ref } from 'vue'
import { RESPONSE_EMOTES } from '@/data/scenarios'
import { useSocialEngineer } from '@/composables/useSocialEngineer'
import ProgressBar from '@/components/ProgressBar.vue'
import ActionButtons from '@/components/ActionButtons.vue'
import StatusBar from '@/components/StatusBar.vue'
import CellLegend from '@/components/CellLegend.vue'
import MarkBubble from '@/components/MarkBubble.vue'
import EndScreen from '@/components/EndScreen.vue'

const {
  scamType,
  mark,
  markName,
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
  markReaction,
  capitalizeValue,
  canCapitalize,
  tier,
  startGame,
  move,
  resolveConcern,
  getShareText,
} = useSocialEngineer()

// Emotes for this scam type
const emotes = RESPONSE_EMOTES[scamType.id]

// Track what the player last "said" for the dialogue back-and-forth
const playerLastLine = ref('')

function handleAction(action) {
  // Show what the player "said" before the mark reacts
  if (emotes && action !== 'resolve_concern' && action !== 'skip') {
    const key = action === 'accelerate' ? 'accel' : action === 'capitalize' ? 'cap' : action
    if (emotes[key]) {
      playerLastLine.value = emotes[key].desc
    }
  }

  if (action === 'resolve_concern') {
    playerLastLine.value = 'Let me explain, this is completely legitimate...'
    resolveConcern()
  } else if (action === 'skip') {
    playerLastLine.value = ''
    move('strong')
  } else {
    move(action)
  }
}
</script>

<template>
  <div class="app-container">
    <!-- Header -->
    <header class="app-header">
      <h1 class="app-header__title">Social Engineer</h1>
      <p class="app-header__sub font-mono">#{{ challengeNumber }}</p>
    </header>

    <!-- ═══ START SCREEN ═══ -->
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
          <span class="start-screen__mark-demo">{{ mark.label }}</span>
          <span class="start-screen__mark-rate font-mono">
            Concern resist: {{ Math.round(mark.concernSuccessRate * 100) }}%
          </span>
        </div>

        <div class="start-screen__divider"></div>

        <CellLegend />

        <p class="start-screen__instructions">
          Navigate the persuasion bar by choosing emotional responses.
          Each response moves your position — land on a reward zone and capitalize to win.
          Watch out for the mark's concerns, hesitation, and suspicion that closes in after round 4.
        </p>

        <button class="start-screen__btn" @click="startGame">
          Begin Scam
        </button>
      </div>
    </div>

    <!-- ═══ PLAYING SCREEN ═══ -->
    <div v-else-if="gamePhase === 'playing'" class="play-screen">
      <StatusBar
        :round="round"
        :accel-level="accelLevel"
        :max-accel="MAX_ACCEL"
        :scam-type="scamType"
        :mark="mark"
        :mark-name="markName"
        :suspicion-line="suspicionLine"
        :tier="tier"
      />

      <!-- Dialogue: Player said → Mark reacts -->
      <div v-if="playerLastLine" class="player-bubble">
        <div class="player-bubble__content">
          <p class="player-bubble__text">"{{ playerLastLine }}"</p>
          <span class="player-bubble__label">You</span>
        </div>
      </div>

      <MarkBubble
        :mark="mark"
        :mark-name="markName"
        :reaction="markReaction"
      />

      <ProgressBar
        :cells="barCells"
        :position="position"
        :suspicion-line="suspicionLine"
      />

      <CellLegend />

      <ActionButtons
        :can-capitalize="canCapitalize"
        :is-hesitating="isHesitating"
        :must-resolve-concern="mustResolveConcern"
        :accel-level="accelLevel"
        :max-accel="MAX_ACCEL"
        :emotes="emotes"
        @action="handleAction"
      />

      <!-- Suspicion warning -->
      <div v-if="suspicionLine > 0" class="suspicion-warning">
        Suspicion is rising! {{ suspicionLine }} cells consumed from the left.
      </div>
    </div>

    <!-- ═══ END SCREEN ═══ -->
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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
}

/* ── Header ── */
.app-header {
  text-align: center;
  padding: 24px 0 8px;
}

.app-header__title {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.app-header__sub {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

/* ── Start Screen ── */
.start-screen {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
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

.start-screen__scam-emoji {
  font-size: 40px;
}

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

/* ── Play Screen ── */
.play-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 12px 0 24px;
}

.suspicion-warning {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-red-light);
  background: rgba(185, 28, 28, 0.1);
  border: 1px solid rgba(185, 28, 28, 0.2);
  border-radius: 6px;
  padding: 8px 16px;
  max-width: 680px;
  margin: 0 auto;
  animation: pulse-red 2s ease-in-out infinite;
}

@keyframes pulse-red {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

/* ── Player dialogue bubble ── */
.player-bubble {
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
}

.player-bubble__content {
  background: rgba(110, 143, 112, 0.15);
  border: 1px solid rgba(110, 143, 112, 0.3);
  border-radius: 12px;
  border-bottom-right-radius: 4px;
  padding: 8px 14px;
  max-width: 80%;
  animation: bubble-in 0.3s ease-out;
}

@keyframes bubble-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.player-bubble__text {
  font-size: 13px;
  color: var(--accent-green-light);
  font-style: italic;
  line-height: 1.4;
}

.player-bubble__label {
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  text-align: right;
  margin-top: 2px;
}

/* ── End Phase ── */
.end-phase {
  flex: 1;
  padding: 20px 0;
}

/* ── Footer ── */
.app-footer {
  text-align: center;
  padding: 20px 0;
  font-size: 12px;
  color: var(--text-muted);
}

.app-footer a {
  color: var(--accent-green-light);
  text-decoration: none;
}

.app-footer a:hover {
  text-decoration: underline;
}
</style>
