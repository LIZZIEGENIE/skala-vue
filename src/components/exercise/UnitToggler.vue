<script setup>
import Button from 'primevue/button'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler" aria-label="날씨 단위 설정">
    <div class="unit-copy">
      <span>날씨 단위</span>
      <strong>{{ configStore.unitLabel }} ({{ configStore.unitSymbol }})</strong>
      <small v-if="configStore.toggleCount > 0">{{ configStore.toggleCount }}회 변경</small>
    </div>
    <Button
      type="button"
      label="단위 변경"
      icon="pi pi-sync"
      size="small"
      class="toggle-button"
      @click="configStore.toggleUnit"
    />
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  padding-left: 14px;
  border-left: 1px solid #dce8f1;
}

.unit-copy {
  display: flex;
  align-items: baseline;
  gap: 4px;
  color: #6e8498;
  font-size: 11px;
}

.unit-copy strong {
  color: #294d6c;
  font-size: 12px;
  font-weight: 800;
}

.unit-copy small {
  color: #91a4b4;
  font-size: 11px;
}

.toggle-button {
  padding: 7px 11px;
  border: 0;
  border-radius: 8px;
  background: #294d6c;
  color: #fff;
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
  transition:
    background-color 0.2s,
    transform 0.2s;
}

.toggle-button:hover {
  background: #2376c8;
  transform: translateY(-1px);
}

.toggle-button:focus-visible {
  outline: 3px solid rgba(47, 143, 229, 0.2);
  outline-offset: 2px;
}

@media (max-width: 640px) {
  .unit-toggler {
    width: 100%;
    margin-left: 0;
    padding: 10px 0 0;
    border-top: 1px solid #dce8f1;
    border-left: 0;
  }

  .unit-copy {
    flex: 1;
  }
}
</style>
