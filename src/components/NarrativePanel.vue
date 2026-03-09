<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  storyText: { type: String, default: '' },
  storyLabel: { type: String, default: '' },
})

const animating = ref(false)

// Trigger a brief fade-in when storyText changes
watch(() => props.storyText, async () => {
  animating.value = true
  await nextTick()
  // Reset animation
  requestAnimationFrame(() => {
    animating.value = false
  })
})
</script>

<template>
  <div class="narrative-panel" v-if="storyText">
    <div class="narrative-content" :class="{ 'narrative-content--enter': !animating }">
      <p class="narrative-text">{{ storyText }}</p>
      <span v-if="storyLabel" class="narrative-label">{{ storyLabel }}</span>
    </div>
  </div>
</template>

<style scoped>
.narrative-panel {
  background: var(--bg-torn-row);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 10px 14px;
  min-height: 48px;
}

.narrative-content {
  opacity: 0;
  transform: translateY(3px);
}

.narrative-content--enter {
  animation: narrative-fade-in 0.3s ease-out forwards;
}

@keyframes narrative-fade-in {
  from {
    opacity: 0;
    transform: translateY(3px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.narrative-text {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.narrative-label {
  display: inline-block;
  margin-top: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  background: var(--bg-elevated);
  padding: 2px 8px;
  border-radius: 2px;
}

@media (max-width: 640px) {
  .narrative-panel {
    padding: 8px 10px;
  }

  .narrative-text {
    font-size: 12px;
  }
}
</style>
