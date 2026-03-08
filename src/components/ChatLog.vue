<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  messages: { type: Array, required: true },
  markEmoji: { type: String, default: '' },
  markName: { type: String, default: '' },
})

const scrollContainer = ref(null)

// Auto-scroll to bottom on new messages
watch(() => props.messages.length, async () => {
  await nextTick()
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }
})
</script>

<template>
  <div class="chat-log" ref="scrollContainer">
    <div
      v-for="(msg, i) in messages"
      :key="i"
      class="chat-msg"
      :class="{
        'chat-msg--player': msg.sender === 'player',
        'chat-msg--mark': msg.sender === 'mark',
        'chat-msg--system': msg.sender === 'system',
      }"
    >
      <!-- System message -->
      <div v-if="msg.sender === 'system'" class="chat-system">
        <span class="chat-system__text">{{ msg.text }}</span>
      </div>

      <!-- Player (scammer) message — right aligned -->
      <div v-else-if="msg.sender === 'player'" class="chat-bubble chat-bubble--player">
        <p class="chat-bubble__text">{{ msg.text }}</p>
        <span class="chat-bubble__label">You</span>
      </div>

      <!-- Mark message — left aligned with avatar -->
      <div v-else class="chat-bubble-row chat-bubble-row--mark">
        <span class="chat-avatar">{{ markEmoji }}</span>
        <div class="chat-bubble chat-bubble--mark">
          <span class="chat-bubble__name">{{ markName }}</span>
          <p class="chat-bubble__text">{{ msg.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-log {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  min-height: 0;
  scroll-behavior: smooth;
}

/* System messages */
.chat-system {
  text-align: center;
  padding: 4px 0;
}

.chat-system__text {
  font-size: 11px;
  color: var(--text-muted);
  font-style: italic;
  background: var(--bg-secondary);
  padding: 3px 12px;
  border-radius: 10px;
  display: inline-block;
}

/* Bubble shared */
.chat-bubble {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 12px;
  animation: msg-in 0.2s ease-out;
}

@keyframes msg-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.chat-bubble__text {
  font-size: 14px;
  line-height: 1.45;
}

.chat-bubble__label {
  display: block;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 3px;
  text-align: right;
}

.chat-bubble__name {
  display: block;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 2px;
}

/* Player — right side, green tint */
.chat-msg--player {
  display: flex;
  justify-content: flex-end;
}

.chat-bubble--player {
  background: rgba(110, 143, 112, 0.18);
  border: 1px solid rgba(110, 143, 112, 0.35);
  border-bottom-right-radius: 4px;
}

.chat-bubble--player .chat-bubble__text {
  color: var(--accent-green-light);
}

.chat-bubble--player .chat-bubble__label {
  color: var(--text-muted);
}

/* Mark — left side with avatar */
.chat-bubble-row--mark {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.chat-avatar {
  font-size: 24px;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  border-radius: 50%;
}

.chat-bubble--mark {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-bottom-left-radius: 4px;
}

.chat-bubble--mark .chat-bubble__text {
  color: var(--text-primary);
}

.chat-bubble--mark .chat-bubble__name {
  color: var(--text-muted);
}

/* Scrollbar */
.chat-log::-webkit-scrollbar { width: 4px; }
.chat-log::-webkit-scrollbar-track { background: transparent; }
.chat-log::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
</style>
