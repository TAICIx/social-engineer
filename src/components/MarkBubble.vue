<script setup>
defineProps({
  mark: { type: Object, required: true },
  markName: { type: String, required: true },
  reaction: { type: String, default: '' },
})
</script>

<template>
  <div v-if="reaction" class="mark-bubble">
    <div class="mark-bubble__avatar">{{ mark.emoji }}</div>
    <div class="mark-bubble__content">
      <span class="mark-bubble__name">{{ markName }}</span>
      <p class="mark-bubble__text">"{{ reaction }}"</p>
    </div>
  </div>
</template>

<style scoped>
.mark-bubble {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  border-top-left-radius: 4px;
  max-width: 680px;
  margin: 0 auto;
  animation: bubble-in 0.3s ease-out;
}

@keyframes bubble-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.mark-bubble__avatar {
  font-size: 24px;
  flex-shrink: 0;
}

.mark-bubble__content {
  min-width: 0;
}

.mark-bubble__name {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mark-bubble__text {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.4;
  font-style: italic;
  margin-top: 2px;
}
</style>
