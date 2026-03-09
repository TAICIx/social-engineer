<script setup>
const props = defineProps({
  game: { type: Object, required: true },
})

const emit = defineEmits(['select'])

const isActive = props.game.status === 'ACTIVE'
</script>

<template>
  <button
    class="game-card"
    :class="{ 'game-card--disabled': !isActive }"
    :style="{ '--card-accent': game.accent }"
    :disabled="!isActive"
    @click="emit('select')"
  >
    <div class="game-card__status font-mono">
      <span class="game-card__dot" :class="{ 'game-card__dot--active': isActive }"></span>
      {{ game.status }}
    </div>

    <h2 class="game-card__title font-mono">{{ game.title }}</h2>
    <p class="game-card__tagline">"{{ game.tagline }}"</p>

    <div class="game-card__divider"></div>

    <p class="game-card__desc">{{ game.description }}</p>

    <div v-if="isActive" class="game-card__cta font-mono">
      LAUNCH &gt;
    </div>
  </button>
</template>

<style scoped>
.game-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  font-family: inherit;
  color: inherit;
}

.game-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--card-accent);
  opacity: 0.6;
}

.game-card:hover:not(:disabled) {
  border-color: var(--card-accent);
  background: var(--bg-elevated);
  transform: translateY(-2px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4), 0 0 40px color-mix(in srgb, var(--card-accent) 8%, transparent);
}

.game-card--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.game-card__status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  letter-spacing: 0.12em;
  color: var(--text-muted);
}

.game-card__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-muted);
}

.game-card__dot--active {
  background: var(--success);
  box-shadow: 0 0 6px rgba(0, 255, 136, 0.4);
}

.game-card__title {
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: var(--card-accent);
}

.game-card__tagline {
  font-size: 13px;
  font-style: italic;
  color: var(--text-secondary);
  line-height: 1.5;
}

.game-card__divider {
  height: 1px;
  background: var(--border);
}

.game-card__desc {
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-muted);
}

.game-card__cta {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--card-accent);
  margin-top: auto;
  transition: letter-spacing 0.2s;
}

.game-card:hover:not(:disabled) .game-card__cta {
  letter-spacing: 0.18em;
}
</style>
