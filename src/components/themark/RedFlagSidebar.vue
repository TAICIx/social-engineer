<script setup>
const props = defineProps({
  redFlagSummary: { type: Array, default: () => [] },
  redFlags: { type: Array, default: () => [] },
  turnNumber: { type: Number, default: 0 },
})
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__header">
      <span class="sidebar__title font-mono">THREAT ANALYSIS</span>
    </div>

    <!-- Red flag count -->
    <div class="sidebar__section">
      <span class="sidebar__section-title font-mono">RED FLAGS DETECTED</span>

      <div v-if="redFlagSummary.length > 0" class="flags-list">
        <div
          v-for="flag in redFlagSummary"
          :key="flag.id"
          class="flag-item"
        >
          <div class="flag-item__header">
            <span class="flag-item__dot" :style="{ background: flag.color }"></span>
            <span class="flag-item__label">{{ flag.label }}</span>
            <span class="flag-item__count font-mono">x{{ flag.count }}</span>
          </div>
          <div class="flag-item__bar">
            <div
              class="flag-item__fill"
              :style="{ width: Math.min(flag.count * 33, 100) + '%', background: flag.color }"
            ></div>
          </div>
        </div>
      </div>

      <div v-else class="flags-none font-mono">
        No red flags detected yet.
      </div>
    </div>

    <!-- Recent flags timeline -->
    <div class="sidebar__section">
      <span class="sidebar__section-title font-mono">FLAG TIMELINE</span>
      <div v-if="redFlags.length > 0" class="timeline">
        <div
          v-for="(flag, i) in redFlags.slice(-8)"
          :key="i"
          class="timeline__item"
        >
          <span class="timeline__dot" :style="{ background: flag.color }"></span>
          <span class="timeline__turn font-mono">T{{ flag.turn }}</span>
          <span class="timeline__label">{{ flag.label }}</span>
        </div>
      </div>
      <p v-else class="flags-none font-mono">No flags to show.</p>
    </div>

    <!-- Guidance -->
    <div class="sidebar__section">
      <span class="sidebar__section-title font-mono">WATCH FOR</span>
      <ul class="guidance">
        <li>Urgency / pressure to act immediately</li>
        <li>Requests for payment or personal info</li>
        <li>Emotional manipulation or threats</li>
        <li>Resistance to verification attempts</li>
        <li>Offers that seem too good to be true</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  background: var(--bg-card, #12121c);
  border: 1px solid var(--border, #1e1e30);
  border-radius: 4px;
  overflow-y: auto;
  max-height: 580px;
}

.sidebar__header {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border, #1e1e30);
}

.sidebar__title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--mark-accent, #ffaa00);
}

.sidebar__section {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border, #1e1e30);
}

.sidebar__section:last-child {
  border-bottom: none;
}

.sidebar__section-title {
  display: block;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-muted, #555570);
  margin-bottom: 8px;
}

/* Flag items */
.flags-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.flag-item__header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.flag-item__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.flag-item__label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary, #d4d4e0);
  flex: 1;
}

.flag-item__count {
  font-size: 10px;
  color: var(--text-secondary, #8888a0);
}

.flag-item__bar {
  height: 3px;
  background: var(--bg-elevated, #1a1a28);
  border-radius: 2px;
  margin-top: 3px;
  overflow: hidden;
}

.flag-item__fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.flags-none {
  font-size: 10px;
  color: var(--text-muted, #555570);
  font-style: italic;
}

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timeline__item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
}

.timeline__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.timeline__turn {
  font-size: 9px;
  color: var(--text-muted, #555570);
  width: 20px;
  flex-shrink: 0;
}

.timeline__label {
  color: var(--text-secondary, #8888a0);
}

/* Guidance */
.guidance {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.guidance li {
  font-size: 10px;
  color: var(--text-secondary, #8888a0);
  padding-left: 12px;
  position: relative;
}

.guidance li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--mark-accent, #ffaa00);
  opacity: 0.5;
}

/* Scrollbar */
.sidebar::-webkit-scrollbar { width: 3px; }
.sidebar::-webkit-scrollbar-track { background: transparent; }
.sidebar::-webkit-scrollbar-thumb { background: var(--border, #1e1e30); border-radius: 2px; }

@media (max-width: 700px) {
  .sidebar {
    max-height: 260px;
  }
}
</style>
