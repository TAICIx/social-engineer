<script setup>
import { computed, ref, watch, nextTick } from 'vue'

const props = defineProps({
  messages: { type: Array, required: true },
  markEmoji: { type: String, default: '' },
  markName: { type: String, default: '' },
})

const scrollEl = ref(null)

// Auto-scroll to bottom on new messages
watch(() => props.messages.length, async () => {
  await nextTick()
  if (scrollEl.value) {
    scrollEl.value.scrollTop = scrollEl.value.scrollHeight
  }
})

// Show last ~6 messages for compact view
const visibleMessages = computed(() => props.messages)
</script>

<template>
  <div class="dialogue-box" ref="scrollEl">
    <div
      v-for="(msg, i) in visibleMessages"
      :key="i"
      class="dl-msg"
      :class="{
        'dl-msg--player': msg.sender === 'player',
        'dl-msg--mark': msg.sender === 'mark',
        'dl-msg--system': msg.sender === 'system',
      }"
    >
      <!-- System -->
      <div v-if="msg.sender === 'system'" class="dl-system">
        <span class="dl-system__text">{{ msg.text }}</span>
      </div>

      <!-- Player (right) -->
      <div v-else-if="msg.sender === 'player'" class="dl-bubble dl-bubble--player">
        <span class="dl-bubble__sender">You</span>
        <p class="dl-bubble__text">{{ msg.text }}</p>
      </div>

      <!-- Mark (left) -->
      <div v-else class="dl-bubble-row">
        <span class="dl-avatar">{{ markEmoji }}</span>
        <div class="dl-bubble dl-bubble--mark">
          <span class="dl-bubble__sender">{{ markName }}</span>
          <p class="dl-bubble__text">{{ msg.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialogue-box {
  background: var(--bg-torn-row);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 8px 10px;
  max-height: 180px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  scroll-behavior: smooth;
}

/* System messages */
.dl-system {
  text-align: center;
  padding: 2px 0;
}

.dl-system__text {
  font-size: 10px;
  color: var(--text-muted);
  font-style: italic;
  background: var(--bg-secondary);
  padding: 2px 10px;
  border-radius: 3px;
  display: inline-block;
}

/* Shared bubble */
.dl-bubble {
  max-width: 85%;
  padding: 5px 10px;
  border-radius: 4px;
  animation: dl-in 0.15s ease-out;
}

@keyframes dl-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.dl-bubble__sender {
  display: block;
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1px;
}

.dl-bubble__text {
  font-size: 12px;
  line-height: 1.4;
}

/* Player — right */
.dl-msg--player {
  display: flex;
  justify-content: flex-end;
}

.dl-bubble--player {
  background: rgba(110, 143, 112, 0.15);
  border: 1px solid rgba(110, 143, 112, 0.25);
}

.dl-bubble--player .dl-bubble__sender {
  color: var(--text-muted);
  text-align: right;
}

.dl-bubble--player .dl-bubble__text {
  color: var(--accent-green-light);
}

/* Mark — left */
.dl-bubble-row {
  display: flex;
  align-items: flex-end;
  gap: 6px;
}

.dl-avatar {
  font-size: 18px;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  border-radius: 50%;
}

.dl-bubble--mark {
  background: var(--bg-card);
  border: 1px solid var(--border);
}

.dl-bubble--mark .dl-bubble__sender {
  color: var(--text-muted);
}

.dl-bubble--mark .dl-bubble__text {
  color: var(--text-primary);
}

/* Scrollbar */
.dialogue-box::-webkit-scrollbar { width: 3px; }
.dialogue-box::-webkit-scrollbar-track { background: transparent; }
.dialogue-box::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

@media (max-width: 640px) {
  .dialogue-box {
    max-height: 140px;
  }
}
</style>
