import axios from 'axios'

// .env.local에 저장한 OpenWeatherMap API Key를 불러옵니다.
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || ''

const openWeatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 10000,
})

const openMeteoClient = axios.create({
  baseURL: 'https://air-quality-api.open-meteo.com/v1',
  timeout: 10000,
})

export const hasOpenWeatherApiKey = API_KEY.trim().length > 0

const weatherPresentation = {
  clear: { status: '맑음', icon: '☀️' },
  clouds: { status: '구름', icon: '⛅' },
  rain: { status: '비', icon: '🌧️' },
  drizzle: { status: '비', icon: '🌦️' },
  thunderstorm: { status: '천둥', icon: '⛈️' },
  snow: { status: '눈', icon: '🌨️' },
  mist: { status: '안개', icon: '🌫️' },
  smoke: { status: '안개', icon: '🌫️' },
  haze: { status: '안개', icon: '🌫️' },
  dust: { status: '안개', icon: '🌫️' },
  fog: { status: '안개', icon: '🌫️' },
  sand: { status: '안개', icon: '🌫️' },
  ash: { status: '안개', icon: '🌫️' },
  squall: { status: '바람', icon: '💨' },
  tornado: { status: '강풍', icon: '🌪️' },
}

const getPresentation = (weather) => {
  const presentation = weatherPresentation[weather?.main?.toLowerCase()]

  if (presentation?.status === '구름' && weather?.id >= 803) {
    return { status: '흐림', icon: '☁️' }
  }

  return presentation ?? { status: weather?.description ?? '정보 없음', icon: '🌤️' }
}

const requireApiKey = () => {
  if (!hasOpenWeatherApiKey) {
    throw new Error('.env.local의 VITE_OPENWEATHER_API_KEY에 발급받은 Key를 입력해 주세요.')
  }
}

const normalizeCurrentWeather = (city, data) => {
  const weather = data.weather?.[0]
  const presentation = getPresentation(weather)

  return {
    ...city,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    status: presentation.status,
    humidity: `${data.main.humidity}%`,
    wind: `${data.wind.speed}m/s`,
    icon: presentation.icon,
    description: weather?.description ?? presentation.status,
    observedAt: data.dt * 1000,
    source: 'OpenWeatherMap',
  }
}

export const fetchCurrentWeather = async (city) => {
  requireApiKey()

  const { data } = await openWeatherClient.get('/weather', {
    params: {
      lat: city.latitude,
      lon: city.longitude,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  return normalizeCurrentWeather(city, data)
}

export const fetchCurrentWeatherList = async (cities) => {
  const results = await Promise.allSettled(cities.map((city) => fetchCurrentWeather(city)))
  const weatherList = results.flatMap((result) =>
    result.status === 'fulfilled' ? [result.value] : [],
  )
  const failedCount = results.length - weatherList.length

  if (weatherList.length === 0) {
    const firstFailure = results.find((result) => result.status === 'rejected')
    throw firstFailure?.reason ?? new Error('날씨 데이터를 불러오지 못했습니다.')
  }

  return { weatherList, failedCount }
}

export const fetchWeatherForecast = async (city) => {
  requireApiKey()

  const { data } = await openWeatherClient.get('/forecast', {
    params: {
      lat: city.latitude,
      lon: city.longitude,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
      cnt: 8,
    },
  })

  return data.list.map((item) => {
    const weather = item.weather?.[0]
    const presentation = getPresentation(weather)

    return {
      timestamp: item.dt * 1000,
      temp: Math.round(item.main.temp),
      status: presentation.status,
      icon: presentation.icon,
      precipitationProbability: Math.round((item.pop ?? 0) * 100),
    }
  })
}

// 도시 현지 시간 기준으로 오늘 남은 시간대의 최저·최고 기온을 계산합니다.
export const fetchTodayTemperatureSummary = async (city) => {
  requireApiKey()

  const { data } = await openWeatherClient.get('/forecast', {
    params: {
      lat: city.latitude,
      lon: city.longitude,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  const timezoneOffset = data.city.timezone
  const todayKey = new Date(Date.now() + timezoneOffset * 1000).toISOString().slice(0, 10)
  const todayForecasts = data.list.filter((item) => {
    const forecastDate = new Date((item.dt + timezoneOffset) * 1000).toISOString().slice(0, 10)
    return forecastDate === todayKey
  })
  const temperatures = todayForecasts.flatMap((item) => [item.main.temp_min, item.main.temp_max])

  return {
    cityId: city.id,
    minTemp: temperatures.length ? Math.round(Math.min(...temperatures)) : city.temp,
    maxTemp: temperatures.length ? Math.round(Math.max(...temperatures)) : city.temp,
  }
}

export const fetchTodayTemperatureSummaryList = async (cities) => {
  const results = await Promise.allSettled(cities.map((city) => fetchTodayTemperatureSummary(city)))
  const summaries = results.flatMap((result) =>
    result.status === 'fulfilled' ? [result.value] : [],
  )

  return {
    summaries,
    failedCount: results.length - summaries.length,
  }
}

export const fetchAirQuality = async (city) => {
  const { data } = await openMeteoClient.get('/air-quality', {
    params: {
      latitude: city.latitude,
      longitude: city.longitude,
      current: 'us_aqi,pm10,pm2_5,uv_index',
      timezone: 'auto',
    },
  })

  return {
    aqi: Math.round(data.current.us_aqi),
    pm10: Math.round(data.current.pm10),
    pm2_5: Math.round(data.current.pm2_5),
    uvIndex: Number(data.current.uv_index.toFixed(1)),
    observedAt: data.current.time,
    source: 'Open-Meteo · CAMS',
  }
}

export const getWeatherApiErrorMessage = (error) => {
  if (error?.message?.includes('VITE_OPENWEATHER_API_KEY')) return error.message
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    return 'OpenWeatherMap API Key가 유효하지 않습니다.'
  }
  if (axios.isAxiosError(error) && error.response?.status === 429) {
    return 'OpenWeatherMap API 호출 한도를 초과했습니다.'
  }
  if (axios.isAxiosError(error)) return '날씨 API 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.'
  return error?.message ?? '날씨 데이터를 불러오지 못했습니다.'
}
