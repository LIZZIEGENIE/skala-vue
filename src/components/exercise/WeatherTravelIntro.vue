<template>
  <section class="travel-intro" aria-labelledby="travel-intro-title">
    <div class="pass-label" aria-hidden="true">
      <span>BOARDING</span>
      <strong>CITY PASS</strong>
      <small>WEATHER INCLUDED</small>
    </div>
    <div class="intro-copy">
      <span class="intro-kicker">PLAN YOUR CITY JOURNEY</span>
      <h3 id="travel-intro-title">오늘은 어느 도시로 떠날까요?</h3>
      <p>목적지를 고르면 현지 날씨부터 주변의 유명 관광지까지 여행에 필요한 정보를 모아드려요.</p>
    </div>

    <div class="travel-steps" aria-label="날씨 관광지 확인 순서">
      <div class="travel-step">
        <span aria-hidden="true">🔎</span>
        <strong>도시 찾기</strong>
      </div>
      <span class="step-arrow" aria-hidden="true">→</span>
      <div class="travel-step">
        <span aria-hidden="true">🌤️</span>
        <strong>날씨 확인</strong>
      </div>
      <span class="step-arrow" aria-hidden="true">→</span>
      <div class="travel-step">
        <span aria-hidden="true">📍</span>
        <strong>명소 탐색</strong>
      </div>
    </div>
  </section>
</template>

<style scoped>
.travel-intro {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
  padding: 0 22px 0 0;
  overflow: hidden;
  border: 1px solid rgba(211, 136, 93, 0.2);
  border-radius: 20px;
  background: #fffaf0;
  box-shadow: 0 10px 28px rgba(111, 81, 54, 0.08);
}

.travel-intro::after {
  position: absolute;
  right: -38px;
  bottom: -58px;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: rgba(225, 116, 82, 0.07);
  content: '';
}

.pass-label {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 132px;
  width: 116px;
  flex: 0 0 116px;
  align-items: center;
  justify-content: center;
  padding: 18px 10px;
  border-right: 1px dashed #d7b992;
  background: #e76f51;
  color: #fff;
  flex-direction: column;
  text-align: center;
}

.pass-label::after {
  position: absolute;
  right: -8px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #fffaf0;
  content: '';
}

.pass-label span,
.pass-label small {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.pass-label strong {
  margin: 5px 0;
  font-size: 20px;
  font-weight: 900;
  line-height: 1;
}

.intro-copy {
  position: relative;
  z-index: 1;
  max-width: 275px;
}

.intro-kicker {
  color: #d26449;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.intro-copy h3 {
  margin: 5px 0 5px;
  color: #25484a;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.intro-copy p {
  margin: 0;
  color: #5e5a51;
  font-size: 13px;
  line-height: 1.55;
}

.travel-steps {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 7px;
}

.travel-step {
  display: flex;
  min-width: 68px;
  align-items: center;
  gap: 5px;
  padding: 9px 10px;
  border: 1px solid rgba(195, 146, 104, 0.18);
  border-radius: 11px;
  background: #fff;
  color: #315d58;
}

.travel-step span {
  font-size: 16px;
}

.travel-step strong {
  font-size: 12px;
  white-space: nowrap;
}

.step-arrow {
  color: #dc8a6a;
  font-size: 11px;
}

@media (max-width: 640px) {
  .travel-intro {
    align-items: flex-start;
    flex-direction: column;
    padding: 0 18px 18px;
  }

  .pass-label {
    min-height: auto;
    width: calc(100% + 36px);
    flex: none;
    align-items: center;
    justify-content: flex-start;
    margin: 0 -18px;
    padding: 11px 18px;
    border-right: 0;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.55);
    flex-direction: row;
    gap: 8px;
  }

  .pass-label::after {
    display: none;
  }

  .pass-label strong {
    margin: 0;
    font-size: 16px;
  }

  .travel-steps {
    width: 100%;
  }

  .travel-step {
    min-width: 0;
    justify-content: center;
    flex: 1;
  }
}

@media (max-width: 390px) {
  .travel-step {
    flex-direction: column;
  }
}
</style>
