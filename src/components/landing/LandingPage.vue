<script setup>
import { useRouter } from 'vue-router'
import GameCard from './GameCard.vue'

const router = useRouter()

const games = [
  {
    id: 'operator',
    title: 'THE OPERATOR',
    tagline: 'Every mark has a breaking point. Find it.',
    description: 'A tactical intelligence operation. Analyze the target, deploy persuasion tactics, and extract before suspicion catches you.',
    accent: '#00d4ff',
    route: '/operator',
    status: 'ACTIVE',
  },
  {
    id: 'con',
    title: 'THE CON',
    tagline: 'Talk your way in. If you can.',
    description: 'Face-to-face with a mark. Type what you want to say. Manipulate them using persuasion psychology. But they have a mind of their own.',
    accent: '#00bcd4',
    route: '/con',
    status: 'ACTIVE',
  },
  {
    id: 'mark',
    title: 'THE MARK',
    tagline: 'Someone is targeting you. Can you tell?',
    description: 'You\'re the target now. A caller contacts you — legit or scam? Chat naturally, spot the red flags, and make your call before it\'s too late.',
    accent: '#ffaa00',
    route: '/mark',
    status: 'ACTIVE',
  },
]
</script>

<template>
  <div class="landing">
    <div class="landing__inner">
      <!-- Header -->
      <header class="landing__header">
        <div class="landing__logo">
          <span class="landing__logo-bracket font-mono">[</span>
          <span class="landing__logo-text">SCAMBENCH</span>
          <span class="landing__logo-bracket font-mono">]</span>
        </div>
        <p class="landing__subtitle font-mono">EDUCATIONAL SCAM AWARENESS PLATFORM</p>
      </header>

      <!-- Divider -->
      <div class="landing__divider">
        <span class="landing__divider-line"></span>
        <span class="landing__divider-text font-mono">SELECT OPERATION</span>
        <span class="landing__divider-line"></span>
      </div>

      <!-- Game cards -->
      <div class="landing__games">
        <GameCard
          v-for="game in games"
          :key="game.id"
          :game="game"
          @select="router.push(game.route)"
        />
      </div>

      <!-- Footer -->
      <footer class="landing__footer">
        <p class="font-mono">An educational project by <a href="https://scambench.com" target="_blank" rel="noopener">scambench.com</a></p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.landing {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}

.landing__inner {
  max-width: 960px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.landing__header {
  text-align: center;
}

.landing__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-bottom: 8px;
}

.landing__logo-bracket {
  font-size: 28px;
  color: var(--text-muted);
  font-weight: 300;
}

.landing__logo-text {
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 0.2em;
  color: var(--text-primary);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.landing__subtitle {
  font-size: 10px;
  letter-spacing: 0.15em;
  color: var(--text-muted);
}

.landing__divider {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 500px;
}

.landing__divider-line {
  flex: 1;
  height: 1px;
  background: var(--border);
}

.landing__divider-text {
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  white-space: nowrap;
}

.landing__games {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
}

.landing__footer {
  font-size: 10px;
  color: var(--text-muted);
}

.landing__footer a {
  color: var(--info);
  text-decoration: none;
}

.landing__footer a:hover {
  text-decoration: underline;
}

@media (max-width: 800px) {
  .landing__games {
    grid-template-columns: 1fr;
  }

  .landing__logo-text {
    font-size: 22px;
  }
}
</style>
