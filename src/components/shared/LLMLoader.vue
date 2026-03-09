<script setup>
/**
 * LLM Model Loader — Themed loading screen for WebLLM.
 *
 * STANDALONE COMPONENT — not used by any game yet.
 * Drop this into any game's template to show a loading screen
 * while the browser downloads and initializes the LLM model.
 *
 * Usage:
 *   <LLMLoader
 *     :progress="loadProgress"
 *     :status="loadStatus"
 *     :is-loading="isLoading"
 *     :is-ready="isReady"
 *     :error="error"
 *     @load="loadModel"
 *     @skip="handleSkip"
 *   />
 */
const props = defineProps({
  progress: { type: Number, default: 0 },
  status: { type: String, default: '' },
  isLoading: { type: Boolean, default: false },
  isReady: { type: Boolean, default: false },
  error: { type: String, default: null },
  modelName: { type: String, default: 'Llama-3.2-1B' },
  // Estimated download size for user display
  downloadSize: { type: String, default: '~880 MB' },
})

const emit = defineEmits(['load', 'skip'])
</script>

<template>
  <div class="llm-loader">
    <div class="llm-loader__panel">
      <!-- Header -->
      <div class="llm-loader__header">
        <span class="llm-loader__badge font-mono">NEURAL INTERFACE</span>
        <span v-if="isReady" class="llm-loader__status llm-loader__status--ready font-mono">ONLINE</span>
        <span v-else-if="isLoading" class="llm-loader__status llm-loader__status--loading font-mono">LOADING</span>
        <span v-else class="llm-loader__status font-mono">OFFLINE</span>
      </div>

      <!-- Pre-load state -->
      <template v-if="!isLoading && !isReady && !error">
        <p class="llm-loader__desc">
          Enable AI-powered conversations. The model runs entirely in your browser — no data leaves your device.
        </p>

        <div class="llm-loader__info">
          <div class="llm-loader__info-row">
            <span class="llm-loader__info-label font-mono">MODEL</span>
            <span class="llm-loader__info-value font-mono">{{ modelName }}</span>
          </div>
          <div class="llm-loader__info-row">
            <span class="llm-loader__info-label font-mono">SIZE</span>
            <span class="llm-loader__info-value font-mono">{{ downloadSize }}</span>
          </div>
          <div class="llm-loader__info-row">
            <span class="llm-loader__info-label font-mono">REQUIRES</span>
            <span class="llm-loader__info-value font-mono">WebGPU (Chrome 113+)</span>
          </div>
          <div class="llm-loader__info-row">
            <span class="llm-loader__info-label font-mono">CACHE</span>
            <span class="llm-loader__info-value font-mono">Downloaded once, cached locally</span>
          </div>
        </div>

        <div class="llm-loader__actions">
          <button class="llm-loader__btn llm-loader__btn--primary font-mono" @click="emit('load')">
            INITIALIZE
          </button>
          <button class="llm-loader__btn llm-loader__btn--secondary font-mono" @click="emit('skip')">
            SKIP (use scripted mode)
          </button>
        </div>
      </template>

      <!-- Loading state -->
      <template v-else-if="isLoading">
        <div class="llm-loader__progress">
          <div class="llm-loader__bar">
            <div
              class="llm-loader__fill"
              :style="{ width: progress + '%' }"
            ></div>
          </div>
          <div class="llm-loader__progress-info">
            <span class="llm-loader__percent font-mono">{{ progress }}%</span>
            <span class="llm-loader__status-text font-mono">{{ status }}</span>
          </div>
        </div>

        <p class="llm-loader__note">
          First load downloads the model. Subsequent visits load from cache instantly.
        </p>
      </template>

      <!-- Ready state -->
      <template v-else-if="isReady">
        <div class="llm-loader__ready">
          <span class="llm-loader__ready-icon font-mono">[OK]</span>
          <span class="llm-loader__ready-text">Neural interface online. AI conversations enabled.</span>
        </div>
      </template>

      <!-- Error state -->
      <template v-else-if="error">
        <div class="llm-loader__error">
          <span class="llm-loader__error-icon font-mono">[!!]</span>
          <span class="llm-loader__error-text">{{ error }}</span>
        </div>
        <div class="llm-loader__actions">
          <button class="llm-loader__btn llm-loader__btn--secondary font-mono" @click="emit('skip')">
            CONTINUE WITHOUT AI
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.llm-loader {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.llm-loader__panel {
  max-width: 500px;
  width: 100%;
  background: var(--bg-card, #12121c);
  border: 1px solid var(--border, #1e1e30);
  border-radius: 6px;
  padding: 24px 20px;
}

.llm-loader__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.llm-loader__badge {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: var(--info, #00d4ff);
}

.llm-loader__status {
  font-size: 9px;
  letter-spacing: 0.12em;
  color: var(--text-muted, #555570);
  border: 1px solid var(--border, #1e1e30);
  padding: 3px 8px;
  border-radius: 2px;
}

.llm-loader__status--ready {
  color: var(--success, #00ff88);
  border-color: rgba(0, 255, 136, 0.25);
}

.llm-loader__status--loading {
  color: var(--info, #00d4ff);
  border-color: rgba(0, 212, 255, 0.25);
  animation: pulse-glow 2s ease-in-out infinite;
}

.llm-loader__desc {
  font-size: 12px;
  color: var(--text-secondary, #8888a0);
  line-height: 1.6;
  margin-bottom: 16px;
}

/* Info rows */
.llm-loader__info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
  padding: 10px;
  background: var(--bg-panel, #0e0e16);
  border: 1px solid var(--border, #1e1e30);
  border-radius: 4px;
}

.llm-loader__info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.llm-loader__info-label {
  font-size: 9px;
  letter-spacing: 0.08em;
  color: var(--text-muted, #555570);
}

.llm-loader__info-value {
  font-size: 10px;
  color: var(--text-secondary, #8888a0);
}

/* Actions */
.llm-loader__actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.llm-loader__btn {
  width: 100%;
  padding: 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  border: 1px solid;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.llm-loader__btn--primary {
  background: rgba(0, 212, 255, 0.1);
  border-color: rgba(0, 212, 255, 0.3);
  color: var(--info, #00d4ff);
}

.llm-loader__btn--primary:hover {
  background: rgba(0, 212, 255, 0.18);
  border-color: var(--info, #00d4ff);
}

.llm-loader__btn--secondary {
  background: transparent;
  border-color: var(--border, #1e1e30);
  color: var(--text-muted, #555570);
}

.llm-loader__btn--secondary:hover {
  border-color: var(--border-light, #2a2a42);
  color: var(--text-secondary, #8888a0);
}

/* Progress */
.llm-loader__progress {
  margin-bottom: 12px;
}

.llm-loader__bar {
  height: 6px;
  background: var(--bg-elevated, #1a1a28);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.llm-loader__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--info, #00d4ff), #00ff88);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.llm-loader__progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.llm-loader__percent {
  font-size: 14px;
  font-weight: 900;
  color: var(--info, #00d4ff);
}

.llm-loader__status-text {
  font-size: 9px;
  color: var(--text-muted, #555570);
  text-align: right;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.llm-loader__note {
  font-size: 10px;
  color: var(--text-muted, #555570);
  font-style: italic;
}

/* Ready */
.llm-loader__ready {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(0, 255, 136, 0.05);
  border: 1px solid rgba(0, 255, 136, 0.2);
  border-radius: 4px;
}

.llm-loader__ready-icon {
  font-size: 14px;
  font-weight: 900;
  color: var(--success, #00ff88);
}

.llm-loader__ready-text {
  font-size: 12px;
  color: var(--text-secondary, #8888a0);
}

/* Error */
.llm-loader__error {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 51, 68, 0.05);
  border: 1px solid rgba(255, 51, 68, 0.2);
  border-radius: 4px;
  margin-bottom: 12px;
}

.llm-loader__error-icon {
  font-size: 14px;
  font-weight: 900;
  color: var(--danger, #ff3344);
}

.llm-loader__error-text {
  font-size: 12px;
  color: var(--text-secondary, #8888a0);
}
</style>
