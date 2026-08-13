<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <section class="about-view">
    <div class="about-heading">
      <span aria-hidden="true">ℹ️</span>
      <div>
        <span class="view-kicker">ABOUT SERVICE</span>
        <h2>서비스 소개</h2>
      </div>
    </div>

    <div class="description-card">
      <p>
        본 앱은 <strong>Vue 3</strong>와 <strong>Vue Router</strong>를 기반으로 만든 실습용 날씨
        대시보드입니다.
      </p>
      <ul>
        <li><code>components/exercise/</code>의 재사용 가능한 날씨 컴포넌트 활용</li>
        <li>검색·온도 카테고리·기온 정렬을 반응형으로 처리</li>
        <li>상세보기에서 도시 ID 기반 동적 라우팅 적용</li>
        <li>지연 로딩과 Catch-all Route로 페이지 단위 이동 구성</li>
      </ul>
    </div>

    <button type="button" class="home-button" @click="goHome">대시보드 홈으로 이동</button>
  </section>
</template>

<style scoped>
.about-view {
  padding: 28px;
  border: 1px solid rgba(125, 157, 185, 0.18);
  border-radius: 24px;
  background: #eef5fb;
  color: #17324d;
  box-shadow: 0 18px 42px rgba(43, 84, 126, 0.13);
}

.about-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.about-heading > span {
  font-size: 32px;
}

.view-kicker {
  display: block;
  color: #4b9be6;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.about-heading h2 {
  margin: 2px 0 0;
  color: #17324d;
  font-size: 26px;
}

.description-card {
  padding: 22px;
  border: 1px solid rgba(125, 157, 185, 0.16);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 28px rgba(69, 101, 132, 0.08);
}

.description-card p {
  margin: 0 0 15px;
  color: #45627c;
}

.description-card strong {
  color: #2376c8;
  font-weight: 800;
}

ul {
  margin: 0;
  padding-left: 20px;
}

li {
  margin-bottom: 8px;
  color: #587188;
}

code {
  padding: 2px 5px;
  border-radius: 5px;
  background: #fff1c7;
  color: #b25b22;
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
  .about-view {
    padding: 18px;
  }
}
</style>
