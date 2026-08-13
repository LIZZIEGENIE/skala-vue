<script setup>
import WeatherHeroModeSelector from './WeatherHeroModeSelector.vue'

defineProps({
  todayLabel: {
    type: String,
    required: true,
  },
  eyebrowLabel: {
    type: String,
    required: true,
  },
  heroTitle: {
    type: String,
    required: true,
  },
  heroDescription: {
    type: String,
    required: true,
  },
  modeOptions: {
    type: Array,
    required: true,
  },
  activeMode: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-mode'])
</script>

<template>
  <header class="weather-hero">
    <div class="hero-copy">
      <div class="travel-brand"><span aria-hidden="true">✦</span> CITY WEATHER JOURNAL</div>
      <div class="hero-topline">
        <span class="eyebrow">{{ eyebrowLabel }}</span>
        <WeatherHeroModeSelector
          :options="modeOptions"
          :active-mode="activeMode"
          @select-mode="(mode) => emit('update-mode', mode)"
        />
      </div>
      <p class="today-label">{{ todayLabel }}</p>
      <h2>{{ heroTitle }}</h2>
      <p class="hero-description">{{ heroDescription }}</p>
      <div class="hero-features">
        <span>🌤️ 실시간 날씨</span>
        <span>📍 도시 명소</span>
      </div>
    </div>

    <div class="travel-postcard" aria-hidden="true">
      <div class="postcard-top">
        <span>DESTINATION PASS</span>
        <b>NO. 021</b>
      </div>
      <div class="postcard-visual">
        <span class="postcard-globe">🌍</span>
        <span class="postcard-route"></span>
        <span class="postcard-plane">✈</span>
        <span class="postcard-pin">📍</span>
      </div>
      <strong class="postcard-title">READY FOR<br />A CITY TRIP?</strong>
      <div class="postcard-weather">
        <span>☀️</span>
        <div>
          <small>WEATHER READY</small>
          <b>EXPLORE THE CITY</b>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.weather-hero {
  position: relative;
  display: flex;
  min-height: 300px;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  padding: 34px 38px;
  overflow: hidden;
  background:
    radial-gradient(circle at 3% 105%, rgba(244, 175, 106, 0.32) 0 18%, transparent 18.5%),
    linear-gradient(130deg, #173d46 0%, #22635e 58%, #3d8b77 100%);
  color: #fff;
}

.weather-hero::before,
.weather-hero::after {
  position: absolute;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: transparent;
  content: '';
}

.weather-hero::before {
  top: -110px;
  left: 40%;
  width: 240px;
  height: 240px;
}

.weather-hero::after {
  right: -120px;
  bottom: -140px;
  width: 300px;
  height: 300px;
}

.hero-copy {
  position: relative;
  z-index: 1;
  max-width: 430px;
  flex: 1;
}

.travel-brand {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 20px;
  color: #ffd49c;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.hero-topline {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.eyebrow {
  display: block;
  color: rgba(255, 255, 255, 0.86);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.today-label {
  margin: 0 0 6px;
  color: #d6ece5;
  font-size: 14px;
  font-weight: 700;
}

.hero-copy h2 {
  margin: 0;
  color: #fff;
  max-width: 400px;
  font-size: clamp(29px, 4.6vw, 38px);
  font-weight: 800;
  line-height: 1.16;
  letter-spacing: -0.04em;
}

.hero-description {
  margin: 14px 0 0;
  max-width: 390px;
  color: rgba(245, 255, 252, 0.9);
  font-size: 14px;
  line-height: 1.6;
}

.hero-features {
  display: flex;
  gap: 7px;
  margin-top: 17px;
}

.hero-features span {
  padding: 6px 9px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #e6f4f0;
  font-size: 11px;
  font-weight: 800;
}

.travel-postcard {
  position: relative;
  z-index: 1;
  width: 210px;
  min-width: 210px;
  padding: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 8px;
  background: #fff4df;
  color: #173e46;
  box-shadow: 0 18px 36px rgba(4, 38, 43, 0.25);
  transform: rotate(2deg);
}

.travel-postcard::after {
  position: absolute;
  top: 44px;
  right: -17px;
  width: 55px;
  height: 55px;
  border: 2px dashed rgba(219, 101, 73, 0.35);
  border-radius: 50%;
  content: '';
}

.postcard-top,
.postcard-weather {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.postcard-top {
  padding-bottom: 8px;
  border-bottom: 1px dashed #d7bfa0;
  color: #78563d;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.05em;
}

.postcard-top b {
  padding: 3px 5px;
  border-radius: 3px;
  background: #e86f51;
  color: #fff;
  font-size: 10px;
}

.postcard-visual {
  position: relative;
  height: 84px;
}

.postcard-globe {
  position: absolute;
  top: 10px;
  left: 3px;
  font-size: 54px;
  filter: drop-shadow(0 7px 8px rgba(54, 99, 89, 0.12));
}

.postcard-route {
  position: absolute;
  top: 44px;
  left: 55px;
  width: 88px;
  border-top: 2px dashed #e0795d;
  transform: rotate(-13deg);
}

.postcard-plane {
  position: absolute;
  top: 22px;
  left: 102px;
  color: #df694b;
  font-size: 24px;
  transform: rotate(-12deg);
}

.postcard-pin {
  position: absolute;
  right: 7px;
  bottom: 10px;
  font-size: 25px;
}

.postcard-title {
  display: block;
  margin: 2px 0 12px;
  color: #173e46;
  font-size: 19px;
  font-weight: 900;
  line-height: 1.18;
  letter-spacing: -0.02em;
}

.postcard-weather {
  justify-content: flex-start;
  gap: 8px;
  padding: 8px;
  border-radius: 7px;
  background: #e4f1eb;
}

.postcard-weather > span {
  font-size: 22px;
}

.postcard-weather div {
  display: flex;
  flex-direction: column;
}

.postcard-weather small {
  color: #526f66;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.postcard-weather b {
  color: #286250;
  font-size: 10px;
}

@media (max-width: 640px) {
  .weather-hero {
    min-height: auto;
    align-items: stretch;
    flex-direction: column;
    padding: 28px 24px;
  }

  .hero-description {
    max-width: 100%;
  }

  .hero-copy {
    max-width: 100%;
  }

  .travel-postcard {
    width: 100%;
    min-width: 0;
    padding: 13px;
    transform: none;
  }

  .postcard-visual {
    position: absolute;
    right: 10px;
    bottom: 3px;
    width: 130px;
    opacity: 0.7;
  }

  .postcard-title {
    margin: 11px 0 9px;
  }

  .postcard-weather {
    width: 170px;
  }
}

@media (max-width: 390px) {
  .hero-topline {
    gap: 6px;
  }

  .postcard-visual {
    opacity: 0.34;
  }
}
</style>
