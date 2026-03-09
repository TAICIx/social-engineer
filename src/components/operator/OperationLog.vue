<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  entries: { type: Array, required: true },
  storyText: { type: String, default: '' },
  storyLabel: { type: String, default: '' },
})

const scrollEl = ref(null)

// Auto-scroll on new entries
watch(() => props.entries.length, async () => {
  await nextTick()
  if (scrollEl.value) {
    scrollEl.value.scrollTop = scrollEl.value.scrollHeight
  }
})

function entryClass(entry) {
  if (entry.type === 'player') return 'log-entry--player'
  if (entry.type === 'mark') return 'log-entry--mark'
  if (entry.type === 'system') return 'log-entry--system'
  if (entry.type === 'narrative') return 'log-entry--narrative'
  return ''
}

function entryPrefix(entry) {
  if (entry.type === 'player') return 'AGENT'
  if (entry.type === 'mark') return 'MARK'
  if (entry.type === 'system') return 'SYS'
  if (entry.type === 'narrative') return entry.label || 'LOG'
  return ''
}
</script>

<template>
  <div class="op-log">
    <div class="op-log__header">
      <span class="op-log__title font-mono">OPERATION LOG</span>
    </div>

    <div class="op-log__scroll" ref="scrollEl">
      <div
        v-for="(entry, i) in entries"
        :key="i"
        class="log-entry"
        :class="entryClass(entry)"
      >
        <span class="log-entry__prefix font-mono">{{ entryPrefix(entry) }}</span>
        <span class="log-entry__text">{{ entry.text }}</span>
      </div>

      <div v-if="entries.length === 0" class="log-entry log-entry--system">
        <span class="log-entry__prefix font-mono">SYS</span>
        <span class="log-entry__text">Awaiting operation start...</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.op-log {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
}

.op-log__header {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
}

.op-log__title {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--text-muted);
}

.op-log__scroll {
  max-height: 180px;
  overflow-y: auto;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  scroll-behavior: smooth;
}

/* Scrollbar */
.op-log__scroll::-webkit-scrollbar { width: 3px; }
.op-log__scroll::-webkit-scrollbar-track { background: transparent; }
.op-log__scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

/* ── Log entries ────────────────────────────────────── */
.log-entry {
  display: flex;
  gap: 8px;
  align-items: baseline;
  animation: fade-in 0.15s ease-out;
}

.log-entry__prefix {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.06em;
  flex-shrink: 0;
  min-width: 40px;
}

.log-entry__text {
  font-size: 11px;
  line-height: 1.5;
  color: var(--text-secondary);
}

/* Player/Agent */
.log-entry--player .log-entry__prefix {
  color: var(--accent);
}

.log-entry--player .log-entry__text {
  color: var(--accent);
  opacity: 0.8;
}

/* Mark */
.log-entry--mark .log-entry__prefix {
  color: var(--text-muted);
}

.log-entry--mark .log-entry__text {
  color: var(--text-primary);
  font-style: italic;
}

/* System */
.log-entry--system .log-entry__prefix {
  color: var(--warning);
}

.log-entry--system .log-entry__text {
  color: var(--text-muted);
  font-style: italic;
}

/* Narrative */
.log-entry--narrative .log-entry__prefix {
  color: var(--text-muted);
  background: var(--bg-elevated);
  padding: 1px 4px;
  border-radius: 2px;
  font-size: 7px;
}

.log-entry--narrative .log-entry__text {
  color: var(--text-secondary);
}

@media (max-width: 640px) {
  .op-log__scroll {
    max-height: 140px;
  }
}
</style>
