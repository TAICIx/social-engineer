<script setup>
import { useRouter } from 'vue-router'
import { useOperator } from '@/composables/useOperator'
import MissionBriefing from './MissionBriefing.vue'
import PsychGauge from './PsychGauge.vue'
import TacticCard from './TacticCard.vue'
import MarkReadout from './MarkReadout.vue'
import OperationLog from './OperationLog.vue'
import OperationComplete from './OperationComplete.vue'
import '../../styles/operator.css'

const router = useRouter()

const {
  scamType,
  scamChoices,
  vulnerabilities,
  mark,
  markName,
  markEmail,
  challengeNumber,
  TOTAL_CELLS,
  MAX_ACCEL,
  CELL_TYPES,
  gamePhase,
  selectedScamIndex,
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
  opLog,
  storyText,
  storyLabel,
  responseTypeNames,
  lastMarkLine,
  currentCell,
  isOnReward,
  canCapitalize,
  tier,
  rangePreview,
  tacticRanges,
  rewardTierLabel,
  threatLevel,
  markComposure,
  selectScam,
  acceptMission,
  move,
  resolveConcern,
  resetGame,
  getShareText,
} = useOperator()

import { ref } from 'vue'
const hoveredAction = ref(null)

function handleAction(action) {
  if (action === 'resolve_concern') {
    resolveConcern()
  } else if (action === 'skip') {
    move('strong')
  } else {
    move(action)
  }
}

const tactics = [
  { key: 'strong', color: '#00ff88' },
  { key: 'soft', color: '#00d4ff' },
  { key: 'back', color: '#ff3344' },
  { key: 'accelerate', color: '#ffaa00' },
]
</script>

<template>
  <div class="operator-game scan-lines">
    <!-- Top bar -->
    <header class="op-header">
      <button class="op-header__back font-mono" @click="router.push('/')">
        &lt; BASE
      </button>
      <span class="op-header__title font-mono">THE OPERATOR</span>
      <span class="op-header__challenge font-mono">#{{ challengeNumber }}</span>
    </header>

    <!-- BRIEFING PHASE -->
    <MissionBriefing
      v-if="gamePhase === 'briefing'"
      :scam-choices="scamChoices"
      :vulnerabilities="vulnerabilities"
      :selected-index="selectedScamIndex"
      :mark="mark"
      :mark-name="markName"
      :mark-email="markEmail"
      @select="selectScam"
      @accept="acceptMission"
    />

    <!-- PLAYING PHASE -->
    <div v-else-if="gamePhase === 'playing'" class="op-playing">
      <!-- Psych Gauge -->
      <PsychGauge
        :cells="barCells"
        :position="position"
        :suspicion-line="suspicionLine"
        :total-cells="TOTAL_CELLS"
        :range-preview="rangePreview"
        :hovered-action="hoveredAction"
        :can-capitalize="canCapitalize"
        :cell-types="CELL_TYPES"
      />

      <!-- Tactical console: Mark readout + Tactic cards -->
      <div class="op-console">
        <!-- Mark Readout -->
        <MarkReadout
          :mark="mark"
          :mark-name="markName"
          :mark-email="markEmail"
          :last-line="lastMarkLine"
          :composure="markComposure"
          :threat-level="threatLevel"
          :is-hesitating="isHesitating"
          :must-resolve-concern="mustResolveConcern"
        />

        <!-- Tactic Cards -->
        <div class="op-tactics">
          <!-- Standard 4 tactics -->
          <TacticCard
            v-for="t in tactics"
            :key="t.key"
            :action="t.key"
            :name="responseTypeNames[t.key] || t.key"
            :range="tacticRanges[t.key]"
            :color="t.color"
            :disabled="mustResolveConcern || isHesitating || (t.key === 'accelerate' && accelLevel >= MAX_ACCEL)"
            :accel-level="t.key === 'accelerate' ? accelLevel : null"
            :max-accel="MAX_ACCEL"
            @execute="handleAction(t.key)"
            @hover="hoveredAction = t.key"
            @leave="hoveredAction = null"
          />

          <!-- EXTRACT button (conditional) -->
          <button
            v-if="canCapitalize"
            class="op-extract-btn font-mono"
            @click="handleAction('capitalize')"
          >
            <span class="op-extract-btn__icon">&#x25C6;</span>
            EXTRACT
            <span class="op-extract-btn__tier">{{ rewardTierLabel }}</span>
          </button>

          <!-- RESOLVE button (concern) -->
          <button
            v-if="mustResolveConcern"
            class="op-resolve-btn font-mono"
            @click="handleAction('resolve_concern')"
          >
            RESOLVE CONCERN
          </button>

          <!-- WAIT button (hesitation) -->
          <button
            v-if="isHesitating"
            class="op-wait-btn font-mono"
            @click="handleAction('skip')"
          >
            STANDBY
          </button>
        </div>
      </div>

      <!-- Round + threat indicators -->
      <div class="op-status-bar">
        <span class="op-status-bar__item font-mono">
          ROUND <span class="op-status-bar__val">{{ round }}</span>
        </span>
        <span class="op-status-bar__item font-mono">
          POS <span class="op-status-bar__val">{{ position }}/{{ TOTAL_CELLS - 1 }}</span>
        </span>
        <span class="op-status-bar__item font-mono" :class="{ 'op-status-bar__item--danger': threatLevel > 40 }">
          THREAT <span class="op-status-bar__val">{{ threatLevel }}%</span>
        </span>
        <span v-if="accelLevel > 0" class="op-status-bar__item op-status-bar__item--warning font-mono">
          PRESSURE <span class="op-status-bar__val">{{ accelLevel }}/{{ MAX_ACCEL }}</span>
        </span>
      </div>

      <!-- Operation Log -->
      <OperationLog :entries="opLog" :story-text="storyText" :story-label="storyLabel" />
    </div>

    <!-- ENDED PHASE -->
    <OperationComplete
      v-else-if="gamePhase === 'ended'"
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
      :cell-types="CELL_TYPES"
      :challenge-number="challengeNumber"
      :share-text="getShareText()"
      :threat-level="threatLevel"
      @restart="resetGame"
      @home="router.push('/')"
    />

    <!-- Footer -->
    <footer class="op-footer font-mono">
      <a href="https://scambench.com" target="_blank" rel="noopener">scambench.com</a>
    </footer>
  </div>
</template>

<style scoped>
.operator-game {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
}

/* ── Header ─────────────────────────────────────────── */
.op-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0 8px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.op-header__back {
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  font-family: inherit;
  transition: color 0.15s;
}

.op-header__back:hover {
  color: var(--accent);
}

.op-header__title {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.15em;
  color: var(--accent);
}

.op-header__challenge {
  font-size: 10px;
  color: var(--text-muted);
}

/* ── Playing layout ─────────────────────────────────── */
.op-playing {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 0;
}

/* ── Console (mark readout + tactics) ───────────────── */
.op-console {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 12px;
}

.op-tactics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

/* ── Extract button ─────────────────────────────────── */
.op-extract-btn {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: rgba(0, 255, 136, 0.08);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 4px;
  color: var(--success);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
  animation: cap-glow-op 2s ease-in-out infinite;
}

.op-extract-btn:hover {
  background: rgba(0, 255, 136, 0.15);
  border-color: var(--success);
}

.op-extract-btn__icon {
  font-size: 14px;
}

.op-extract-btn__tier {
  font-size: 10px;
  background: var(--success);
  color: #000;
  padding: 2px 6px;
  border-radius: 2px;
  font-weight: 800;
}

/* ── Resolve/Wait buttons ───────────────────────────── */
.op-resolve-btn,
.op-wait-btn {
  grid-column: 1 / -1;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.op-resolve-btn {
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #8b5cf6;
}

.op-resolve-btn:hover {
  background: rgba(139, 92, 246, 0.2);
}

.op-wait-btn {
  background: rgba(255, 170, 0, 0.08);
  border: 1px solid rgba(255, 170, 0, 0.25);
  color: var(--warning);
}

.op-wait-btn:hover {
  background: rgba(255, 170, 0, 0.15);
}

/* ── Status bar ─────────────────────────────────────── */
.op-status-bar {
  display: flex;
  gap: 16px;
  padding: 8px 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
}

.op-status-bar__item {
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.op-status-bar__val {
  color: var(--text-primary);
  font-weight: 700;
}

.op-status-bar__item--danger {
  color: var(--danger);
  animation: threat-pulse 1.5s ease-in-out infinite;
}

.op-status-bar__item--danger .op-status-bar__val {
  color: var(--danger);
}

.op-status-bar__item--warning {
  color: var(--warning);
}

.op-status-bar__item--warning .op-status-bar__val {
  color: var(--warning);
}

/* ── Footer ─────────────────────────────────────────── */
.op-footer {
  text-align: center;
  padding: 10px 0;
  font-size: 9px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.op-footer a {
  color: var(--text-muted);
  text-decoration: none;
}

.op-footer a:hover {
  color: var(--accent);
}

/* ── Responsive ─────────────────────────────────────── */
@media (max-width: 700px) {
  .op-console {
    grid-template-columns: 1fr;
  }

  .op-status-bar {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
