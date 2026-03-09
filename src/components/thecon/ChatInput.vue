<script setup>
import { ref } from 'vue'

const props = defineProps({
  disabled: { type: Boolean, default: false },
  markName: { type: String, default: 'the mark' },
  maxLength: { type: Number, default: 300 },
})

const emit = defineEmits(['send'])

const inputText = ref('')

function handleSend() {
  const text = inputText.value.trim()
  if (!text || props.disabled) return
  emit('send', text)
  inputText.value = ''
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <div class="chat-input" :class="{ 'chat-input--disabled': disabled }">
    <input
      type="text"
      v-model="inputText"
      :maxlength="maxLength"
      :placeholder="disabled ? 'Conversation ended.' : `What do you say to ${markName}?`"
      :disabled="disabled"
      class="chat-input__field"
      @keydown="handleKeydown"
    />
    <div class="chat-input__meta">
      <span class="chat-input__count font-mono">{{ inputText.length }}/{{ maxLength }}</span>
      <button
        class="chat-input__send font-mono"
        :disabled="disabled || !inputText.trim()"
        @click="handleSend"
      >
        SEND
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 14px;
  background: var(--bg-card, #12121c);
  border: 1px solid var(--border, #1e1e30);
  border-radius: 4px;
}

.chat-input--disabled {
  opacity: 0.5;
}

.chat-input__field {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-elevated, #1a1a28);
  border: 1px solid var(--border, #1e1e30);
  border-radius: 4px;
  color: var(--text-primary, #d4d4e0);
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
}

.chat-input__field:focus {
  border-color: var(--accent, #00bcd4);
}

.chat-input__field::placeholder {
  color: var(--text-muted, #555570);
}

.chat-input__field:disabled {
  cursor: not-allowed;
}

.chat-input__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-input__count {
  font-size: 9px;
  color: var(--text-muted, #555570);
}

.chat-input__send {
  padding: 6px 16px;
  background: rgba(0, 188, 212, 0.12);
  border: 1px solid rgba(0, 188, 212, 0.3);
  border-radius: 3px;
  color: var(--accent, #00bcd4);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.chat-input__send:hover:not(:disabled) {
  background: rgba(0, 188, 212, 0.2);
  border-color: var(--accent, #00bcd4);
}

.chat-input__send:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
