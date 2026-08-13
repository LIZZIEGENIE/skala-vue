import axios from 'axios'

// .env.local에 저장한 OpenTripMap API Key를 불러옵니다.
const OPENTRIPMAP_API_KEY = import.meta.env.VITE_OPENTRIPMAP_API_KEY || ''

const openTripMapClient = axios.create({
  baseURL: 'https://api.opentripmap.com/0.1/en/places',
  timeout: 10000,
})

export const hasOpenTripMapApiKey = OPENTRIPMAP_API_KEY.trim().length > 0

const requireApiKey = () => {
  if (!hasOpenTripMapApiKey) {
    throw new Error('.env.local의 VITE_OPENTRIPMAP_API_KEY에 발급받은 Key를 입력해 주세요.')
  }
}

const getPlaceDetail = async (place) => {
  const { data } = await openTripMapClient.get(`/xid/${place.xid}`, {
    params: { apikey: OPENTRIPMAP_API_KEY },
  })

  return {
    xid: place.xid,
    name: data.name || place.name,
    kinds: data.kinds || place.kinds,
    distance: Math.round(place.dist || 0),
    description:
      data.wikipedia_extracts?.text || '도시를 대표하는 문화·역사 관광 명소입니다.',
    address: data.address
      ? [data.address.road, data.address.city, data.address.country].filter(Boolean).join(', ')
      : '',
    latitude: data.point?.lat ?? place.point?.lat,
    longitude: data.point?.lon ?? place.point?.lon,
  }
}

export const fetchTouristAttractions = async (city) => {
  requireApiKey()

  const { data } = await openTripMapClient.get('/radius', {
    params: {
      radius: 15000,
      lon: city.longitude,
      lat: city.latitude,
      kinds: 'interesting_places',
      rate: 2,
      format: 'json',
      limit: 8,
      apikey: OPENTRIPMAP_API_KEY,
    },
  })

  const namedPlaces = data.filter((place) => place.name?.trim()).slice(0, 6)
  const detailResults = await Promise.allSettled(namedPlaces.map((place) => getPlaceDetail(place)))

  return detailResults.flatMap((result) =>
    result.status === 'fulfilled' ? [result.value] : [],
  )
}

export const getTourismApiErrorMessage = (error) => {
  if (error?.message?.includes('VITE_OPENTRIPMAP_API_KEY')) return error.message
  if (axios.isAxiosError(error) && [401, 403].includes(error.response?.status)) {
    return 'OpenTripMap API Key가 유효하지 않습니다.'
  }
  if (axios.isAxiosError(error) && error.response?.status === 429) {
    return 'OpenTripMap API 호출 한도를 초과했습니다.'
  }
  if (axios.isAxiosError(error)) {
    return '관광지 API 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.'
  }
  return error?.message || '관광지 정보를 불러오지 못했습니다.'
}
