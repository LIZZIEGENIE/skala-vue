# 날씨 대시보드 반응형 기능 발표

## 1. 발표 주제

안녕하세요. 저는 오늘 배운 Vue의 `ref`, `computed`, `watch`, `watchEffect`를 활용하여 도시 검색, 온도 카테고리 필터, 기온 정렬 기능을 구현했습니다.

이번 구현의 핵심은 원본 날씨 데이터를 직접 수정하지 않고, 사용자의 입력에 따라 화면에 필요한 데이터만 단계적으로 계산하는 것입니다.

## 2. 반응형 상태 관리 - ref (강의 103~104페이지)

먼저 검색어, 선택된 도시 정보, 날씨 목록을 `ref`로 선언했습니다. 추가 기능에서는 사용자가 선택한 온도 카테고리를 저장하기 위해 다음 상태를 만들었습니다.

```js
const selectedTemperatureCategory = ref('all')
```

`ref`로 선언했기 때문에 값이 변경되면 이 값을 사용하는 computed와 화면이 자동으로 반응합니다. `<script setup>`에서는 `.value`로 접근하고, 템플릿에서는 `.value` 없이 사용했습니다.

## 3. 사용자 이벤트와 데이터 바인딩 (강의 70, 76~77, 88~89페이지)

온도 카테고리 버튼은 `v-for`로 반복 생성했습니다.

```vue
<button
  v-for="category in temperatureCategoryOptions"
  :key="category.value"
  @click="selectedTemperatureCategory = category.value"
>
  {{ category.label }}
</button>
```

버튼을 클릭하면 `@click` 이벤트를 통해 `selectedTemperatureCategory`가 변경됩니다. 선택된 버튼에는 `:class`를 이용하여 활성화 스타일도 적용했습니다.

기온 정렬 드롭다운에는 `v-model`을 사용했습니다.

```vue
<select v-model="sortOrder">
```

사용자가 옵션을 선택하면 선택값과 `sortOrder`가 자동으로 동기화됩니다.

## 4. computed를 이용한 데이터 가공 (강의 109~110페이지)

날씨 목록은 세 단계의 computed를 거쳐 화면에 표시됩니다.

```text
weatherList
  → filteredWeatherList       도시 이름 검색
  → categorizedWeatherList    더움·선선함·추움 필터
  → sortedWeatherList         기온 정렬
```

온도 카테고리 computed는 다음과 같이 작성했습니다.

```js
const categorizedWeatherList = computed(() => {
  if (selectedTemperatureCategory.value === 'all') {
    return filteredWeatherList.value
  }

  return filteredWeatherList.value.filter((item) => {
    if (selectedTemperatureCategory.value === 'hot') return item.temp >= 25
    if (selectedTemperatureCategory.value === 'cool') return item.temp >= 10 && item.temp < 25
    return item.temp < 10
  })
})
```

온도 기준은 화면의 배지 조건과 동일합니다.

- 더움: 25도 이상
- 선선함: 10도 이상 25도 미만
- 추움: 10도 미만

computed를 사용했기 때문에 검색어 또는 카테고리가 바뀔 때만 결과가 다시 계산됩니다. 원본 배열은 그대로 유지됩니다.

## 5. watch를 이용한 지정형 감시 (강의 112~113페이지)

카테고리 변경은 `watch`로 감시했습니다.

```js
watch(selectedTemperatureCategory, (newCategory, oldCategory) => {
  const newLabel = temperatureCategoryLabels[newCategory]
  const oldLabel = temperatureCategoryLabels[oldCategory]

  console.log(`카테고리가 ${oldLabel}에서 ${newLabel}로 변경되었습니다.`)
  selectedCityInfo.value = `${newLabel} 카테고리의 도시가 표시됩니다.`
})
```

`watch`는 감시할 상태를 첫 번째 인자로 명확하게 지정하고, 콜백에서 이전 값과 새로운 값을 모두 받을 수 있습니다. 이번 기능에서는 변경 내용을 콘솔에 기록하고 상태바 문구를 갱신하는 후속 작업에 사용했습니다.

## 6. watchEffect와 watch의 차이 (강의 123~125페이지)

도시 검색어는 `watchEffect`로 추적합니다. `watchEffect` 안에서 `searchQuery.value`에 접근했기 때문에 Vue가 검색어를 자동으로 감시하며, 컴포넌트가 처음 생성될 때도 한 번 실행됩니다.

반면 온도 카테고리는 이전 값과 새로운 값이 모두 필요하므로 `watch`를 사용했습니다.

- `watch`: 감시 대상을 직접 지정하며 이전 값과 새로운 값을 받을 수 있음
- `watchEffect`: 함수 안에서 사용한 반응형 값을 자동으로 감시하며 즉시 한 번 실행됨

## 7. 화면 출력과 예외 처리

최종 결과는 `sortedWeatherList`를 `v-for`로 반복하여 출력합니다.

```vue
<div v-for="item in sortedWeatherList" :key="item.id">
```

검색 결과가 없을 때와, 검색 결과는 있지만 선택한 온도 카테고리에 해당하는 도시가 없을 때를 구분하여 안내 문구를 표시했습니다.

## 8. 시연 순서

1. 초기 화면에서 모든 도시가 표시되는지 확인합니다.
2. `더움`을 눌러 서울과 부산처럼 25도 이상인 도시만 표시되는지 확인합니다.
3. `선선함`과 `추움`도 차례로 선택합니다.
4. 도시 검색어를 입력하여 검색과 카테고리 필터가 함께 동작하는지 확인합니다.
5. 기온 정렬을 `높은 순` 또는 `낮은 순`으로 변경합니다.
6. 개발자 도구 콘솔에서 `watch`, `watchEffect` 로그를 확인합니다.

## 9. 마무리

이번 과제에서는 `ref`로 상태를 만들고, `computed`로 화면에 필요한 값을 계산하며, `watch`와 `watchEffect`로 상태 변화 이후의 작업을 처리했습니다.

특히 검색, 카테고리 필터, 정렬을 각각의 computed로 분리하여 기능의 역할이 명확하고, 새로운 필터 조건이 추가되어도 수정하기 쉬운 구조로 구현했습니다.
