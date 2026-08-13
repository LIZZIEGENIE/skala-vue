<script setup>
defineProps({
  options: {
    type: Array,
    required: true,
  },
  activeMode: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['select-mode'])
</script>

<template>
  <div class="mode-selector" role="group" aria-label="날씨 보기 방식 선택">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="mode-button"
      :class="{ active: activeMode === option.value }"
      :aria-pressed="activeMode === option.value"
      @click="emit('select-mode', option.value)"
    >
      {{ option.buttonLabel }}
    </button>
  </div>
</template>

<style scoped>
.mode-selector {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  background: rgba(9, 48, 48, 0.22);
  backdrop-filter: blur(6px);
}

.mode-button {
  padding: 4px 8px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: rgba(255, 255, 255, 0.72);
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  transition:
    color 0.2s,
    background-color 0.2s,
    transform 0.2s;
}

.mode-button:hover {
  color: #fff;
  transform: translateY(-1px);
}

.mode-button.active {
  background: #ffd49c;
  color: #70472e;
}

.mode-button:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

@media (max-width: 390px) {
  .mode-button {
    padding-inline: 6px;
  }
}
</style>
