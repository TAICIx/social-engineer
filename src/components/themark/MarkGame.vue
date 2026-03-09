<script setup>
import { useRouter } from 'vue-router'
import { useTheMark } from '@/composables/useTheMark'
import ProfileBrief from './ProfileBrief.vue'
import MarkConversation from './MarkConversation.vue'
import ChatInput from '../thecon/ChatInput.vue'
import RedFlagSidebar from './RedFlagSidebar.vue'
import MarkDebrief from './MarkDebrief.vue'
import '../../styles/the-mark.css'

const router = useRouter()

const {
  challengeNumber,
  MAX_MESSAGE_LENGTH,
  currentLevel,
  gamePhase,
  scenario,
  difficulty,
  scamType,
  playerProfile,
  scenarioSetup,
  callerIdentity,
  maxTurns,
  callerState,
  chatLog,
  isProcessing,
  redFlags,
  redFlagSummary,
  verdict,
  gameResult,
  isGameOver,
  turnAtVerdict,
  score,
  activeIsScam,
  activeScenarioId,
  selectLevel,
  startConversation,
  sendMessage,
  makeVerdict,
  resetGame,
  getShareText,
} = useTheMark()
</script>

<template>
  <div class="mark-game scan-lines">
    <!-- Header -->
    <header class="mark-header">
      <button class="mark-header__back font-mono" @click="router.push('/')">
        &lt; BASE
      </button>
      <span class="mark-header__title font-mono">THE MARK</span>
      <span class="mark-header__challenge font-mono">#{{ challengeNumber }}</span>
    </header>

    <!-- BRIEFING -->
    <ProfileBrief
      v-if="gamePhase === 'briefing'"
      :player-profile="playerProfile"
      :scenario-setup="scenarioSetup"
      :current-level="currentLevel"
      :difficulty="difficulty"
      @select-level="selectLevel"
      @start="startConversation"
    />

    <!-- CONVERSATION -->
    <div v-else-if="gamePhase === 'conversation'" class="mark-playing">
      <!-- Status bar -->
      <div class="mark-status">
        <span class="mark-status__item font-mono">
          TURN {{ callerState.turnNumber }}/{{ maxTurns }}
        </span>
        <span class="mark-status__item font-mono" :style="{ color: redFlagSummary.length > 0 ? '#ff3344' : '#555570' }">
          RED FLAGS: {{ redFlagSummary.length }}
        </span>
        <span class="mark-status__item font-mono">
          LVL {{ currentLevel }}
        </span>
      </div>

      <!-- Main layout: chat + sidebar -->
      <div class="mark-layout">
        <MarkConversation
          :chat-log="chatLog"
          :is-processing="isProcessing"
          :caller-identity="callerIdentity"
        />
        <RedFlagSidebar
          :red-flag-summary="redFlagSummary"
          :red-flags="redFlags"
          :turn-number="callerState.turnNumber"
        />
      </div>

      <!-- Input + verdict buttons -->
      <div class="mark-actions">
        <ChatInput
          :disabled="isProcessing || isGameOver"
          :mark-name="callerIdentity"
          :max-length="MAX_MESSAGE_LENGTH"
          @send="sendMessage"
        />
        <div class="mark-verdict">
          <button
            class="mark-verdict__btn mark-verdict__btn--scam font-mono"
            :disabled="isGameOver"
            @click="makeVerdict('scam')"
          >
            THIS IS A SCAM
          </button>
          <button
            class="mark-verdict__btn mark-verdict__btn--trust font-mono"
            :disabled="isGameOver"
            @click="makeVerdict('trust')"
          >
            I TRUST THIS
          </button>
        </div>
      </div>
    </div>

    <!-- DEBRIEF -->
    <MarkDebrief
      v-else-if="gamePhase === 'debrief'"
      :game-result="gameResult"
      :was-scam="activeIsScam"
      :scenario-id="activeScenarioId"
      :scam-type="scamType"
      :caller-identity="callerIdentity"
      :turn-at-verdict="turnAtVerdict"
      :score="score"
      :current-level="currentLevel"
      :chat-log="chatLog"
      :red-flag-summary="redFlagSummary"
      :share-text="getShareText()"
      @restart="resetGame"
      @home="router.push('/')"
    />

    <!-- Footer -->
    <footer class="mark-footer font-mono">
      <a href="https://scambench.com" target="_blank" rel="noopener">scambench.com</a>
    </footer>
  </div>
</template>

<style scoped>
.mark-game {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
}

.mark-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0 8px;
  border-bottom: 1px solid var(--border, #1e1e30);
  flex-shrink: 0;
}

.mark-header__back {
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--text-muted, #555570);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  font-family: inherit;
  transition: color 0.15s;
}

.mark-header__back:hover {
  color: var(--mark-accent, #ffaa00);
}

.mark-header__title {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.15em;
  color: var(--mark-accent, #ffaa00);
}

.mark-header__challenge {
  font-size: 10px;
  color: var(--text-muted, #555570);
}

/* Playing layout */
.mark-playing {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 0;
}

.mark-status {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 6px 10px;
  background: var(--bg-card, #12121c);
  border: 1px solid var(--border, #1e1e30);
  border-radius: 4px;
}

.mark-status__item {
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--text-muted, #555570);
}

.mark-layout {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 10px;
  flex: 1;
  min-height: 0;
}

.mark-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mark-verdict {
  display: flex;
  gap: 8px;
}

.mark-verdict__btn {
  flex: 1;
  padding: 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  border: 1px solid;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.mark-verdict__btn--scam {
  background: var(--mark-danger-dim, rgba(255, 51, 68, 0.12));
  border-color: rgba(255, 51, 68, 0.3);
  color: var(--mark-danger, #ff3344);
}

.mark-verdict__btn--scam:hover:not(:disabled) {
  background: rgba(255, 51, 68, 0.2);
  border-color: var(--mark-danger, #ff3344);
}

.mark-verdict__btn--trust {
  background: var(--mark-safe-dim, rgba(0, 255, 136, 0.12));
  border-color: rgba(0, 255, 136, 0.3);
  color: var(--mark-safe, #00ff88);
}

.mark-verdict__btn--trust:hover:not(:disabled) {
  background: rgba(0, 255, 136, 0.2);
  border-color: var(--mark-safe, #00ff88);
}

.mark-verdict__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Footer */
.mark-footer {
  text-align: center;
  padding: 10px 0;
  font-size: 9px;
  color: var(--text-muted, #555570);
  flex-shrink: 0;
}

.mark-footer a {
  color: var(--text-muted, #555570);
  text-decoration: none;
}

.mark-footer a:hover {
  color: var(--mark-accent, #ffaa00);
}

@media (max-width: 700px) {
  .mark-layout {
    grid-template-columns: 1fr;
  }
}
</style>
