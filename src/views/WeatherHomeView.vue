<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Select from 'primevue/select'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import RecentCitiesPanel from '../components/exercise/RecentCitiesPanel.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherApiStatus from '../components/exercise/WeatherApiStatus.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import WeatherHero from '../components/exercise/WeatherHero.vue'
import WeatherTravelIntro from '../components/exercise/WeatherTravelIntro.vue'
import { weatherCities } from '../data/weatherCities'
import {
  fetchCurrentWeatherList,
  fetchTodayTemperatureSummaryList,
  getWeatherApiErrorMessage,
} from '../services/weatherApi'

const route = useRoute()
const router = useRouter()

// API 실패 시에도 화면과 이전 과제 기능이 유지되도록 초기 Mock Data를 보존합니다.
const weatherList = ref(weatherCities.map((city) => ({ ...city })))
const isWeatherLoading = ref(false)
const weatherApiError = ref('')
const lastUpdated = ref(null)
const todaySummaries = ref({})
const isTodaySummaryLoading = ref(false)
const todaySummaryLoaded = ref(false)
const todaySummaryError = ref('')

const todayLabel = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
}).format(new Date())

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const heroModeOptions = [
  {
    value: 'now',
    buttonLabel: '현재',
    eyebrow: 'WEATHER NOW',
    title: '날씨 따라 떠나는 도시 여행',
    description: '실시간 날씨를 확인하고 그 도시의 유명 관광지까지 발견하세요.',
    sectionTitle: '도시별 날씨와 여행',
    sectionKicker: 'WEATHER & DESTINATION',
  },
  {
    value: 'today',
    buttonLabel: '오늘',
    eyebrow: "TODAY'S WEATHER",
    title: '오늘 날씨에 어울리는 여행',
    description: '현재 기온과 오늘의 최저·최고 기온을 보고 여행을 준비하세요.',
    sectionTitle: '오늘 날씨와 도시 여행',
    sectionKicker: 'TODAY SUMMARY',
  },
  {
    value: 'city',
    buttonLabel: '도시',
    eyebrow: 'CITY WEATHER',
    title: '세계 도시로 떠나볼까요?',
    description: '각 국가의 대표 도시 날씨와 꼭 가볼 만한 명소를 만나보세요.',
    sectionTitle: '국가별 대표 여행 도시',
    sectionKicker: 'CITY TRAVEL GUIDE',
  },
]
const selectedHeroMode = ref('now')
const activeHeroMode = computed(() =>
  heroModeOptions.find((option) => option.value === selectedHeroMode.value),
)
const heroEyebrowLabel = computed(() => activeHeroMode.value.eyebrow)

const modeWeatherList = computed(() => {
  if (selectedHeroMode.value === 'city') {
    return weatherList.value.filter((item) => item.isRepresentative)
  }

  return weatherList.value
})

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return modeWeatherList.value
  return modeWeatherList.value.filter(
    (item) => item.name.includes(query) || item.country.includes(query),
  )
})

const temperatureCategoryOptions = [
  { value: 'all', label: '전체', icon: '✨' },
  { value: 'hot', label: '더움', icon: '☀️' },
  { value: 'cool', label: '선선함', icon: '🌤️' },
  { value: 'cold', label: '추움', icon: '❄️' },
]
const temperatureCategoryLabels = Object.fromEntries(
  temperatureCategoryOptions.map((category) => [category.value, category.label]),
)
const selectedTemperatureCategory = ref('all')

const categorizedWeatherList = computed(() => {
  if (selectedTemperatureCategory.value === 'all') return filteredWeatherList.value

  return filteredWeatherList.value.filter((item) => {
    if (selectedTemperatureCategory.value === 'hot') return item.temp >= 25
    if (selectedTemperatureCategory.value === 'cool') return item.temp >= 10 && item.temp < 25
    return item.temp < 10
  })
})

const sortOrder = ref('default')
const sortOptions = [
  { label: '기본 순서', value: 'default' },
  { label: '높은 순', value: 'highest' },
  { label: '낮은 순', value: 'lowest' },
]

const sortedWeatherList = computed(() => {
  const list = [...categorizedWeatherList.value]

  if (sortOrder.value === 'highest') return list.sort((a, b) => b.temp - a.temp)
  if (sortOrder.value === 'lowest') return list.sort((a, b) => a.temp - b.temp)
  return list
})

const loadWeatherData = async () => {
  isWeatherLoading.value = true
  weatherApiError.value = ''

  try {
    const { weatherList: liveWeatherList, failedCount } =
      await fetchCurrentWeatherList(weatherCities)
    const liveWeatherMap = new Map(liveWeatherList.map((city) => [city.id, city]))

    weatherList.value = weatherCities.map((city) => liveWeatherMap.get(city.id) ?? { ...city })
    lastUpdated.value = new Date()

    if (failedCount > 0) {
      weatherApiError.value = `${failedCount}개 도시는 API 호출에 실패해 Mock Data로 표시됩니다.`
    }
  } catch (error) {
    weatherApiError.value = getWeatherApiErrorMessage(error)
  } finally {
    isWeatherLoading.value = false
  }
}

const loadTodaySummaries = async () => {
  if (todaySummaryLoaded.value || isTodaySummaryLoading.value) return

  isTodaySummaryLoading.value = true
  todaySummaryError.value = ''

  try {
    const { summaries, failedCount } = await fetchTodayTemperatureSummaryList(weatherList.value)
    const summaryObject = {}

    summaries.forEach((summary) => {
      const city = weatherList.value.find((item) => item.id === summary.cityId)
      const currentTemp = city?.temp ?? summary.minTemp

      summaryObject[summary.cityId] = {
        minTemp: Math.min(currentTemp, summary.minTemp),
        maxTemp: Math.max(currentTemp, summary.maxTemp),
      }
    })

    todaySummaries.value = summaryObject
    todaySummaryLoaded.value = true

    if (failedCount > 0) {
      todaySummaryError.value = `${failedCount}개 도시의 오늘 기온 요약을 불러오지 못했습니다.`
    }
  } catch (error) {
    todaySummaryError.value = getWeatherApiErrorMessage(error)
  } finally {
    isTodaySummaryLoading.value = false
  }
}

onMounted(() => {
  if (typeof route.query.search === 'string') {
    searchQuery.value = route.query.search
  }

  loadWeatherData()
})

watch(searchQuery, (newQuery) => {
  router.replace({
    name: 'WeatherHome',
    query: { search: newQuery.trim() || undefined },
  })
})

watch(selectedCityInfo, (newInfo) => {
  console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

watchEffect(() => {
  console.log(
    `🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`,
  )
})

watch(sortOrder, (newOrder, oldOrder) => {
  console.log(
    `🌡️ [watch 감지] 기온 정렬 기준이 '${oldOrder}'에서 '${newOrder}'(으)로 변경되었습니다.`,
  )
})

watch(selectedTemperatureCategory, (newCategory, oldCategory) => {
  const newLabel = temperatureCategoryLabels[newCategory]
  const oldLabel = temperatureCategoryLabels[oldCategory]

  console.log(
    `🌤️ [watch 감지] 온도 카테고리가 '${oldLabel}'에서 '${newLabel}'(으)로 변경되었습니다.`,
  )
  selectedCityInfo.value = `${newLabel} 카테고리: ${categorizedWeatherList.value.length}개의 도시가 표시됩니다.`
})

watch(selectedHeroMode, (newMode) => {
  const modeLabel = heroModeOptions.find((option) => option.value === newMode)?.buttonLabel
  selectedCityInfo.value = `${modeLabel} 보기: ${modeWeatherList.value.length}개의 도시가 표시됩니다.`

  if (newMode === 'today') {
    loadTodaySummaries()
  }
})

// 상세보기는 alert 대신 도시 ID가 포함된 동적 경로로 이동합니다.
const handleDetailJump = (cityId) => {
  router.push('/weather/' + cityId)
}
</script>

<template>
  <div class="weather-app">
    <WeatherHero
      :today-label="todayLabel"
      :eyebrow-label="heroEyebrowLabel"
      :hero-title="activeHeroMode.title"
      :hero-description="activeHeroMode.description"
      :mode-options="heroModeOptions"
      :active-mode="selectedHeroMode"
      @update-mode="(mode) => (selectedHeroMode = mode)"
    />

    <div class="dashboard-content">
      <BaseDashboardCard variant="search">
        <SearchBar
          :current-query="searchQuery"
          :result-count="sortedWeatherList.length"
          @update-query="(value) => (searchQuery = value)"
        />
      </BaseDashboardCard>

      <WeatherApiStatus
        :loading="isWeatherLoading"
        :error="weatherApiError"
        :last-updated="lastUpdated"
        @retry="loadWeatherData"
      />

      <WeatherTravelIntro />

      <RecentCitiesPanel @select-city="handleDetailJump" />

      <BaseDashboardCard>
        <div class="list-header">
          <div>
            <span class="section-kicker">{{ activeHeroMode.sectionKicker }}</span>
            <h3>{{ activeHeroMode.sectionTitle }}</h3>
          </div>
          <div class="sort-control">
            <span>기온 정렬</span>
            <Select
              v-model="sortOrder"
              :options="sortOptions"
              option-label="label"
              option-value="value"
              size="small"
              class="sort-select"
              aria-label="기온 정렬 기준"
            />
          </div>
        </div>

        <div v-if="selectedHeroMode === 'today'" class="today-summary-status" aria-live="polite">
          <span v-if="isTodaySummaryLoading">⏳ 오늘 하루의 기온을 불러오는 중입니다.</span>
          <span v-else-if="todaySummaryError">⚠️ {{ todaySummaryError }}</span>
          <span v-else>🌡️ 현재 기온과 오늘의 최저·최고 기온을 함께 표시합니다.</span>
        </div>

        <div class="category-filter" role="group" aria-label="온도 카테고리 필터">
          <Button
            v-for="category in temperatureCategoryOptions"
            :key="category.value"
            type="button"
            :label="`${category.icon} ${category.label}`"
            severity="secondary"
            size="small"
            :text="selectedTemperatureCategory !== category.value"
            :outlined="selectedTemperatureCategory === category.value"
            class="category-button"
            :class="{ active: selectedTemperatureCategory === category.value }"
            :aria-pressed="selectedTemperatureCategory === category.value"
            @click="selectedTemperatureCategory = category.value"
          />
        </div>

        <div class="weather-grid">
          <WeatherCard
            v-for="item in sortedWeatherList"
            :key="item.id"
            :city-item="item"
            :display-mode="selectedHeroMode"
            :today-summary="todaySummaries[item.id]"
            :summary-loading="isTodaySummaryLoading"
            @select-card="(message) => (selectedCityInfo = message)"
            @click-detail="handleDetailJump(item.id)"
          />

          <div v-if="filteredWeatherList.length === 0" class="empty-state">
            <span aria-hidden="true">🌫️</span>
            <strong>도시를 찾지 못했어요</strong>
            <p>다른 도시 이름으로 다시 검색해 주세요.</p>
          </div>
          <div v-else-if="categorizedWeatherList.length === 0" class="empty-state">
            <span aria-hidden="true">🧭</span>
            <strong>해당하는 날씨가 없어요</strong>
            <p>다른 온도 카테고리를 선택해 주세요.</p>
          </div>
        </div>
      </BaseDashboardCard>

      <div class="status-bar">
        <span class="status-dot" aria-hidden="true"></span>
        {{ selectedCityInfo }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-app {
  width: min(100%, 780px);
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 22px;
  background:
    linear-gradient(180deg, #f7f1e7 0%, #f1f6f1 100%);
  color: #24484a;
  box-shadow: 0 24px 60px rgba(52, 71, 65, 0.16);
}

.section-kicker {
  display: block;
  margin-bottom: 4px;
  color: #d2694d;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.dashboard-content {
  padding: 24px;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;
}

.list-header h3 {
  margin: 0;
  color: #24484a;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #536e75;
  font-size: 13px;
  font-weight: 700;
}

.sort-select {
  min-width: 126px;
  border: 1px solid #dce8f1;
  border-radius: 10px;
  background: #f7fbfe;
  color: #36536d;
}

.sort-select :deep(.p-select-label) {
  padding: 8px 10px;
  font-size: 13px;
}

.category-filter {
  display: flex;
  gap: 6px;
  margin-bottom: 20px;
  padding: 5px;
  overflow-x: auto;
  border-radius: 14px;
  border: 1px solid rgba(190, 155, 114, 0.12);
  background: #f8f3e9;
}

.today-summary-status {
  margin: -6px 0 16px;
  padding: 10px 12px;
  border-radius: 11px;
  background: #eef6fd;
  color: #3e617c;
  font-size: 12px;
  font-weight: 700;
}

.category-button {
  display: inline-flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 9px 12px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #637d93;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  transition:
    transform 0.2s,
    color 0.2s,
    background-color 0.2s,
    box-shadow 0.2s;
}

.category-button:hover {
  color: #c76148;
  transform: translateY(-1px);
}

.category-button.active {
  background: #fff;
  color: #bd5d45;
  box-shadow: 0 4px 12px rgba(118, 86, 56, 0.1);
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.empty-state {
  grid-column: 1 / -1;
  padding: 42px 20px;
  border: 1px dashed #c8d9e7;
  border-radius: 18px;
  background: #f8fbfd;
  color: #6e8498;
  text-align: center;
}

.empty-state > span {
  display: block;
  margin-bottom: 10px;
  font-size: 38px;
}

.empty-state strong {
  display: block;
  color: #36536d;
  font-size: 15px;
  font-weight: 800;
}

.empty-state p {
  margin: 5px 0 0;
  font-size: 12px;
}

.status-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid rgba(43, 156, 104, 0.12);
  border-radius: 14px;
  background: #eaf8f2;
  color: #287555;
  font-size: 13px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #36bf83;
  box-shadow: 0 0 0 4px rgba(54, 191, 131, 0.12);
}

@media (max-width: 640px) {
  .weather-app {
    border-radius: 22px;
  }

  .dashboard-content {
    padding: 14px;
  }

  .list-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .sort-control {
    justify-content: space-between;
    width: 100%;
  }

  .category-filter {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    overflow: visible;
  }

  .category-button {
    width: 100%;
  }

  .weather-grid {
    grid-template-columns: 1fr;
  }
}
</style>
