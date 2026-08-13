<script setup>
import UnitToggler from './components/exercise/UnitToggler.vue'
</script>

<template>
  <div class="app-container">
    <h1><span class="app-mark">✈</span> 날씨 따라 떠나는 도시 여행</h1>
    <hr />
    <div class="dashboard-wrapper router-assignment">
      <nav class="navigation-bar" aria-label="날씨 서비스 메뉴">
        <RouterLink to="/" class="nav-item">🌦️ 날씨·여행</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/guide" class="nav-item">🧭 날씨 가이드</RouterLink>
        <UnitToggler />
      </nav>
      <main class="router-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
/* ⚠️ 외부 스타일 파일(예: 버튼 디자인 뭉치)을 이 방 안으로 쏙 가리켜 가져옵니다 */
@import '@/assets/exercise.css';

.router-assignment.dashboard-wrapper {
  width: min(100%, 780px);
}

.router-content {
  min-width: 0;
}

.app-container {
  border: 1px solid rgba(173, 136, 95, 0.14);
  background: rgba(255, 253, 249, 0.96);
  box-shadow: 0 20px 55px rgba(66, 66, 50, 0.1);
}

.app-container h1 {
  color: #24484a;
  font-family: inherit;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.app-mark {
  display: inline-flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e76f51;
  color: #fff;
  font-family: sans-serif;
  font-size: 17px;
  transform: rotate(-12deg);
}

.router-assignment .navigation-bar {
  border: 1px solid rgba(180, 145, 103, 0.13);
  background: #fffaf1;
}

.router-assignment .navigation-bar .router-link-exact-active {
  border-bottom-color: #df6b4e;
  color: #c45c43;
}

@media (max-width: 640px) {
  .router-assignment .navigation-bar {
    flex-wrap: wrap;
    gap: 8px;
  }

  .router-assignment .divider {
    display: none;
  }

  .router-assignment .nav-item {
    font-size: 13px;
  }
}
</style>
