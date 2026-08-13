<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <section class="guide-view">
    <div class="guide-heading">
      <span class="view-kicker">WEATHER GUIDE</span>
      <h2>날씨 활용 가이드</h2>
      <p>기온과 날씨 상태에 맞는 간단한 생활 정보를 확인해 보세요.</p>
    </div>

    <div class="guide-grid">
      <article class="guide-card hot-guide">
        <span aria-hidden="true">☀️</span>
        <h3>더운 날</h3>
        <p>물을 자주 마시고 한낮의 장시간 야외 활동은 피하는 것이 좋아요.</p>
      </article>
      <article class="guide-card rain-guide">
        <span aria-hidden="true">🌧️</span>
        <h3>비 오는 날</h3>
        <p>우산을 챙기고 미끄러운 보도와 젖은 도로를 조심하세요.</p>
      </article>
      <article class="guide-card cold-guide">
        <span aria-hidden="true">❄️</span>
        <h3>추운 날</h3>
        <p>여러 겹의 옷을 입고 외출 전 체감 온도를 함께 확인하세요.</p>
      </article>
    </div>

    <button type="button" class="home-button" @click="goHome">날씨 대시보드 확인하기</button>
  </section>
</template>

<style scoped>
.guide-view {
  padding: 28px;
  border: 1px solid rgba(125, 157, 185, 0.18);
  border-radius: 24px;
  background: #eef5fb;
  color: #17324d;
  box-shadow: 0 18px 42px rgba(43, 84, 126, 0.13);
}

.guide-heading {
  margin-bottom: 20px;
}

.view-kicker {
  display: block;
  color: #4b9be6;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.guide-heading h2 {
  margin: 5px 0 3px;
  font-size: 26px;
  letter-spacing: -0.04em;
}

.guide-heading p,
.guide-card p {
  margin: 0;
  color: #6e8498;
  font-size: 13px;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.guide-card {
  padding: 20px;
  border: 1px solid rgba(125, 157, 185, 0.13);
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 22px rgba(45, 82, 116, 0.07);
}

.guide-card > span {
  font-size: 38px;
}

.guide-card h3 {
  margin: 9px 0 5px;
  font-size: 17px;
}

.hot-guide {
  background: linear-gradient(145deg, #fff 0%, #fff2e8 100%);
}

.rain-guide {
  background: linear-gradient(145deg, #fff 0%, #edf7ff 100%);
}

.cold-guide {
  background: linear-gradient(145deg, #fff 0%, #eef1ff 100%);
}

.home-button {
  width: 100%;
  margin-top: 16px;
  padding: 11px;
  border: 0;
  border-radius: 10px;
  background: #2f8fe5;
  color: #fff;
  cursor: pointer;
  font-weight: 800;
}

.home-button:hover {
  background: #2376c8;
}

@media (max-width: 640px) {
  .guide-view {
    padding: 18px;
  }

  .guide-grid {
    grid-template-columns: 1fr;
  }
}
</style>
