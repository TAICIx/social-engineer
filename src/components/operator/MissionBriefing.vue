<script setup>
const props = defineProps({
  scamChoices: { type: Array, required: true },
  vulnerabilities: { type: Array, required: true },
  selectedIndex: { type: Number, default: null },
  mark: { type: Object, required: true },
  markName: { type: String, required: true },
  markEmail: { type: String, required: true },
})

const emit = defineEmits(['select', 'accept'])

function vulnBarWidth(val) {
  return `${Math.min(val, 100)}%`
}
</script>

<template>
  <div class="briefing">
    <div class="briefing__panel classified-stamp">
      <!-- Header -->
      <div class="briefing__header">
        <span class="briefing__badge font-mono">MISSION BRIEFING</span>
        <span class="briefing__classification font-mono">CLASSIFIED</span>
      </div>

      <!-- Target dossier -->
      <div class="briefing__dossier">
        <h3 class="briefing__section-title font-mono">TARGET DOSSIER</h3>
        <div class="dossier-grid">
          <div class="dossier-field">
            <span class="dossier-field__label font-mono">NAME</span>
            <span class="dossier-field__value">{{ markName }}</span>
          </div>
          <div class="dossier-field">
            <span class="dossier-field__label font-mono">EMAIL</span>
            <span class="dossier-field__value font-mono">{{ markEmail }}</span>
          </div>
          <div class="dossier-field">
            <span class="dossier-field__label font-mono">PROFILE</span>
            <span class="dossier-field__value">{{ mark.label }}</span>
          </div>
          <div class="dossier-field">
            <span class="dossier-field__label font-mono">CONCERN RESIST</span>
            <span class="dossier-field__value font-mono">{{ Math.round(mark.concernSuccessRate * 100) }}%</span>
          </div>
        </div>
      </div>

      <div class="briefing__divider"></div>

      <!-- Operation selection -->
      <h3 class="briefing__section-title font-mono">SELECT OPERATION TYPE</h3>
      <div class="briefing__ops">
        <button
          v-for="(scam, i) in scamChoices"
          :key="scam.id"
          class="op-choice"
          :class="{ 'op-choice--selected': selectedIndex === i }"
          @click="emit('select', i)"
        >
          <div class="op-choice__header">
            <span class="op-choice__tier font-mono">TIER {{ scam.tier }}</span>
            <span class="op-choice__name">{{ scam.name }}</span>
          </div>
          <p class="op-choice__opening">"{{ scam.openingLine }}"</p>

          <!-- Vulnerability radar (simple bars) -->
          <div class="vuln-grid">
            <div class="vuln-row">
              <span class="vuln-row__label font-mono">REWARD</span>
              <div class="vuln-row__bar">
                <div class="vuln-row__fill vuln-row__fill--reward" :style="{ width: vulnBarWidth(vulnerabilities[i].reward) }"></div>
              </div>
              <span class="vuln-row__val font-mono">{{ vulnerabilities[i].reward }}%</span>
            </div>
            <div class="vuln-row">
              <span class="vuln-row__label font-mono">RISK</span>
              <div class="vuln-row__bar">
                <div class="vuln-row__fill vuln-row__fill--risk" :style="{ width: vulnBarWidth(vulnerabilities[i].risk) }"></div>
              </div>
              <span class="vuln-row__val font-mono">{{ vulnerabilities[i].risk }}%</span>
            </div>
            <div class="vuln-row">
              <span class="vuln-row__label font-mono">VOLATILITY</span>
              <div class="vuln-row__bar">
                <div class="vuln-row__fill vuln-row__fill--volatility" :style="{ width: vulnBarWidth(vulnerabilities[i].volatility) }"></div>
              </div>
              <span class="vuln-row__val font-mono">{{ vulnerabilities[i].volatility }}%</span>
            </div>
          </div>
        </button>
      </div>

      <div class="briefing__divider"></div>

      <!-- Accept -->
      <button
        class="briefing__accept font-mono"
        :disabled="selectedIndex === null"
        @click="emit('accept')"
      >
        ACCEPT MISSION
      </button>
    </div>
  </div>
</template>

<style scoped>
.briefing {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.briefing__panel {
  max-width: 640px;
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 28px 24px;
}

.briefing__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.briefing__badge {
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.12em;
  color: var(--accent);
}

.briefing__classification {
  font-size: 9px;
  letter-spacing: 0.15em;
  color: var(--danger);
  border: 1px solid rgba(255, 51, 68, 0.25);
  padding: 3px 8px;
  border-radius: 2px;
}

.briefing__section-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.briefing__divider {
  height: 1px;
  background: var(--border);
  margin: 20px 0;
}

/* ── Dossier grid ───────────────────────────────────── */
.dossier-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.dossier-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dossier-field__label {
  font-size: 9px;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.dossier-field__value {
  font-size: 13px;
  color: var(--text-primary);
  font-weight: 600;
}

/* ── Operation choices ──────────────────────────────── */
.briefing__ops {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.op-choice {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px;
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 4px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
  color: inherit;
}

.op-choice:hover {
  border-color: var(--border-light);
  background: var(--bg-elevated);
}

.op-choice--selected {
  border-color: var(--accent) !important;
  background: rgba(0, 212, 255, 0.04);
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.06);
}

.op-choice__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.op-choice__tier {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  background: var(--bg-elevated);
  padding: 2px 6px;
  border-radius: 2px;
}

.op-choice__name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.op-choice__opening {
  font-size: 12px;
  font-style: italic;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* ── Vulnerability bars ─────────────────────────────── */
.vuln-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
}

.vuln-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vuln-row__label {
  font-size: 8px;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  width: 64px;
  flex-shrink: 0;
}

.vuln-row__bar {
  flex: 1;
  height: 4px;
  background: var(--bg-elevated);
  border-radius: 2px;
  overflow: hidden;
}

.vuln-row__fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.vuln-row__fill--reward { background: var(--success); }
.vuln-row__fill--risk { background: var(--danger); }
.vuln-row__fill--volatility { background: var(--warning); }

.vuln-row__val {
  font-size: 9px;
  color: var(--text-muted);
  width: 28px;
  text-align: right;
  flex-shrink: 0;
}

/* ── Accept button ──────────────────────────────────── */
.briefing__accept {
  width: 100%;
  padding: 14px;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 4px;
  color: var(--accent);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.15em;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.briefing__accept:hover:not(:disabled) {
  background: rgba(0, 212, 255, 0.18);
  border-color: var(--accent);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.1);
}

.briefing__accept:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

@media (max-width: 500px) {
  .dossier-grid {
    grid-template-columns: 1fr;
  }

  .briefing__panel {
    padding: 20px 16px;
  }
}
</style>
