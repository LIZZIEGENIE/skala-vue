<script setup>
import { useId } from 'vue'

// 부모에게 입력된 검색어를 전달할 커스텀 이벤트
defineEmits(['update-query'])

const searchInputId = useId()

// 부모가 소유한 검색어와 필터링 결과 개수를 단방향으로 전달받습니다.
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
  resultCount: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <div class="search-inner">
    <label class="search-label" :for="searchInputId">여행할 도시 검색</label>
    <div class="search-input-wrap">
      <span class="search-icon" aria-hidden="true">⌕</span>
      <input
        :id="searchInputId"
        type="text"
        :value="currentQuery"
        @input="$emit('update-query', $event.target.value)"
        placeholder="날씨와 관광지가 궁금한 도시를 검색하세요"
      />
      <span class="result-count">{{ resultCount }}개 도시</span>
    </div>
    <p class="search-hint">
      <template v-if="currentQuery">
        ‘<strong>{{ currentQuery }}</strong
        >’ 검색 결과를 보여드리고 있어요.
      </template>
      <template v-else>도시를 선택하면 상세 화면에서 날씨와 관광지를 함께 볼 수 있어요.</template>
    </p>
  </div>
</template>

<style scoped>
.search-label {
  display: block;
  margin-bottom: 10px;
  color: #355052;
  font-size: 13px;
  font-weight: 800;
}

.search-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #cb7359;
  font-size: 25px;
  line-height: 1;
  transform: rotate(-20deg);
}

input {
  width: 100%;
  min-width: 0;
  padding: 14px 100px 14px 48px;
  border: 1px solid #e4d8c7;
  border-radius: 10px;
  outline: none;
  background: #fffdf8;
  color: #24484a;
  font-size: 15px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

input:focus {
  border-color: #df795e;
  box-shadow: 0 0 0 4px rgba(223, 121, 94, 0.12);
}

.result-count {
  position: absolute;
  right: 14px;
  padding: 5px 8px;
  border-radius: 8px;
  background: #fce9df;
  color: #bd6048;
  font-size: 12px;
  font-weight: 800;
}

.search-hint {
  margin: 9px 2px 0;
  color: #6e8498;
  font-size: 12px;
}

.search-hint strong {
  font-weight: 800;
}

@media (max-width: 390px) {
  input {
    padding-right: 48px;
  }

  .result-count {
    display: none;
  }
}
</style>
