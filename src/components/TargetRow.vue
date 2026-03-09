<script setup>
import { computed } from 'vue'
import { CELL_TYPES, ACTION_EMOJIS } from '@/data/scenarios'

const props = defineProps({
  cells: { type: Array, required: true },
  position: { type: Number, required: true },
  suspicionLine: { type: Number, default: 0 },
  rangePreview: { type: Object, default: () => ({}) },
  hoveredAction: { type: String, default: null },
  isHesitating: { type: Boolean, default: false },
  mustResolveConcern: { type: Boolean, default: false },
  canCapitalize: { type: Boolean, default: false },
  accelLevel: { type: Number, default: 0 },
  maxAccel: { type: Number, default: 5 },
  round: { type: Number, default: 0 },
  rewardTierLabel: { type: String, default: '' },
  scamType: { type: Object, required: true },
  mark: { type: Object, required: true },
  markEmail: { type: String, required: true },
  responseTypeNames: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['action', 'hover', 'toggleLegend'])

const actions = ['strong', 'soft', 'back', 'accelerate', 'capitalize']

function doAction(action) {
  emit('action', action)
}

function onHover(action) {
  emit('hover', action)
}

function onLeave() {
  emit('hover', null)
}

// Cell pattern class
function cellPatternClass(type) {
  if (type === 'temptation') return 'cell--temptation-pattern'
  if (type === 'sensitivity') return 'cell--sensitivity-pattern'
  if (type === 'hesitation') return 'cell--hesitation-pattern'
  if (type === 'concern') return 'cell--concern-pattern'
  if (type === 'suspicion') return 'cell--suspicion-pulse'
  return ''
}

// Range overlay for a cell
function rangeOverlayStyle(index) {
  const rp = props.rangePreview
  if (!rp || Object.keys(rp).length === 0) return null

  const hovered = props.hoveredAction
  const rangeColors = {
    back: 'var(--range-back)',
    soft: 'var(--range-soft)',
    strong: 'var(--range-strong)',
    accelerate: 'var(--range-accel)',
  }

  const overlays = []
  for (const [action, [lo, hi]] of Object.entries(rp)) {
    if (index >= lo && index <= hi) overlaps: overlays.push(action)
  }
  if (overlays.length === 0) return null

  if (hovered && overlays.includes(hovered)) {
    return { backgroundColor: rangeColors[hovered], opacity: 1 }
  }
  if (hovered && !overlays.includes(hovered)) {
    return { backgroundColor: rangeColors[overlays[0]], opacity: 0.3 }
  }
  return { backgroundColor: rangeColors[overlays[0]], opacity: 0.5 }
}

// Range bracket markers (min/max positions)
function isBracketMin(index) {
  if (!props.hoveredAction || !props.rangePreview[props.hoveredAction]) return false
  return index === props.rangePreview[props.hoveredAction][0]
}

function isBracketMax(index) {
  if (!props.hoveredAction || !props.rangePreview[props.hoveredAction]) return false
  return index === props.rangePreview[props.hoveredAction][1]
}

// Pip position as percentage
const pipLeft = computed(() => {
  const total = props.cells.length
  // Center pip on cell: each cell is (100/total)% wide, offset by half
  const cellWidth = 100 / total
  return `${props.position * cellWidth + cellWidth / 2}%`
})

// Reward label
function rewardLabel(type) {
  if (type === 'reward_high') return '$$$'
  if (type === 'reward_medium') return '$$'
  if (type === 'reward_low') return '$'
  return ''
}

// Action button classes
function actionBtnClass(action) {
  const cls = ['tr-action-btn', `tr-action-btn--${action}`]
  if (action === 'capitalize' && props.canCapitalize) cls.push('tr-action-btn--cap-glow')
  if (action === 'capitalize' && !props.canCapitalize) cls.push('tr-action-btn--disabled')
  if (action === 'accelerate' && props.accelLevel >= props.maxAccel) cls.push('tr-action-btn--disabled')
  return cls
}

function isActionDisabled(action) {
  if (props.mustResolveConcern || props.isHesitating) return true
  if (action === 'capitalize' && !props.canCapitalize) return true
  if (action === 'accelerate' && props.accelLevel >= props.maxAccel) return true
  return false
}
</script>

<template>
  <div class="target-row-wrap">
    <!-- Row 1: Avatar + Email + Bar -->
    <div class="tr-bar-row">
      <!-- Avatar -->
      <div class="tr-avatar" @click="emit('toggleLegend')">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
      </div>

      <!-- Email -->
      <span class="tr-email font-mono">{{ markEmail }}</span>

      <!-- Persuasion bar -->
      <div class="tr-bar" :class="{ 'tr-bar--hesitating': isHesitating }">
        <div class="tr-bar__cells">
          <div
            v-for="(cell, i) in cells"
            :key="i"
            class="tr-cell"
            :class="[
              cellPatternClass(cell),
              {
                'tr-cell--concern-active': cell === 'concern' && mustResolveConcern && i === position,
                'tr-cell--bracket-min': isBracketMin(i),
                'tr-cell--bracket-max': isBracketMax(i),
              }
            ]"
            :style="{ backgroundColor: CELL_TYPES[cell]?.color || 'var(--cell-neutral)' }"
            :title="`${i}: ${CELL_TYPES[cell]?.label || cell}`"
          >
            <div
              v-if="rangeOverlayStyle(i)"
              class="tr-cell__overlay"
              :style="rangeOverlayStyle(i)"
            ></div>
            <span v-if="rewardLabel(cell)" class="tr-cell__reward">{{ rewardLabel(cell) }}</span>
          </div>
        </div>

        <!-- Pip: white ▲ below bar -->
        <div class="tr-pip" :style="{ left: pipLeft }">
          <span class="tr-pip__arrow">&#x25B2;</span>
        </div>
      </div>
    </div>

    <!-- Row 2: ScamType + Emojis + RESPOND -->
    <div class="tr-controls-row">
      <!-- Scam type pill -->
      <span class="tr-scam-pill">
        {{ scamType.emoji }} {{ scamType.name }}
        <span v-if="accelLevel > 0" class="tr-accel-badge font-mono">&#x26A1;{{ accelLevel }}</span>
      </span>

      <!-- Action buttons -->
      <div class="tr-actions" :class="{ 'tr-actions--greyed': mustResolveConcern || isHesitating }">
        <button
          v-for="a in actions"
          :key="a"
          :class="actionBtnClass(a)"
          :disabled="isActionDisabled(a)"
          @click="doAction(a)"
          @mouseenter="onHover(a)"
          @mouseleave="onLeave"
          :title="a === 'capitalize' ? 'Capitalize' : (responseTypeNames[a] || ACTION_EMOJIS[a].label)"
        >
          <span class="tr-action-btn__emoji">{{ ACTION_EMOJIS[a].emoji }}</span>
          <span v-if="a === 'capitalize' && canCapitalize" class="tr-action-btn__tier">{{ rewardTierLabel }}</span>
        </button>
      </div>

      <!-- RESPOND / RESOLVE / Hesitation button -->
      <button
        v-if="mustResolveConcern"
        class="tr-respond-btn tr-respond-btn--concern"
        @click="doAction('resolve_concern')"
      >
        <span class="tr-respond-btn__label">RESOLVE</span>
        <span class="tr-respond-btn__divider">|</span>
        <span class="tr-respond-btn__count font-mono">{{ round }}</span>
      </button>

      <button
        v-else-if="isHesitating"
        class="tr-respond-btn tr-respond-btn--hesitation"
        @click="doAction('skip')"
      >
        <span class="tr-respond-btn__label">WAIT</span>
        <span class="tr-respond-btn__divider">|</span>
        <span class="tr-respond-btn__count font-mono">{{ round }}</span>
      </button>

      <div v-else class="tr-respond-btn">
        <span class="tr-respond-btn__label">RESPOND</span>
        <span class="tr-respond-btn__divider">|</span>
        <span class="tr-respond-btn__count font-mono">{{ round }}</span>
      </div>
    </div>

    <!-- Hesitation message overlay -->
    <div v-if="isHesitating" class="tr-hesitation-msg">
      The target needs some time to think
    </div>

    <!-- Suspicion warning -->
    <div v-if="suspicionLine > 0" class="tr-suspicion-warn">
      Suspicion rising — {{ suspicionLine }}/50 cells consumed
    </div>
  </div>
</template>

<style scoped>
.target-row-wrap {
  width: 100%;
  background: var(--bg-torn-panel);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 10px 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ── Row 1: Avatar + Email + Bar ─────────────────── */
.tr-bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 0;
}

.tr-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  flex-shrink: 0;
  cursor: pointer;
}

.tr-avatar:hover {
  color: #aaa;
}

.tr-email {
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 110px;
  flex-shrink: 0;
}

/* ── Persuasion Bar ──────────────────────────────── */
.tr-bar {
  flex: 1;
  position: relative;
  min-width: 0;
  transition: opacity 0.3s;
}

.tr-bar--hesitating {
  opacity: 0.45;
}

.tr-bar__cells {
  display: flex;
  gap: 1px;
  height: 28px;
}

.tr-cell {
  flex: 1;
  min-width: 0;
  border-radius: 1px;
  position: relative;
  transition: background-color 0.2s;
}

/* ── Cell patterns ───────────────────────────────── */

/* Temptation: teal with right-moving chevrons */
.cell--temptation-pattern::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    -60deg,
    transparent,
    transparent 3px,
    rgba(255,255,255,0.12) 3px,
    rgba(255,255,255,0.12) 5px
  );
  background-size: 12px 100%;
  animation: chevron-right 0.8s linear infinite;
  pointer-events: none;
}

/* Sensitivity: pink/magenta with left-moving chevrons */
.cell--sensitivity-pattern::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    60deg,
    transparent,
    transparent 3px,
    rgba(255,255,255,0.12) 3px,
    rgba(255,255,255,0.12) 5px
  );
  background-size: 12px 100%;
  animation: chevron-left 0.8s linear infinite;
  pointer-events: none;
}

/* Hesitation: yellow/amber with dot pattern */
.cell--hesitation-pattern::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle 1.5px, rgba(255,255,255,0.2) 100%, transparent 100%);
  background-size: 6px 6px;
  animation: dot-pulse 2s ease-in-out infinite;
  pointer-events: none;
}

/* Concern: purple with crosshatch */
.cell--concern-pattern::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 3px,
      rgba(255,255,255,0.1) 3px,
      rgba(255,255,255,0.1) 4px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 3px,
      rgba(255,255,255,0.1) 3px,
      rgba(255,255,255,0.1) 4px
    );
  pointer-events: none;
}

/* Suspicion: dark red pulse */
.cell--suspicion-pulse {
  animation: suspicion-creep 1.5s ease-in-out infinite;
}

/* Active concern glow */
.tr-cell--concern-active {
  box-shadow: inset 0 0 6px rgba(139, 92, 246, 0.6);
}

/* Range bracket markers */
.tr-cell--bracket-min::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255,255,255,0.8);
  z-index: 2;
}

.tr-cell--bracket-max::before {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255,255,255,0.8);
  z-index: 2;
}

/* Range overlay */
.tr-cell__overlay {
  position: absolute;
  inset: 0;
  border-radius: 1px;
  pointer-events: none;
  transition: opacity 0.15s;
}

/* Reward label inside cell */
.tr-cell__reward {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6px;
  font-weight: 700;
  color: rgba(255,255,255,0.6);
  pointer-events: none;
  font-family: 'Courier New', monospace;
  z-index: 1;
}

/* ── Pip (white ▲ below bar) ─────────────────────── */
.tr-pip {
  position: absolute;
  bottom: -14px;
  transform: translateX(-50%);
  transition: left 0.3s ease;
  z-index: 10;
}

.tr-pip__arrow {
  font-size: 10px;
  color: #fff;
  line-height: 1;
  text-shadow: 0 0 4px rgba(255,255,255,0.4);
}

/* ── Row 2: Scam pill + Actions + Respond ────────── */
.tr-controls-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 6px;
}

.tr-scam-pill {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--bg-elevated);
  padding: 4px 8px;
  border-radius: 3px;
  white-space: nowrap;
  flex-shrink: 0;
}

.tr-accel-badge {
  font-size: 10px;
  color: var(--accent-yellow);
  margin-left: 4px;
}

/* ── Action buttons (emoji circles) ──────────────── */
.tr-actions {
  display: flex;
  gap: 5px;
  flex: 1;
  justify-content: center;
}

.tr-actions--greyed {
  opacity: 0.25;
  pointer-events: none;
}

.tr-action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.15s ease;
  padding: 0;
  flex-shrink: 0;
}

.tr-action-btn__emoji {
  font-size: 20px;
  line-height: 1;
  position: relative;
  z-index: 1;
}

/* Strong: green arrows up background */
.tr-action-btn--strong {
  background:
    repeating-linear-gradient(
      0deg,
      rgba(34,197,94,0.3),
      rgba(34,197,94,0.3) 4px,
      rgba(34,197,94,0.15) 4px,
      rgba(34,197,94,0.15) 8px
    );
  background-size: 100% 10px;
  animation: arrow-up 0.6s linear infinite;
}

/* Soft: blue arrows up background */
.tr-action-btn--soft {
  background:
    repeating-linear-gradient(
      0deg,
      rgba(59,130,246,0.3),
      rgba(59,130,246,0.3) 4px,
      rgba(59,130,246,0.15) 4px,
      rgba(59,130,246,0.15) 8px
    );
  background-size: 100% 10px;
  animation: arrow-up 0.8s linear infinite;
}

/* Back: red arrows down background */
.tr-action-btn--back {
  background:
    repeating-linear-gradient(
      0deg,
      rgba(239,68,68,0.3),
      rgba(239,68,68,0.3) 4px,
      rgba(239,68,68,0.15) 4px,
      rgba(239,68,68,0.15) 8px
    );
  background-size: 100% 10px;
  animation: arrow-down 0.6s linear infinite;
}

/* Accelerate: yellow pulsing radial */
.tr-action-btn--accelerate {
  background: radial-gradient(circle, rgba(249,115,22,0.4) 0%, rgba(249,115,22,0.1) 70%);
  animation: accel-pulse 1.2s ease-in-out infinite;
}

/* Capitalize: green with glow when active */
.tr-action-btn--capitalize {
  background: radial-gradient(circle, rgba(34,197,94,0.2) 0%, rgba(34,197,94,0.05) 70%);
}

.tr-action-btn--cap-glow {
  animation: cap-glow 1.5s ease-in-out infinite;
  border: 1px solid var(--accent-yellow) !important;
}

.tr-action-btn--cap-glow .tr-action-btn__emoji {
  filter: drop-shadow(0 0 4px rgba(234, 179, 8, 0.6));
}

.tr-action-btn__tier {
  position: absolute;
  bottom: -4px;
  right: -2px;
  background: var(--accent-yellow);
  color: #000;
  font-size: 7px;
  font-weight: 800;
  padding: 1px 3px;
  border-radius: 2px;
  font-family: 'Courier New', monospace;
  z-index: 2;
}

.tr-action-btn--disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.tr-action-btn:hover:not(:disabled) {
  transform: scale(1.15);
}

.tr-action-btn:disabled {
  cursor: not-allowed;
}

/* ── RESPOND / RESOLVE button ────────────────────── */
.tr-respond-btn {
  display: flex;
  align-items: center;
  gap: 0;
  background: #222;
  border: 1px solid #3a3a3a;
  border-radius: 3px;
  padding: 0;
  height: 32px;
  flex-shrink: 0;
  cursor: default;
  font-family: inherit;
  overflow: hidden;
}

.tr-respond-btn__label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.04em;
  padding: 0 8px;
}

.tr-respond-btn__divider {
  color: #444;
  font-size: 14px;
  line-height: 32px;
}

.tr-respond-btn__count {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  padding: 0 8px;
  min-width: 30px;
  text-align: center;
}

/* Concern state: purple RESOLVE */
.tr-respond-btn--concern {
  border-color: var(--accent-purple);
  cursor: pointer;
}

.tr-respond-btn--concern .tr-respond-btn__label {
  color: var(--accent-purple);
}

.tr-respond-btn--concern:hover {
  background: rgba(139, 92, 246, 0.15);
}

/* Hesitation state: amber WAIT */
.tr-respond-btn--hesitation {
  border-color: var(--accent-yellow);
  cursor: pointer;
}

.tr-respond-btn--hesitation .tr-respond-btn__label {
  color: var(--accent-yellow);
}

.tr-respond-btn--hesitation:hover {
  background: rgba(217, 119, 6, 0.15);
}

/* ── Hesitation overlay message ──────────────────── */
.tr-hesitation-msg {
  text-align: center;
  font-size: 11px;
  color: var(--accent-yellow);
  font-style: italic;
  padding: 2px 0;
}

/* ── Suspicion warning ───────────────────────────── */
.tr-suspicion-warn {
  text-align: center;
  font-size: 10px;
  font-weight: 600;
  color: var(--accent-red-light);
  background: rgba(185, 28, 28, 0.1);
  border: 1px solid rgba(185, 28, 28, 0.2);
  border-radius: 3px;
  padding: 3px 8px;
  animation: pulse-red 2s ease-in-out infinite;
}

/* ── Responsive ──────────────────────────────────── */
@media (max-width: 640px) {
  .tr-email {
    display: none;
  }

  .tr-bar__cells {
    height: 22px;
  }

  .tr-controls-row {
    flex-wrap: wrap;
    justify-content: center;
  }

  .tr-scam-pill {
    font-size: 10px;
  }
}

@media (max-width: 420px) {
  .target-row-wrap {
    padding: 8px;
  }

  .tr-action-btn {
    width: 32px;
    height: 32px;
  }

  .tr-action-btn__emoji {
    font-size: 17px;
  }

  .tr-avatar {
    width: 28px;
    height: 28px;
  }
}
</style>
