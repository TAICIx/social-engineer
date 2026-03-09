<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  chatLog: { type: Array, required: true },
  isProcessing: { type: Boolean, default: false },
  callerIdentity: { type: String, default: 'Caller' },
})

const chatContainer = ref(null)

watch(() => props.chatLog.length, async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
})

function hasRedFlags(entry) {
  return entry.redFlags && entry.redFlags.length > 0
}
</script>

<template>
  <div class="conv" ref="chatContainer">
    <div
      v-for="(entry, i) in chatLog"
      :key="i"
      class="conv__msg"
      :class="{
        'conv__msg--caller': entry.sender === 'caller',
        'conv__msg--player': entry.sender === 'player',
        'conv__msg--system': entry.sender === 'system',
      }"
    >
      <!-- Caller message -->
      <template v-if="entry.sender === 'caller'">
        <div class="conv__caller-row">
          <div class="conv__avatar">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M20 15.5c-1.3 0-2.5-.2-3.7-.6-.3-.1-.7 0-1 .3l-2.2 2.2c-2.8-1.5-5.2-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.3-1-.4-1.2-.6-2.4-.6-3.7C8.4 2.6 7.8 2 7 2H4C3.2 2 2 2.6 2 4c0 9.4 7.6 17 17 17 1.4 0 2-.2 2-2v-3c0-.8-.6-1.5-1-1.5z"/>
            </svg>
          </div>
          <div class="conv__bubble conv__bubble--caller">
            <span class="conv__sender font-mono">{{ callerIdentity }}</span>
            <p class="conv__text">{{ entry.text }}</p>
            <div v-if="hasRedFlags(entry)" class="conv__flags">
              <span
                v-for="flag in entry.redFlags"
                :key="flag.id"
                class="conv__flag-dot"
                :style="{ background: flag.color }"
                :title="flag.label"
              ></span>
            </div>
          </div>
        </div>
      </template>

      <!-- Player message -->
      <template v-else-if="entry.sender === 'player'">
        <div class="conv__player-row">
          <div class="conv__bubble conv__bubble--player">
            <span class="conv__sender font-mono">YOU</span>
            <p class="conv__text">{{ entry.text }}</p>
          </div>
        </div>
      </template>

      <!-- System message -->
      <template v-else-if="entry.sender === 'system'">
        <div class="conv__system">
          <span class="conv__system-text font-mono">{{ entry.text }}</span>
        </div>
      </template>
    </div>

    <!-- Typing indicator -->
    <div v-if="isProcessing" class="conv__typing">
      <div class="conv__avatar">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M20 15.5c-1.3 0-2.5-.2-3.7-.6-.3-.1-.7 0-1 .3l-2.2 2.2c-2.8-1.5-5.2-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.3-1-.4-1.2-.6-2.4-.6-3.7C8.4 2.6 7.8 2 7 2H4C3.2 2 2 2.6 2 4c0 9.4 7.6 17 17 17 1.4 0 2-.2 2-2v-3c0-.8-.6-1.5-1-1.5z"/>
        </svg>
      </div>
      <div class="conv__dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.conv {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: var(--bg-card, #12121c);
  border: 1px solid var(--border, #1e1e30);
  border-radius: 4px;
  min-height: 300px;
  max-height: 480px;
}

.conv__msg {
  animation: fade-in 0.2s ease-out;
}

.conv__caller-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  max-width: 85%;
}

.conv__player-row {
  display: flex;
  justify-content: flex-end;
}

.conv__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--mark-caller-dim, rgba(255, 87, 34, 0.08));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mark-caller, #ff5722);
  flex-shrink: 0;
  margin-top: 2px;
}

.conv__bubble {
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 100%;
}

.conv__bubble--caller {
  background: var(--bg-elevated, #1a1a28);
  border: 1px solid var(--border, #1e1e30);
  border-bottom-left-radius: 2px;
}

.conv__bubble--player {
  background: var(--mark-accent-dim, rgba(255, 170, 0, 0.15));
  border: 1px solid rgba(255, 170, 0, 0.2);
  border-bottom-right-radius: 2px;
  max-width: 85%;
}

.conv__sender {
  display: block;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 3px;
}

.conv__bubble--caller .conv__sender {
  color: var(--mark-caller, #ff5722);
}

.conv__bubble--player .conv__sender {
  color: var(--mark-accent, #ffaa00);
}

.conv__text {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-primary, #d4d4e0);
  word-break: break-word;
}

.conv__flags {
  display: flex;
  gap: 3px;
  margin-top: 4px;
}

.conv__flag-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

/* System message */
.conv__system {
  text-align: center;
  padding: 4px 0;
}

.conv__system-text {
  font-size: 10px;
  color: var(--text-muted, #555570);
  letter-spacing: 0.04em;
}

/* Typing indicator */
.conv__typing {
  display: flex;
  align-items: center;
  gap: 8px;
}

.conv__dots {
  display: flex;
  gap: 4px;
  padding: 8px 12px;
  background: var(--bg-elevated, #1a1a28);
  border-radius: 8px;
}

.conv__dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-muted, #555570);
  animation: dot-bounce 1.2s infinite;
}

.conv__dots span:nth-child(2) { animation-delay: 0.15s; }
.conv__dots span:nth-child(3) { animation-delay: 0.3s; }

@keyframes dot-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-4px); opacity: 1; }
}

/* Scrollbar */
.conv::-webkit-scrollbar { width: 3px; }
.conv::-webkit-scrollbar-track { background: transparent; }
.conv::-webkit-scrollbar-thumb { background: var(--border, #1e1e30); border-radius: 2px; }
</style>
