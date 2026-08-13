<script setup>
import { computed } from 'vue'
import Tag from 'primevue/tag'
import { useConfigStore } from '@/stores/configStore'

// 부모로부터 표시할 도시 객체를 전달받습니다.
const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
  displayMode: {
    type: String,
    default: 'now',
  },
  todaySummary: {
    type: Object,
    default: null,
  },
  summaryLoading: {
    type: Boolean,
    default: false,
  },
})

// 카드 선택과 상세보기 동작은 부모가 처리하도록 이벤트로 전달합니다.
const emit = defineEmits(['select-card', 'click-detail'])

const weatherStatusIcons = {
  맑음: '☀️',
  구름: '⛅',
  흐림: '☁️',
  비: '🌧️',
  눈: '🌨️',
  천둥: '⛈️',
  안개: '🌫️',
  바람: '💨',
  강풍: '🌪️',
}

const configStore = useConfigStore()

const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

const displayUnitSymbol = computed(() => configStore.unitSymbol)
const convertTemperature = (temperature) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((temperature * 9) / 5 + 32)
  }
  return temperature
}
const displayMinTemp = computed(() =>
  props.todaySummary ? convertTemperature(props.todaySummary.minTemp) : '',
)
const displayMaxTemp = computed(() =>
  props.todaySummary ? convertTemperature(props.todaySummary.maxTemp) : '',
)
const temperatureMeta = computed(() => {
  if (props.cityItem.temp >= 25) return { label: '더움', severity: 'danger', className: 'hot' }
  if (props.cityItem.temp >= 10) return { label: '선선함', severity: 'info', className: 'cool' }
  return { label: '추움', severity: 'secondary', className: 'cold' }
})
</script>

<template>
  <article
    class="weather-card"
    :class="{
      'weather-card--hot': cityItem.temp >= 25,
      'weather-card--cool': cityItem.temp >= 10 && cityItem.temp < 25,
      'weather-card--cold': cityItem.temp < 10,
    }"
    @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)"
  >
    <div class="card-heading">
      <div>
        <span class="city-label">📍 {{ cityItem.country }}</span>
        <h4>{{ cityItem.name }}</h4>
      </div>
      <div class="destination-stamp">
        <span>DESTINATION</span>
        <b>{{ cityItem.id.replace('city_', 'NO.') }}</b>
      </div>
    </div>

    <div class="weather-brief">
      <span class="weather-icon" aria-hidden="true">
        {{ weatherStatusIcons[cityItem.status] ?? '🌤️' }}
      </span>
      <div>
        <small>CURRENT WEATHER</small>
        <div class="temperature">
          <strong>{{ displayTemp }}</strong
          ><span>{{ displayUnitSymbol }}</span>
        </div>
      </div>
    </div>
    <p class="weather-status">{{ cityItem.status }}</p>

    <p class="travel-preview"><span aria-hidden="true">🧭</span> 이 도시의 추천 명소 보기</p>

    <div v-if="displayMode === 'today'" class="today-summary">
      <span v-if="summaryLoading">오늘 기온 확인 중...</span>
      <template v-else-if="todaySummary">
        <span
          >최저 <strong>{{ displayMinTemp }}{{ displayUnitSymbol }}</strong></span
        >
        <span
          >최고 <strong>{{ displayMaxTemp }}{{ displayUnitSymbol }}</strong></span
        >
      </template>
      <span v-else>오늘 기온 요약 없음</span>
    </div>

    <p v-if="displayMode === 'city'" class="representative-label">
      {{ cityItem.country }} 대표 도시
    </p>

    <div class="card-footer">
      <Tag
        :value="temperatureMeta.label"
        :severity="temperatureMeta.severity"
        :class="['badge', temperatureMeta.className]"
      />

      <button
        type="button"
        class="btn-detail"
        @click.stop="emit('click-detail', cityItem.name, cityItem.status)"
      >
        날씨·관광 보기 <span aria-hidden="true">→</span>
      </button>
    </div>
  </article>
</template>

<style scoped>
.weather-card {
  position: relative;
  min-width: 0;
  margin: 0;
  padding: 18px;
  overflow: hidden;
  border: 1px solid rgba(182, 148, 109, 0.19);
  border-radius: 14px;
  background: #fffdf8;
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(91, 76, 57, 0.08);
  transition:
    transform 0.22s,
    box-shadow 0.22s;
}

.weather-card::before {
  position: absolute;
  top: -30px;
  right: -30px;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 1px dashed rgba(224, 108, 76, 0.2);
  background: rgba(239, 153, 104, 0.06);
  content: '';
}

.weather-card:hover {
  z-index: 1;
  transform: translateY(-4px);
  border-color: rgba(218, 107, 76, 0.35);
  box-shadow: 0 14px 30px rgba(91, 76, 57, 0.14);
}

.weather-card--hot {
  background: linear-gradient(145deg, #fffdf8 0%, #fff2e5 100%);
}

.weather-card--cool {
  background: linear-gradient(145deg, #fffdf8 0%, #eef7f1 100%);
}

.weather-card--cold {
  background: linear-gradient(145deg, #fffdf8 0%, #edf4f3 100%);
}

.card-heading,
.card-footer {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.city-label {
  display: block;
  margin-bottom: 4px;
  color: #d06c50;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.card-heading h4 {
  margin: 0;
  color: #213f43;
  font-size: 23px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.destination-stamp {
  display: flex;
  width: 64px;
  height: 54px;
  align-items: center;
  justify-content: center;
  border: 1px dashed #d69478;
  border-radius: 50%;
  color: #bd674e;
  flex-direction: column;
  transform: rotate(7deg);
}

.destination-stamp span {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.03em;
}

.destination-stamp b {
  font-size: 12px;
}

.weather-brief {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 15px;
  padding: 11px 12px;
  border-radius: 11px;
  background: rgba(231, 242, 237, 0.76);
}

.weather-brief > div > small {
  color: #526f66;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.weather-icon {
  font-size: 36px;
  filter: drop-shadow(0 7px 7px rgba(69, 97, 120, 0.1));
}

.temperature {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  margin-top: 0;
  color: #244b4a;
}

.temperature strong {
  font-size: 34px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.06em;
}

.temperature span {
  margin: 4px 0 0 3px;
  color: #688196;
  font-size: 14px;
  font-weight: 700;
}

.weather-status {
  position: relative;
  z-index: 1;
  margin: 8px 0 6px;
  color: #4f6963;
  font-size: 14px;
  font-weight: 700;
}

.travel-preview {
  position: relative;
  z-index: 1;
  margin: 0 0 15px;
  color: #c6654b;
  font-size: 12px;
  font-weight: 700;
}

.today-summary {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 8px;
  margin: -7px 0 14px;
  color: #6e8498;
  font-size: 11px;
}

.today-summary span {
  padding: 5px 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.72);
}

.today-summary strong {
  margin-left: 3px;
  color: #294d6c;
  font-weight: 800;
}

.representative-label {
  position: relative;
  z-index: 1;
  margin: -7px 0 14px;
  color: #4b83b5;
  font-size: 11px;
  font-weight: 700;
}

.badge {
  display: inline-block;
  padding: 5px 9px;
  border-radius: 999px;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
}

.hot {
  background: #ff755d;
}

.cool {
  background: #48a3ef;
}

.cold {
  background: #607ee8;
}

.btn-detail {
  position: static;
  padding: 7px 10px;
  border: 1px solid #cce9de;
  border-radius: 9px;
  background: #eef9f5;
  color: #357b67;
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
}

.btn-detail:hover {
  border-color: #7ac2aa;
  background: #def4eb;
  color: #246753;
}
</style>
