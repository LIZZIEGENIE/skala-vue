<script setup>
import { useConfigStore } from '@/stores/configStore'

const emit = defineEmits(['select-city'])
const configStore = useConfigStore()
</script>

<template>
  <section class="recent-panel" aria-labelledby="recent-city-title">
    <div class="recent-heading">
      <div>
        <span class="recent-kicker">RECENTLY VIEWED</span>
        <div class="title-row">
          <h3 id="recent-city-title">최근 조회 도시</h3>
          <span class="count-badge">
            {{ configStore.recentCount }}/{{ configStore.maxRecentCities }}
          </span>
        </div>
      </div>

      <button
        v-if="configStore.recentCount > 0"
        type="button"
        class="clear-button"
        @click="configStore.clearRecentCities"
      >
        전체 삭제
      </button>
    </div>

    <div v-if="configStore.recentCount === 0" class="recent-empty">
      <span aria-hidden="true">🕘</span>
      <p>도시 상세보기를 열면 최근 조회 목록에 표시됩니다.</p>
    </div>

    <div v-else class="recent-list" aria-label="최근 조회한 도시 목록">
      <button
        v-for="city in configStore.recentCities"
        :key="city.id"
        type="button"
        class="recent-city"
        @click="emit('select-city', city.id)"
      >
        <span class="city-icon" aria-hidden="true">{{ city.icon }}</span>
        <span class="city-copy">
          <strong>{{ city.name }}</strong>
          <small>{{ configStore.latestCity?.id === city.id ? '최근 조회' : city.status }}</small>
        </span>
        <span class="move-icon" aria-hidden="true">→</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.recent-panel {
  margin-bottom: 18px;
  padding: 20px 24px;
  border: 1px solid rgba(178, 148, 110, 0.16);
  border-radius: 16px;
  background: linear-gradient(135deg, #fffdf8, #f8f0e4);
  box-shadow: 0 10px 28px rgba(89, 75, 56, 0.07);
}

.recent-heading,
.title-row,
.recent-city {
  display: flex;
  align-items: center;
}

.recent-heading {
  justify-content: space-between;
  gap: 16px;
}

.recent-kicker {
  display: block;
  margin-bottom: 4px;
  color: #cf674c;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.title-row {
  gap: 8px;
}

.title-row h3 {
  margin: 0;
  color: #29484a;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.count-badge {
  padding: 3px 7px;
  border-radius: 999px;
  background: #fbe7dc;
  color: #bd6048;
  font-size: 11px;
  font-weight: 800;
}

.clear-button {
  padding: 6px 9px;
  border: 1px solid #dce8f1;
  border-radius: 8px;
  background: #fff;
  color: #70869a;
  cursor: pointer;
  font-size: 11px;
  font-weight: 700;
}

.clear-button:hover {
  border-color: #ffb7b7;
  color: #d75959;
}

.recent-empty {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding: 11px 13px;
  border-radius: 12px;
  border: 1px dashed #ddc7aa;
  background: rgba(255, 250, 241, 0.76);
  color: #7e776b;
}

.recent-empty p {
  margin: 0;
  font-size: 12px;
}

.recent-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
  gap: 8px;
  margin-top: 14px;
}

.recent-city {
  min-width: 0;
  gap: 8px;
  padding: 10px;
  border: 1px solid #e1ebf3;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  color: #294d6c;
  cursor: pointer;
  text-align: left;
  transition:
    border-color 0.2s,
    transform 0.2s;
}

.recent-city:hover {
  border-color: #86bdf0;
  transform: translateY(-2px);
}

.city-icon {
  font-size: 20px;
}

.city-copy {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
}

.city-copy strong {
  overflow: hidden;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.city-copy small {
  color: #627982;
  font-size: 11px;
}

.move-icon {
  color: #4b9be6;
  font-weight: 800;
}

@media (max-width: 640px) {
  .recent-panel {
    padding: 18px;
  }

  .recent-list {
    grid-template-columns: 1fr;
  }
}
</style>
