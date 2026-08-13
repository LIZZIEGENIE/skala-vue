<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <section class="not-found-view">
    <div class="not-found-card">
      <div class="error-icon" aria-hidden="true">☀️❓</div>
      <span class="error-code">404 · NOT FOUND</span>
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>요청하신 주소가 존재하지 않거나,<br />아직 개발되지 않았습니다.</p>
      <button type="button" class="home-button" @click="goHome">날씨 메인으로 이동</button>
    </div>
  </section>
</template>

<style scoped>
.not-found-view {
  display: grid;
  min-height: 520px;
  place-items: center;
  border-radius: 24px;
  background:
    radial-gradient(circle at 20% 20%, rgba(75, 155, 230, 0.14), transparent 26%), #eef5fb;
}

.not-found-card {
  width: min(88%, 430px);
  padding: 44px 32px;
  border: 1px solid rgba(125, 157, 185, 0.16);
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 16px 40px rgba(43, 84, 126, 0.14);
  text-align: center;
}

.error-icon {
  margin-bottom: 12px;
  font-size: 58px;
}

.error-code {
  color: #4b9be6;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

h2 {
  margin: 8px 0 7px;
  color: #17324d;
  font-size: 26px;
}

p {
  margin: 0 0 24px;
  color: #6e8498;
  font-size: 13px;
}

.home-button {
  padding: 10px 22px;
  border: 0;
  border-radius: 999px;
  background: #2f8fe5;
  color: #fff;
  cursor: pointer;
  font-weight: 800;
}

.home-button:hover {
  background: #2376c8;
}
</style>
