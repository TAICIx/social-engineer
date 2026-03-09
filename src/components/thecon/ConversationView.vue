<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  chatLog: { type: Array, required: true },
  isProcessing: { type: Boolean, default: false },
  markName: { type: String, default: 'Mark' },
})

const scrollEl = ref(null)

watch(() => props.chatLog.length, async () => {
  await nextTick()
  if (scrollEl.value) {
    scrollEl.value.scrollTop = scrollEl.value.scrollHeight
  }
})
</script>

<template>
  <div class="conv-view" ref="scrollEl">
    <div
      v-for="(msg, i) in chatLog"
      :key="i"
      class="conv-msg"
      :class="{
        'conv-msg--player': msg.sender === 'player',
        'conv-msg--mark': msg.sender === 'mark',
        'conv-msg--system': msg.sender === 'system',
      }"
    >
      <!-- System -->
      <div v-if="msg.sender === 'system'" class="conv-system">
        <span class="conv-system__text">{{ msg.text }}</span>
      </div>

      <!-- Player (right) -->
      <div v-else-if="msg.sender === 'player'" class="conv-bubble conv-bubble--player">
        <span class="conv-bubble__sender font-mono">YOU</span>
        <p class="conv-bubble__text">{{ msg.text }}</p>
        <!-- Principle indicator -->
        <div v-if="msg.analysis?.dominantPrinciple" class="conv-bubble__principle font-mono">
          <span
            class="conv-bubble__principle-dot"
            :style="{ background: msg.analysis.detectedPrinciples[0]?.color }"
          ></span>
          {{ msg.analysis.detectedPrinciples[0]?.name }}
        </div>
      </div>

      <!-- Mark (left) -->
      <div v-else class="conv-bubble conv-bubble--mark">
        <div class="conv-bubble__avatar">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </div>
        <div class="conv-bubble__content">
          <span class="conv-bubble__sender font-mono">{{ markName }}</span>
          <p class="conv-bubble__text">{{ msg.text }}</p>
        </div>
      </div>
    </div>

    <!-- Typing indicator -->
    <div v-if="isProcessing" class="conv-typing">
      <div class="conv-bubble conv-bubble--mark">
        <div class="conv-bubble__avatar">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </div>
        <div class="conv-bubble__content">
          <span class="typing-dots">
            <span></span><span></span><span></span>
          </span>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="chatLog.length === 0" class="conv-empty font-mono">
      Waiting for conversation to begin...
    </div>
  </div>
</template>

<style scoped>
.conv-view {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scroll-behavior: smooth;
  background: var(--bg-panel, #0e0e16);
  border: 1px solid var(--border, #1e1e30);
  border-radius: 4px;
  min-height: 300px;
  max-height: 500px;
}

/* Scrollbar */
.conv-view::-webkit-scrollbar { width: 3px; }
.conv-view::-webkit-scrollbar-track { background: transparent; }
.conv-view::-webkit-scrollbar-thumb { background: var(--border, #1e1e30); border-radius: 2px; }

/* Messages */
.conv-msg {
  animation: fade-in 0.2s ease-out;
}

.conv-msg--player {
  display: flex;
  justify-content: flex-end;
}

.conv-msg--mark {
  display: flex;
  justify-content: flex-start;
}

/* System */
.conv-system {
  text-align: center;
  padding: 4px 0;
}

.conv-system__text {
  font-size: 10px;
  color: var(--text-muted, #555570);
  font-style: italic;
  background: var(--bg-secondary, #0f0f18);
  padding: 3px 12px;
  border-radius: 3px;
  display: inline-block;
}

/* Bubbles */
.conv-bubble {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 8px;
  animation: fade-in 0.15s ease-out;
}

.conv-bubble--player {
  background: rgba(0, 188, 212, 0.1);
  border: 1px solid rgba(0, 188, 212, 0.2);
  border-radius: 8px 8px 2px 8px;
}

.conv-bubble--mark {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  background: var(--bg-card, #12121c);
  border: 1px solid var(--border, #1e1e30);
  border-radius: 8px 8px 8px 2px;
}

.conv-bubble__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bg-elevated, #1a1a28);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted, #555570);
  flex-shrink: 0;
}

.conv-bubble__content {
  flex: 1;
  min-width: 0;
}

.conv-bubble__sender {
  display: block;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 2px;
}

.conv-bubble--player .conv-bubble__sender {
  color: var(--text-muted, #555570);
  text-align: right;
}

.conv-bubble--mark .conv-bubble__sender {
  color: var(--text-muted, #555570);
}

.conv-bubble__text {
  font-size: 13px;
  line-height: 1.5;
}

.conv-bubble--player .conv-bubble__text {
  color: var(--accent, #00bcd4);
}

.conv-bubble--mark .conv-bubble__text {
  color: var(--text-primary, #d4d4e0);
}

/* Principle indicator on player messages */
.conv-bubble__principle {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 8px;
  letter-spacing: 0.06em;
  color: var(--text-muted, #555570);
}

.conv-bubble__principle-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Typing indicator */
.typing-dots {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: var(--text-muted, #555570);
  border-radius: 50%;
  animation: typing-bounce 1.2s ease-in-out infinite;
}

.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-4px); opacity: 1; }
}

/* Empty */
.conv-empty {
  text-align: center;
  color: var(--text-muted, #555570);
  font-size: 11px;
  padding: 40px 0;
}

@media (max-width: 640px) {
  .conv-view {
    min-height: 240px;
    max-height: 360px;
  }

  .conv-bubble {
    max-width: 90%;
  }
}
</style>
