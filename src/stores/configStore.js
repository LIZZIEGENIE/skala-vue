import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  // state: 날씨 단위(초기값 섭씨)
  const unit = ref('celsius')

  // 요구사항 4번 추가 state: 사용자가 단위를 변경한 횟수
  const toggleCount = ref(0)

  // 추가 state: 최근 조회한 도시와 최대 저장 개수
  const recentCities = ref([])
  const maxRecentCities = ref(5)

  // getter: 현재 단위에 맞는 기호
  const unitSymbol = computed(() => (unit.value === 'celsius' ? '℃' : '℉'))

  // 요구사항 4번 추가 getter: 현재 단위 상태를 한글로 표시
  const unitLabel = computed(() => (unit.value === 'celsius' ? '섭씨' : '화씨'))

  // 추가 getters: 최근 조회 개수와 가장 최근에 조회한 도시
  const recentCount = computed(() => recentCities.value.length)
  const latestCity = computed(() => recentCities.value[0] ?? null)

  // action: 섭씨와 화씨를 토글하고 변경 횟수를 누적
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
    toggleCount.value += 1
  }

  // 추가 action: 중복 없이 최근 조회 도시를 앞쪽에 저장하고 최대 5개만 유지
  function addRecentCity(city) {
    const recentCity = {
      id: city.id,
      name: city.name,
      status: city.status,
      icon: city.icon,
    }

    const citiesWithoutDuplicate = recentCities.value.filter((item) => item.id !== city.id)
    recentCities.value = [recentCity, ...citiesWithoutDuplicate].slice(0, maxRecentCities.value)
  }

  // 추가 action: 최근 조회 기록 전체 삭제
  function clearRecentCities() {
    recentCities.value = []
  }

  return {
    unit,
    toggleCount,
    recentCities,
    maxRecentCities,
    unitSymbol,
    unitLabel,
    recentCount,
    latestCity,
    toggleUnit,
    addRecentCity,
    clearRecentCities,
  }
})
