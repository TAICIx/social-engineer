<script setup>
import { useRouter } from 'vue-router'
import { useTheCon } from '@/composables/useTheCon'
import TargetAcquired from './TargetAcquired.vue'
import ConversationView from './ConversationView.vue'
import ChatInput from './ChatInput.vue'
import TacticSidebar from './TacticSidebar.vue'
import ResistanceMeter from './ResistanceMeter.vue'
import ConDebrief from './ConDebrief.vue'
import '../../styles/the-con.css'

const router = useRouter()

const {
  challengeNumber,
  mark,
  markName,
  MAX_MESSAGE_LENGTH,
  currentLevel,
  selectedScamId,
  availableScams,
  selectedScam,
  scamContext,
  personality,
  levelConfig,
  maxTurns,
  suspicionThreshold,
  gamePhase,
  markState,
  resistancePercent,
  suspicionPercent,
  emotionDisplay,
  chatLog,
  isProcessing,
  lastAnalysis,
  principleUsageMap,
  dominantStrategy,
  annotatedTranscript,
  selectLevel,
  selectScam,
  startConversation,
  sendMessage,
  resetGame,
  getShareText,
} = useTheCon()
</script>

<template>
  <div class="con-game scan-lines">
    <!-- Header -->
    <header class="con-header">
      <button class="con-header__back font-mono" @click="router.push('/')">
        &lt; BASE
      </button>
      <span class="con-header__title font-mono">THE CON</span>
      <span class="con-header__challenge font-mono">#{{ challengeNumber }}</span>
    </header>

    <!-- TARGET ACQUIRED -->
    <TargetAcquired
      v-if="gamePhase === 'target_acquired'"
      :available-scams="availableScams"
      :mark="mark"
      :mark-name="markName"
      :current-level="currentLevel"
      :selected-scam-id="selectedScamId"
      @select-level="selectLevel"
      @select-scam="selectScam"
      @start="startConversation"
    />

    <!-- CONVERSATION -->
    <div v-else-if="gamePhase === 'conversation'" class="con-playing">
      <!-- Meters -->
      <ResistanceMeter
        :resistance="markState.resistance"
        :suspicion="markState.suspicion"
        :suspicion-threshold="suspicionThreshold"
        :rapport="markState.rapport"
        :emotional-state="markState.emotionalState"
        :turn-number="markState.turnNumber"
        :max-turns="maxTurns"
      />

      <!-- Main layout: chat + sidebar -->
      <div class="con-layout">
        <ConversationView
          :chat-log="chatLog"
          :is-processing="isProcessing"
          :mark-name="markName"
        />
        <TacticSidebar
          :last-analysis="lastAnalysis"
          :principle-usage-map="principleUsageMap"
          :emotional-state="markState.emotionalState"
          :rapport="markState.rapport"
        />
      </div>

      <!-- Input -->
      <ChatInput
        :disabled="isProcessing || markState.isGameOver"
        :mark-name="markName"
        :max-length="MAX_MESSAGE_LENGTH"
        @send="sendMessage"
      />
    </div>

    <!-- DEBRIEF -->
    <ConDebrief
      v-else-if="gamePhase === 'debrief'"
      :won="markState.gameResult === 'success'"
      :game-result="markState.gameResult"
      :scam-type="selectedScam"
      :mark-name="markName"
      :turn-number="markState.turnNumber"
      :resistance="Math.round(markState.resistance)"
      :suspicion="Math.round(markState.suspicion)"
      :chat-log="chatLog"
      :principle-usage-map="principleUsageMap"
      :dominant-strategy="dominantStrategy"
      :current-level="currentLevel"
      :share-text="getShareText()"
      @restart="resetGame"
      @home="router.push('/')"
    />

    <!-- Footer -->
    <footer class="con-footer font-mono">
      <a href="https://scambench.com" target="_blank" rel="noopener">scambench.com</a>
    </footer>
  </div>
</template>

<style scoped>
.con-game {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
}

/* Header */
.con-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0 8px;
  border-bottom: 1px solid var(--border, #1e1e30);
  flex-shrink: 0;
}

.con-header__back {
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

.con-header__back:hover {
  color: var(--accent, #00bcd4);
}

.con-header__title {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.15em;
  color: var(--accent, #00bcd4);
}

.con-header__challenge {
  font-size: 10px;
  color: var(--text-muted, #555570);
}

/* Playing layout */
.con-playing {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 0;
}

.con-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 10px;
  flex: 1;
  min-height: 0;
}

/* Footer */
.con-footer {
  text-align: center;
  padding: 10px 0;
  font-size: 9px;
  color: var(--text-muted, #555570);
  flex-shrink: 0;
}

.con-footer a {
  color: var(--text-muted, #555570);
  text-decoration: none;
}

.con-footer a:hover {
  color: var(--accent, #00bcd4);
}

@media (max-width: 700px) {
  .con-layout {
    grid-template-columns: 1fr;
  }
}
</style>
