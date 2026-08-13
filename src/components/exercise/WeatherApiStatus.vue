<script setup>
import Button from 'primevue/button'
import Message from 'primevue/message'

defineProps({
  loading: Boolean,
  error: {
    type: String,
    default: '',
  },
  lastUpdated: {
    type: Date,
    default: null,
  },
})

defineEmits(['retry'])
</script>

<template>
  <Message
    :severity="error ? 'warn' : 'success'"
    :closable="false"
    class="api-status"
    :class="{ error: error }"
    aria-live="polite"
  >
    <div class="status-copy">
      <span class="api-icon" aria-hidden="true">{{ error ? '⚠️' : loading ? '⏳' : '📡' }}</span>
      <div>
        <strong>{{
          loading ? '실시간 날씨를 불러오는 중입니다.' : error || '실시간 API 연결됨'
        }}</strong>
        <small v-if="lastUpdated && !loading">
          OpenWeatherMap · {{ lastUpdated.toLocaleTimeString('ko-KR') }} 업데이트
        </small>
        <small v-else-if="error">기존 Mock Data로 안전하게 표시합니다.</small>
      </div>
    </div>
    <Button
      v-if="error && !loading"
      type="button"
      label="다시 불러오기"
      icon="pi pi-refresh"
      size="small"
      severity="warn"
      @click="$emit('retry')"
    />
  </Message>
</template>

<style scoped>
.api-status {
  margin-bottom: 18px;
  padding: 0;
  border: 1px solid #bfe6d5;
  border-radius: 14px;
  background: #eefaf5;
  color: #287555;
}

.api-status :deep(.p-message-content) {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 16px;
}

.api-status.error {
  border-color: #f0d7b5;
  background: #fff8ed;
  color: #8a6229;
}

.status-copy {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
}

.status-copy div {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.status-copy strong {
  font-size: 13px;
}

.status-copy small {
  margin-top: 2px;
  color: inherit;
  font-size: 11px;
  opacity: 0.9;
}

.api-icon {
  font-size: 19px;
}

.api-status :deep(.p-button) {
  flex: 0 0 auto;
  padding: 7px 10px;
  border: 0;
  border-radius: 8px;
  background: #8a6229;
  color: #fff;
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
}

@media (max-width: 640px) {
  .api-status :deep(.p-message-content) {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
