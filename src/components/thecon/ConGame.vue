<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="con-game">
    <div class="con-placeholder">
      <div class="con-placeholder__header font-mono">
        <span class="con-placeholder__bracket">[</span>
        THE CON
        <span class="con-placeholder__bracket">]</span>
      </div>
      <p class="con-placeholder__tagline">"Talk your way in. If you can."</p>
      <p class="con-placeholder__status font-mono">OPERATION STATUS: IN DEVELOPMENT</p>
      <p class="con-placeholder__desc">
        Face-to-face with a mark. Type what you want to say.
        Manipulate them using persuasion psychology. Coming soon.
      </p>
      <button class="con-placeholder__back font-mono" @click="router.push('/')">
        &lt; RETURN TO BASE
      </button>
    </div>
  </div>
</template>

<style scoped>
.con-game {
  --accent: #00bcd4;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}

.con-placeholder {
  max-width: 480px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.con-placeholder__header {
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: var(--accent);
}

.con-placeholder__bracket {
  color: var(--text-muted);
  font-weight: 300;
}

.con-placeholder__tagline {
  font-size: 14px;
  font-style: italic;
  color: var(--text-secondary);
}

.con-placeholder__status {
  font-size: 10px;
  letter-spacing: 0.15em;
  color: var(--warning);
  background: rgba(255, 170, 0, 0.08);
  border: 1px solid rgba(255, 170, 0, 0.15);
  padding: 6px 16px;
  border-radius: 3px;
}

.con-placeholder__desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.6;
}

.con-placeholder__back {
  margin-top: 12px;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  background: none;
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 8px 20px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.con-placeholder__back:hover {
  color: var(--accent);
  border-color: var(--accent);
}
</style>
