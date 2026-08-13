<script setup>
import { ref, onMounted, onUpdated, onUnmounted } from 'vue'
const count = ref(0)
let timerId = null // 실시간 타이머 메모리 주소를 담을 변수
// 생성 (Creation) 단계 = <script setup> 본문 그 자체
console.log('1. [setup] 컴포넌트가 메모리에 생성되었습니다. (DOM 접근 불가능)')
// 부착 (Mounting) 단계
onMounted(() => {
  console.log('2. [onMounted] 화면에 완벽히 부착되었습니다! (API 호출/DOM 조작 적기)')
  // 🔥 실무 활용 시뮬레이션: 3초마다 숫자가 자동으로 올라가는 타이머 가동
  timerId = setInterval(() => {
    count.value++
  }, 3000)
})
// 갱신 (Updating) 단계- count 변수가 바뀌어서 화면이 리렌더링(새로고침)될 때마다 매번 실행된다.
onUpdated(() => {
  console.log(
    `3. [onUpdated] 데이터가 변경되어 화면을 새로 그렸습니다. (현재 count: ${count.value})`,
  )
})
// 소멸 (Unmounting) 단계- v-if="false" 등으로 이 컴포넌트가 화면에서 완전히 파괴되어 사라질 때 실행된다.
onUnmounted(() => {
  // ❌ 주의: 여기서 타이머를 안 꺼주면 컴포넌트가 사라져도 백그라운드에서 영원히 타이머가 돕니다! (메모리 누수)
  clearInterval(timerId)
  console.log('4. [onUnmounted] 컴포넌트가 소멸했습니다. 타이머 청소 완료!')
})
</script>

<template>
  <div v-if="count >= 0" style="width: 420px; background: #f5f5f5; border: 1px solid #d9d9d9; border-radius: 8px; padding: 14px 16px 16px; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; color: #232323;">
    <div style="font-size: 14px; font-weight: 700; margin-bottom: 12px;">Lifecycle Hook</div>
    <div style="height: 1px; background: #cfcfcf; margin-bottom: 10px;"></div>

    <button
      type="button"
      @click="count = -1"
      style="display: flex; align-items: center; gap: 10px; border: 0; background: transparent; padding: 0 0 12px; margin: 0; font-size: 14px; color: #2d2d2d; cursor: pointer; text-align: left;"
    >
      <span style="width: 10px; height: 10px; border-radius: 50%; background: #e53935; display: inline-block;"></span>
      <span>실습 컴포넌트 파괴하기</span>
    </button>

    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
      <span style="font-size: 16px; color: #444;">◉</span>
      <span style="font-size: 14px; color: #3f3f3f;">라이프사이클 훅</span>
    </div>

    <div style="border: 1px solid #d9d9d9; border-radius: 6px; background: #f1f1f1; padding: 14px 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 12px; font-size: 13px; color: #404040;">
        <span>실시간 타이머 카운트</span>
        <strong style="font-size: 18px; color: #1f1f1f;">{{ count }}</strong>
      </div>

      <button
        type="button"
        @click="count++"
        style="width: 100%; border: 1px solid #d0d0d0; background: #ffffff; border-radius: 6px; padding: 10px; font-size: 12px; color: #2f2f2f; cursor: pointer; box-sizing: border-box;"
      >
        수동으로 숫자 올리기
      </button>
    </div>
  </div>

  <div v-else style="width: 420px; background: #f5f5f5; border: 1px solid #d9d9d9; border-radius: 8px; padding: 18px 16px; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; color: #232323;">
    <div style="font-size: 14px; font-weight: 700; margin-bottom: 12px;">Lifecycle Hook</div>
    <div style="height: 1px; background: #cfcfcf; margin-bottom: 12px;"></div>

    <button
      type="button"
      @click="count = 0"
      style="display: flex; align-items: center; gap: 10px; border: 0; background: transparent; padding: 0; margin: 0; font-size: 14px; color: #2d2d2d; cursor: pointer; text-align: left;"
    >
      <span style="width: 10px; height: 10px; border-radius: 50%; background: #1f9d55; display: inline-block;"></span>
      <span>실습 컴포넌트 다시 생성하기</span>
    </button>

    <div style="margin-top: 14px; font-size: 13px; color: #555;">
      현재 상태: unmounted
    </div>
  </div>
</template>

<style scoped>
.lifecycle-card {
  width: 420px;
  background: #f3f3f3;
  border: 1px solid #d8d8d8;
  border-radius: 10px;
  padding: 18px 18px 20px;
  box-sizing: border-box;
  font-family: 'Segoe UI', sans-serif;
  color: #222;
}

.title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #2f2f2f;
}

.divider {
  height: 1px;
  background: #cfcfcf;
  margin-bottom: 14px;
}

.pipeline-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  border: none;
  background: transparent;
  padding: 6px 0 12px;
  font-size: 14px;
  color: #3d3d3d;
  text-align: left;
  cursor: pointer;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e33d3d;
  display: inline-block;
  box-shadow: 0 0 0 2px rgba(227, 61, 61, 0.12);
}

.pipeline-text {
  font-weight: 500;
}

.hook-panel {
  background: #f7f7f7;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
}

.hook-label {
  background: #eeeeee;
  border-bottom: 1px solid #d9d9d9;
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #555;
}

.hook-content {
  padding: 18px 16px 16px;
}

.count-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  font-size: 13px;
  color: #555;
}

.count-row strong {
  font-size: 18px;
  color: #212121;
}

.increment-btn {
  width: 100%;
  border: 1px solid #d2d2d2;
  background: #fff;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.increment-btn:hover {
  background: #f0f0f0;
}
</style>
