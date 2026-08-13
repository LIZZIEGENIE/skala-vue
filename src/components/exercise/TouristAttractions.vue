<script setup>
import Button from 'primevue/button'

defineProps({
  cityName: {
    type: String,
    required: true,
  },
  attractions: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  apiKeyReady: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['retry'])

const getCategory = (kinds) => {
  if (kinds?.includes('museums')) return '박물관'
  if (kinds?.includes('historic')) return '역사 명소'
  if (kinds?.includes('architecture')) return '건축 명소'
  if (kinds?.includes('natural')) return '자연 명소'
  if (kinds?.includes('religion')) return '종교 명소'
  return '추천 명소'
}

const getCategoryIcon = (kinds) => {
  if (kinds?.includes('museums')) return '🏛️'
  if (kinds?.includes('historic')) return '🏰'
  if (kinds?.includes('architecture')) return '🏙️'
  if (kinds?.includes('natural')) return '🌿'
  if (kinds?.includes('religion')) return '⛪'
  return '📸'
}

const formatDistance = (distance) => {
  if (distance >= 1000) return `${(distance / 1000).toFixed(1)}km`
  return `${distance}m`
}

const getMapLink = (place) =>
  `https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}#map=16/${place.latitude}/${place.longitude}`
</script>

<template>
  <section class="tourism-section">
    <div class="tourism-heading">
      <div>
        <span class="tourism-kicker">OPEN TRIP MAP</span>
        <h3>🧳 {{ cityName }} 추천 관광지</h3>
        <p>현재 날씨를 확인하고 도시의 대표 명소까지 함께 둘러보세요.</p>
      </div>
      <a href="https://opentripmap.io/" target="_blank" rel="noreferrer">OpenTripMap</a>
    </div>

    <div class="language-notice" role="note">
      <span aria-hidden="true">🌐</span>
      <p>
        관광지 정보는 해외 서비스인 OpenTripMap에서 제공됩니다. 장소명·설명·주소는 등록된
        원본 데이터에 따라 영어 또는 해당 국가의 현지어로 표시될 수 있습니다.
      </p>
    </div>

    <div v-if="!apiKeyReady" class="tourism-notice key-guide">
      <span aria-hidden="true">🔑</span>
      <div>
        <strong>OpenTripMap API Key를 입력해 주세요.</strong>
        <p>
          프로젝트의 <code>.env.local</code> 파일에 <code>VITE_OPENTRIPMAP_API_KEY</code>를
          입력하고 개발 서버를 다시 실행하면 관광지가 표시됩니다.
        </p>
      </div>
    </div>

    <div v-else-if="loading" class="tourism-notice" aria-live="polite">
      <span class="loading-icon" aria-hidden="true">🗺️</span>
      <div>
        <strong>주변의 유명 관광지를 찾고 있어요.</strong>
        <p>도시 중심에서 가까운 주요 명소를 불러오는 중입니다.</p>
      </div>
    </div>

    <div v-else-if="error" class="tourism-notice error-notice" aria-live="polite">
      <span aria-hidden="true">⚠️</span>
      <div>
        <strong>관광지 정보를 불러오지 못했어요.</strong>
        <p>{{ error }}</p>
        <Button label="다시 불러오기" size="small" severity="warn" @click="emit('retry')" />
      </div>
    </div>

    <div v-else-if="attractions.length" class="attraction-grid">
      <article v-for="place in attractions" :key="place.xid" class="attraction-card">
        <div class="place-image">
          <span aria-hidden="true">{{ getCategoryIcon(place.kinds) }}</span>
          <b>{{ getCategory(place.kinds) }}</b>
        </div>

        <div class="place-content">
          <div class="place-title">
            <h4>{{ place.name }}</h4>
            <span>{{ formatDistance(place.distance) }}</span>
          </div>
          <p class="place-description">{{ place.description }}</p>
          <p v-if="place.address" class="place-address">📍 {{ place.address }}</p>
          <a :href="getMapLink(place)" target="_blank" rel="noreferrer">
            지도에서 위치 보기 <span aria-hidden="true">↗</span>
          </a>
        </div>
      </article>
    </div>

    <div v-else class="tourism-notice">
      <span aria-hidden="true">🧭</span>
      <div>
        <strong>표시할 관광지가 없습니다.</strong>
        <p>이 도시 주변에서 이름이 등록된 주요 관광지를 찾지 못했습니다.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tourism-section {
  margin-top: 18px;
  padding: 22px;
  overflow: hidden;
  border: 1px solid rgba(85, 156, 136, 0.2);
  border-radius: 20px;
  background: linear-gradient(145deg, #ffffff 0%, #f2fbf6 100%);
  box-shadow: 0 10px 28px rgba(56, 111, 96, 0.09);
}

.tourism-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.tourism-kicker {
  color: #3b9b7d;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.tourism-heading h3 {
  margin: 5px 0 4px;
  color: #183e36;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.tourism-heading p {
  margin: 0;
  color: #526f67;
  font-size: 13px;
}

.tourism-heading > a {
  color: #3d806d;
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
}

.language-notice {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin-bottom: 14px;
  padding: 10px 12px;
  border: 1px solid #d9e8e2;
  border-radius: 11px;
  background: #f4faf7;
  color: #3f6258;
}

.language-notice span {
  flex: 0 0 auto;
  font-size: 15px;
}

.language-notice p {
  margin: 0;
  font-size: 12px;
  line-height: 1.55;
}

.tourism-notice {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 17px;
  border-radius: 15px;
  background: #eaf8f2;
  color: #285f50;
}

.tourism-notice > span {
  font-size: 28px;
}

.tourism-notice strong {
  display: block;
  margin-bottom: 3px;
}

.tourism-notice p {
  margin: 0;
  color: #5e7c73;
  font-size: 13px;
  line-height: 1.55;
}

.tourism-notice code {
  padding: 2px 5px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.75);
  color: #28705b;
  font-size: 12px;
}

.key-guide {
  background: #fff8e8;
  color: #805d1c;
}

.key-guide p {
  color: #8a733f;
}

.error-notice {
  align-items: flex-start;
  background: #fff1ee;
  color: #994a3e;
}

.error-notice p {
  margin-bottom: 10px;
  color: #93665f;
}

.attraction-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.attraction-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid rgba(85, 156, 136, 0.15);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 20px rgba(56, 111, 96, 0.07);
}

.place-image {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 145px;
  overflow: hidden;
  background: linear-gradient(135deg, #b9ebd8, #dff4eb);
}

.place-image > span {
  font-size: 58px;
  filter: drop-shadow(0 9px 10px rgba(48, 101, 86, 0.13));
}

.place-image b {
  position: absolute;
  left: 10px;
  bottom: 10px;
  padding: 5px 8px;
  border-radius: 999px;
  background: rgba(20, 70, 58, 0.82);
  color: #fff;
  font-size: 11px;
}

.place-content {
  padding: 15px;
}

.place-title {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.place-title h4 {
  margin: 0;
  color: #183e36;
  font-size: 16px;
  font-weight: 800;
}

.place-title span {
  flex: 0 0 auto;
  padding: 3px 6px;
  border-radius: 6px;
  background: #eaf8f2;
  color: #3b806c;
  font-size: 11px;
  font-weight: 800;
}

.place-description {
  display: -webkit-box;
  margin: 9px 0 7px;
  overflow: hidden;
  color: #4f6962;
  font-size: 13px;
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.place-address {
  margin: 0 0 10px;
  color: #687f77;
  font-size: 12px;
}

.place-content > a {
  color: #2f856c;
  font-size: 13px;
  font-weight: 800;
  text-decoration: none;
}

@media (max-width: 640px) {
  .tourism-section {
    padding: 18px;
  }

  .tourism-heading {
    flex-direction: column;
  }

  .attraction-grid {
    grid-template-columns: 1fr;
  }
}
</style>
