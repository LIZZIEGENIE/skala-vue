<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TouristAttractions from '../components/exercise/TouristAttractions.vue'
import { weatherCityMap } from '../data/weatherCities'
import {
  fetchTouristAttractions,
  getTourismApiErrorMessage,
  hasOpenTripMapApiKey,
} from '../services/tourismApi'
import {
  fetchAirQuality,
  fetchCurrentWeather,
  fetchWeatherForecast,
  getWeatherApiErrorMessage,
} from '../services/weatherApi'
import { useConfigStore } from '../stores/configStore'

const route = useRoute()
const router = useRouter()

const mockDetails = Object.fromEntries(
  Object.entries(weatherCityMap).map(([id, city]) => [id, { ...city, name: city.fullName }]),
)

const cityData = ref(null)
const forecastList = ref([])
const airQuality = ref(null)
const isApiLoading = ref(false)
const detailApiError = ref('')
const touristAttractions = ref([])
const isTourismLoading = ref(false)
const tourismApiError = ref('')
const configStore = useConfigStore()

const convertTemperature = (rawTemp) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
}

const displayTemp = computed(() => (cityData.value ? convertTemperature(cityData.value.temp) : ''))
const displayFeelsLike = computed(() =>
  cityData.value ? convertTemperature(cityData.value.feelsLike) : '',
)
const displayUnitSymbol = computed(() => configStore.unitSymbol)
const displayForecastList = computed(() =>
  forecastList.value.map((forecast) => ({
    ...forecast,
    displayTemp: convertTemperature(forecast.temp),
  })),
)
const airQualityLabel = computed(() => {
  const aqi = airQuality.value?.aqi
  if (aqi == null) return ''
  if (aqi <= 50) return '좋음'
  if (aqi <= 100) return '보통'
  if (aqi <= 150) return '민감군 주의'
  if (aqi <= 200) return '나쁨'
  if (aqi <= 300) return '매우 나쁨'
  return '위험'
})

const formatForecastTime = (timestamp) =>
  new Intl.DateTimeFormat('ko-KR', {
    weekday: 'short',
    hour: 'numeric',
  }).format(new Date(timestamp))

const loadDetailApiData = async () => {
  if (!cityData.value) return

  isApiLoading.value = true
  detailApiError.value = ''

  const [currentResult, forecastResult, airQualityResult] = await Promise.allSettled([
    fetchCurrentWeather(cityData.value),
    fetchWeatherForecast(cityData.value),
    fetchAirQuality(cityData.value),
  ])
  const errors = []

  if (currentResult.status === 'fulfilled') {
    cityData.value = currentResult.value
    configStore.addRecentCity(cityData.value)
  } else {
    errors.push(getWeatherApiErrorMessage(currentResult.reason))
  }

  if (forecastResult.status === 'fulfilled') {
    forecastList.value = forecastResult.value
  } else {
    errors.push(getWeatherApiErrorMessage(forecastResult.reason))
  }

  if (airQualityResult.status === 'fulfilled') {
    airQuality.value = airQualityResult.value
  } else {
    errors.push('Open-Meteo 대기질 데이터를 불러오지 못했습니다.')
  }

  detailApiError.value = [...new Set(errors)].join(' ')
  isApiLoading.value = false
}

const loadTouristAttractions = async () => {
  if (!cityData.value || !hasOpenTripMapApiKey) return

  isTourismLoading.value = true
  tourismApiError.value = ''

  try {
    touristAttractions.value = await fetchTouristAttractions(cityData.value)
  } catch (error) {
    tourismApiError.value = getTourismApiErrorMessage(error)
  } finally {
    isTourismLoading.value = false
  }
}

// 동적 경로의 cityId를 기준으로 Mount 시점에 Mock Data에서 도시를 선택합니다.
onMounted(() => {
  cityData.value = mockDetails[route.params.cityId] ?? null

  if (cityData.value) {
    configStore.addRecentCity(cityData.value)
    loadDetailApiData()
    loadTouristAttractions()
  }
})

const goHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <section class="detail-view">
    <div class="view-heading">
      <span class="view-kicker">WEATHER & TRAVEL</span>
      <h2>도시 날씨와 여행 정보</h2>
      <p>도시의 실시간 날씨를 확인하고 주변의 유명 관광지를 함께 살펴보세요.</p>
    </div>

    <article v-if="cityData" class="detail-card">
      <div class="detail-summary">
        <div>
          <span class="city-code">{{ cityData.id.toUpperCase() }}</span>
          <h3>📍 {{ cityData.name }}</h3>
          <p>{{ cityData.status }} 상태의 실시간 관측 정보</p>
        </div>
        <span class="detail-icon" aria-hidden="true">{{ cityData.icon }}</span>
      </div>

      <div class="observation-grid">
        <div class="observation primary">
          <span>실시간 기온</span>
          <strong
            >{{ displayTemp }}<small>{{ displayUnitSymbol }}</small></strong
          >
        </div>
        <div class="observation">
          <span>체감 온도</span>
          <strong>{{ displayFeelsLike }}{{ displayUnitSymbol }}</strong>
        </div>
        <div class="observation">
          <span>대기 습도</span>
          <strong>{{ cityData.humidity }}</strong>
        </div>
        <div class="observation">
          <span>현재 풍속</span>
          <strong>{{ cityData.wind }}</strong>
        </div>
      </div>
    </article>

    <div v-else class="missing-city">
      <span aria-hidden="true">🌫️</span>
      <h3>도시 관측 데이터를 찾을 수 없습니다.</h3>
      <p>주소의 도시 코드를 확인하거나 메인 대시보드에서 도시를 다시 선택해 주세요.</p>
    </div>

    <div v-if="cityData" class="api-extension">
      <div v-if="isApiLoading" class="api-notice loading" aria-live="polite">
        ⏳ 상세 날씨와 대기질 데이터를 불러오는 중입니다.
      </div>
      <div v-else-if="detailApiError" class="api-notice error" aria-live="polite">
        ⚠️ {{ detailApiError }}
      </div>

      <section v-if="displayForecastList.length" class="extension-card forecast-section">
        <div class="extension-heading">
          <div>
            <span class="view-kicker">OPENWEATHER FORECAST</span>
            <h3>24시간 날씨 예보</h3>
          </div>
          <a href="https://openweathermap.org/forecast5" target="_blank" rel="noreferrer">
            OpenWeatherMap
          </a>
        </div>

        <div class="forecast-list">
          <article v-for="forecast in displayForecastList" :key="forecast.timestamp">
            <span>{{ formatForecastTime(forecast.timestamp) }}</span>
            <b aria-hidden="true">{{ forecast.icon }}</b>
            <strong>{{ forecast.displayTemp }}{{ displayUnitSymbol }}</strong>
            <small>강수 {{ forecast.precipitationProbability }}%</small>
          </article>
        </div>
      </section>

      <section v-if="airQuality" class="extension-card air-section">
        <div class="extension-heading">
          <div>
            <span class="view-kicker">EXTERNAL AIR QUALITY API</span>
            <h3>현재 대기질</h3>
          </div>
          <a href="https://open-meteo.com/en/docs/air-quality-api" target="_blank" rel="noreferrer">
            Open-Meteo · CAMS
          </a>
        </div>

        <div class="air-grid">
          <div class="air-main">
            <span>미국 AQI</span>
            <strong>{{ airQuality.aqi }}</strong>
            <small>{{ airQualityLabel }}</small>
          </div>
          <dl>
            <div>
              <dt>PM2.5</dt>
              <dd>{{ airQuality.pm2_5 }} ㎍/㎥</dd>
            </div>
            <div>
              <dt>PM10</dt>
              <dd>{{ airQuality.pm10 }} ㎍/㎥</dd>
            </div>
            <div>
              <dt>자외선 지수</dt>
              <dd>{{ airQuality.uvIndex }}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>

    <TouristAttractions
      v-if="cityData"
      :city-name="cityData.name"
      :attractions="touristAttractions"
      :loading="isTourismLoading"
      :error="tourismApiError"
      :api-key-ready="hasOpenTripMapApiKey"
      @retry="loadTouristAttractions"
    />

    <button type="button" class="back-button" @click="goHome">
      <span aria-hidden="true">←</span> 메인 대시보드로 돌아가기
    </button>
  </section>
</template>

<style scoped>
.detail-view {
  padding: 28px;
  border: 1px solid rgba(125, 157, 185, 0.18);
  border-radius: 24px;
  background: #eef5fb;
  color: #17324d;
  box-shadow: 0 18px 42px rgba(43, 84, 126, 0.13);
}

.view-heading {
  margin-bottom: 20px;
}

.view-kicker,
.city-code {
  display: block;
  color: #4b9be6;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.view-heading h2 {
  margin: 5px 0 4px;
  color: #17324d;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.view-heading p,
.detail-summary p,
.missing-city p {
  margin: 0;
  color: #536f82;
  font-size: 14px;
}

.detail-card,
.missing-city {
  padding: 24px;
  border: 1px solid rgba(125, 157, 185, 0.16);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 28px rgba(69, 101, 132, 0.08);
}

.detail-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.detail-summary h3 {
  margin: 5px 0 2px;
  color: #17324d;
  font-size: 21px;
  font-weight: 800;
}

.detail-icon {
  font-size: 64px;
  filter: drop-shadow(0 10px 12px rgba(69, 97, 120, 0.14));
}

.observation-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.observation {
  padding: 14px;
  border-radius: 14px;
  background: #f3f8fc;
}

.observation.primary {
  background: #e8f4ff;
}

.observation span {
  display: block;
  margin-bottom: 6px;
  color: #7890a5;
  font-size: 12px;
  font-weight: 700;
}

.observation strong {
  color: #264a6b;
  font-size: 20px;
}

.observation small {
  margin-left: 2px;
  font-size: 12px;
}

.missing-city {
  text-align: center;
}

.missing-city > span {
  display: block;
  font-size: 54px;
}

.missing-city h3 {
  margin: 10px 0 6px;
}

.api-extension {
  margin-top: 18px;
}

.api-notice {
  margin-bottom: 12px;
  padding: 11px 14px;
  border-radius: 12px;
  background: #e8f4ff;
  color: #32658f;
  font-size: 12px;
  font-weight: 700;
}

.api-notice.error {
  background: #fff6e8;
  color: #8a6229;
}

.extension-card {
  margin-top: 12px;
  padding: 20px;
  border: 1px solid rgba(125, 157, 185, 0.16);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 28px rgba(69, 101, 132, 0.08);
}

.extension-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}

.extension-heading h3 {
  margin: 4px 0 0;
  color: #17324d;
  font-size: 18px;
  font-weight: 800;
}

.extension-heading a {
  color: #4b83b5;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.forecast-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.forecast-list article {
  display: flex;
  align-items: center;
  padding: 11px 8px;
  border-radius: 12px;
  background: #f3f8fc;
  flex-direction: column;
  text-align: center;
}

.forecast-list span,
.forecast-list small {
  color: #586f83;
  font-size: 11px;
}

.forecast-list b {
  margin: 5px 0;
  font-size: 21px;
}

.forecast-list strong {
  color: #264a6b;
  font-size: 14px;
}

.air-grid {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 12px;
}

.air-main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  border-radius: 14px;
  background: #eaf8f2;
  color: #287555;
  flex-direction: column;
}

.air-main span,
.air-main small {
  font-size: 12px;
  font-weight: 700;
}

.air-main strong {
  font-size: 30px;
}

.air-grid dl {
  display: grid;
  margin: 0;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.air-grid dl div {
  padding: 13px 10px;
  border-radius: 12px;
  background: #f3f8fc;
}

.air-grid dt {
  color: #7890a5;
  font-size: 12px;
}

.air-grid dd {
  margin: 5px 0 0;
  color: #264a6b;
  font-size: 13px;
  font-weight: 800;
}

.back-button {
  margin-top: 18px;
  padding: 10px 16px;
  border: 0;
  border-radius: 10px;
  background: #294d6c;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
}

.back-button:hover {
  background: #173a58;
}

@media (max-width: 640px) {
  .detail-view {
    padding: 18px;
  }

  .observation-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .forecast-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .air-grid {
    grid-template-columns: 1fr;
  }

  .air-grid dl {
    grid-template-columns: 1fr;
  }

  .detail-icon {
    font-size: 48px;
  }
}
</style>
