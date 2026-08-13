# 날씨 따라 떠나는 도시 여행

Vue 3의 Composition API, 컴포넌트, Vue Router, Pinia, Axios를 활용하여 만든 날씨·관광 대시보드입니다. 단원별 과제에서 작성한 기능을 최종 화면 하나로 누적하고, 도시별 실시간 날씨와 추천 관광지를 함께 확인할 수 있도록 개인화했습니다.

## 단원별 실습 및 개인 Customization

### 1. 날씨 기본 화면과 데이터 구성

- 도시 검색과 날씨 카드 목록을 기본 화면으로 구성했습니다.
- 초기 9개 도시(하드코딩)에서 10개 국가, 21개 도시로 데이터를 확장했습니다.
- 국가명과 `isRepresentative` 값을 추가하여 국가별 대표 도시만 별도로 볼 수 있게 했습니다.
- 날씨 앱에서 확장하여 날씨·관광 디자인을 적용했습니다.

### 2. Composition API 적용

- 검색어, 정렬, 온도 카테고리, Hero 보기 모드를 각각 반응형 상태로 관리했습니다.
- `computed`를 연결하여 `검색 → 날씨 분류 → 기온 정렬` 순서로 화면 목록이 계산되게 했습니다.
- `현재`, `오늘`, `도시` Hero 모드를 추가했습니다.
  - 현재: 전체 도시의 실시간 날씨
  - 오늘: 현재 기온과 오늘의 최저·최고 기온
  - 도시: 국가별 대표 도시
- `watch`로 검색어를 URL Query와 동기화하고 모드·필터·정렬 변경을 감지했습니다.

### 3. Component 분리와 추가 Component

- 과제 필수 구조인 `BaseDashboardCard`, `SearchBar`, `WeatherCard`와 부모 View의 역할을 유지했습니다.
- `BaseDashboardCard`에 Slot을 배치해 검색 영역과 도시 목록 영역의 공통 디자인을 적용했습니다.
- `SearchBar`는 검색어를 props로 받고 `update-query` 이벤트를 부모에 전달합니다.
- `WeatherCard`는 도시 객체를 props로 받고 `select-card`, `click-detail` 이벤트를 부모에 전달합니다.
- 개인 Customization으로 Hero 모드 선택, API 상태, 최근 조회, 단위 변경, 여행 안내, 관광지 목록을 각각 추가 컴포넌트로 분리했습니다.

### 4. Vue Router 적용

- 모든 View에 Lazy Loading을 적용했습니다.
- `/weather/:cityId` 동적 경로로 도시 상세 페이지를 구성했습니다.
- 과제 추가 View로 `WeatherGuideView.vue`를 작성하고 `/guide`에 연결했습니다.
- `NotFoundView`를 추가하여 존재하지 않는 경로를 처리했습니다.

### 5. Pinia Store 적용

- `configStore`에 섭씨·화씨 단위 상태와 변환 기호를 관리하도록 구성했습니다.
- 단위 변경 횟수를 저장하는 `toggleCount`와 한글 단위명을 제공하는 `unitLabel`을 추가했습니다.
- 처음에는 최근 조회 기능을 별도 Store로 구상했지만, 설정과 사용자 조회 상태를 한곳에서 관리하기 위해 `configStore`에 통합했습니다.
- 최근 조회 도시는 중복 없이 최신순으로 최대 5개까지 유지하고 전체 삭제할 수 있습니다.

### 6. Axios와 실제 외부 API 적용

- Axios 인스턴스를 서비스 파일로 분리하고 timeout과 오류 메시지를 작성했습니다.
- OpenWeatherMap으로 현재 날씨와 5일·3시간 예보를 받아 메인과 상세 화면에 적용했습니다.
- Open-Meteo 대기질 API를 추가해 AQI, PM2.5, PM10, 자외선 지수를 표시했습니다.
- OpenTripMap을 추가해 도시 중심 반경 15km의 관광지와 상세 정보를 표시했습니다.
- 관광지 외부 사진 URL의 응답 실패 문제를 확인한 후 종류별 이모지로 정비했습니다.
- OpenTripMap 원본 데이터 특성상 영어 또는 현지어가 표시될 수 있다는 안내를 화면과 README에 추가했습니다.

### 7. 외부 UI Library 적용

- PrimeVue와 Aura Theme를 적용하여 버튼, Select, Tag, Message UI를 정비했습니다.
- 기존 컴포넌트 통신과 날씨 로직은 유지하고 필요한 PrimeVue 컴포넌트만 개별 import했습니다.
- PC에서는 2열, 모바일에서는 1열이 되도록 반응형 레이아웃을 작성했습니다.

### 8. Build와 Deployment 준비

- API Key를 소스 코드에서 제거하고 Vite 환경 변수로 이동했습니다.
- `.env.local`은 Git에서 제외하고 빈 변수 양식인 `.env.example`만 제출하도록 구성했습니다.
- `npm run lint`, `npm run build`, `npm run preview` 순서로 품질과 정적 결과물을 검증했습니다.
- Build 결과물인 `dist/` 폴더를 GitHub Pages에 수동으로 Hosting할 예정입니다.

## 사용 Library

| Library         | 버전   | 사용 목적                                                  |
| --------------- | ------ | ---------------------------------------------------------- |
| Vue             | 3.5.32 | Composition API 기반 화면과 반응형 상태 구성               |
| Vue Router      | 5.0.4  | 페이지 이동, 동적 도시 경로, Lazy Loading, Catch-all Route |
| Pinia           | 3.0.4  | 온도 단위와 최근 조회 도시 전역 상태 관리                  |
| Axios           | 1.19.0 | 날씨·대기질·관광지 HTTP API 요청과 오류 처리               |
| PrimeVue        | 4.5.5  | Button, Select, Tag, Message UI 컴포넌트                   |
| PrimeIcons      | 7.0.0  | 동기화 및 새로고침 아이콘                                  |
| PrimeUIX Themes | 1.2.3  | PrimeVue Aura 테마 적용                                    |
| Vite            | 8.0.8  | 개발 서버와 프로덕션 번들 빌드                             |

## 사용 API

| 제공 서비스    | API                         | Endpoint                                                | 인증           | 적용 기능                                               |
| -------------- | --------------------------- | ------------------------------------------------------- | -------------- | ------------------------------------------------------- |
| OpenWeatherMap | Current Weather Data API    | `https://api.openweathermap.org/data/2.5/weather`       | API Key 필요   | 21개 도시의 실제 기온, 체감 온도, 습도, 풍속, 날씨 상태 |
| OpenWeatherMap | 5 Day / 3 Hour Forecast API | `https://api.openweathermap.org/data/2.5/forecast`      | API Key 필요   | 오늘 최저·최고 기온 요약 및 상세 화면의 24시간 예보     |
| Open-Meteo     | Air Quality API             | `https://air-quality-api.open-meteo.com/v1/air-quality` | API Key 불필요 | 미국 AQI, PM2.5, PM10, 자외선 지수                      |
| OpenTripMap    | Places Radius / XID API     | `https://api.opentripmap.com/0.1/en/places`             | API Key 필요   | 도시 주변 유명 관광지 검색 및 장소 상세 정보            |

OpenWeatherMap 요청에는 위도·경도, `units=metric`, `lang=kr`을 전달합니다. API 응답의 섭씨 값을 원본으로 저장하고, Pinia에서 선택한 단위가 화씨일 때 화면의 `computed`에서 변환합니다. 날씨 요청은 `src/services/weatherApi.js`, 관광지 요청은 `src/services/tourismApi.js`에서 관리합니다.

> OpenTripMap은 해외 서비스이며 현재 관광지 API를 영문 경로(`en`)로 요청합니다. 관광지의 장소명·설명·주소는 OpenTripMap에 연결된 OpenStreetMap, Wikipedia 등의 원본 등록 언어를 따르므로 영어 또는 해당 국가의 현지어로 표시될 수 있습니다. 이는 애플리케이션의 번역 오류가 아니라 외부 API 원본 데이터의 언어 특성입니다.

## 외부 UI Library: PrimeVue

PrimeVue 4.5.5와 Aura 테마를 적용했습니다. 전체 라이브러리를 전역 등록하지 않고 필요한 컴포넌트만 개별 import하여 사용합니다.

- `Button`: 단위 변경, 온도 카테고리, API 재시도
- `Select`: 기온 정렬 기준 선택
- `Tag`: 더움·선선함·추움 상태 표시
- `Message`: API 연결·오류 상태 표시
- `PrimeIcons`: 동기화·새로고침 아이콘

`main.js`에서 PrimeVue plugin과 Aura preset을 설정했고, 기존 scoped CSS와 함께 사용하여 날씨 대시보드의 디자인을 유지했습니다.

### 외부 Library 적용 위치

| Library            | 적용 파일·영역                                                             | 사용 내용                                                  |
| ------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------- |
| PrimeVue `Button`  | `WeatherHomeView`, `UnitToggler`, `WeatherApiStatus`, `TouristAttractions` | 필터·단위 변경·API 재시도 버튼                             |
| PrimeVue `Select`  | `WeatherHomeView`                                                          | 기온 정렬 기준 선택                                        |
| PrimeVue `Tag`     | `WeatherCard`                                                              | 더움·선선함·추움 상태 Badge                                |
| PrimeVue `Message` | `WeatherApiStatus`                                                         | API 연결·오류 상태 메시지                                  |
| PrimeIcons         | `main.js`, PrimeVue Button                                                 | 새로고침 등 보조 아이콘                                    |
| PrimeUIX Aura      | `main.js`                                                                  | PrimeVue 전체 Theme 설정                                   |
| Axios              | `weatherApi.js`, `tourismApi.js`                                           | API별 Axios 인스턴스, GET 요청, timeout·오류 처리          |
| Pinia              | `configStore.js`와 단위·최근 조회 Component                                | 전역 단위와 최근 조회 상태 공유                            |
| Vue Router         | `router/index.js`, App 및 각 View                                          | RouterLink, RouterView, 동적 경로, Programmatic Navigation |

## 주요 기능

### 날씨 대시보드

- 10개 국가, 21개 국내·해외 도시의 현재 날씨 표시
- 도시 이름 실시간 검색
- 기온 높은 순·낮은 순 정렬
- 더움·선선함·추움 카테고리 필터
- 카드 선택 상태 안내
- 반응형 모바일 레이아웃
- API 호출 실패 시 Mock Data fallback
- 도시 상세 화면에서 실시간 날씨와 추천 관광지를 함께 표시
- 메인 화면에서 도시 검색 → 날씨 확인 → 관광지 탐색 흐름 안내

### Weather Hero 보기 모드

- `현재`: 등록된 21개 도시의 실시간 현재 날씨 표시
- `오늘`: 현재 날씨와 도시 현지 시간 기준 오늘 최저·최고 기온 표시
- `도시`: 대한민국, 영국, 프랑스, 미국, 호주, 일본, 캐나다, 독일, 싱가포르, 태국의 대표 도시만 표시
- Hero 제목, 설명, 목록 제목, 도시 카드 내용이 선택한 모드에 맞게 함께 변경
- 오늘 기온 예보는 `오늘` 탭을 처음 선택할 때만 요청하고 결과를 재사용

### 컴포넌트 구성

| 구분      | Component                     | 역할 및 통신 방식                                         |
| --------- | ----------------------------- | --------------------------------------------------------- |
| 과제 필수 | `BaseDashboardCard.vue`       | 검색·목록 공통 카드와 부모 콘텐츠 주입용 Slot 제공        |
| 과제 필수 | `SearchBar.vue`               | `currentQuery`, `resultCount` props / `update-query` emit |
| 과제 필수 | `WeatherCard.vue`             | `cityItem` 등 props / `select-card`, `click-detail` emit  |
| 개인 추가 | `WeatherHero.vue`             | 여행 엽서 형태의 Hero와 선택 모드에 따른 문구 표시        |
| 개인 추가 | `WeatherHeroModeSelector.vue` | `현재`, `오늘`, `도시` 모드 선택 후 `select-mode` emit    |
| 개인 추가 | `UnitToggler.vue`             | Pinia Store의 섭씨·화씨 단위 변경                         |
| 개인 추가 | `RecentCitiesPanel.vue`       | 최근 조회 도시 표시·이동·전체 삭제                        |
| 개인 추가 | `WeatherApiStatus.vue`        | 날씨 API의 로딩·성공·오류·재시도 표시                     |
| 개인 추가 | `WeatherTravelIntro.vue`      | 도시 검색 → 날씨 확인 → 명소 탐색 이용 흐름 안내          |
| 개인 추가 | `TouristAttractions.vue`      | 관광지 로딩·오류·외국어 안내·목록·지도 링크 표시          |

### Composition API

#### 반응형 상태 변수

| 상태 변수                                                   | 적용 위치와 역할                                            |
| ----------------------------------------------------------- | ----------------------------------------------------------- |
| `weatherList`                                               | API 응답과 실패 시 Mock Data를 함께 관리하는 도시 날씨 목록 |
| `searchQuery`                                               | 사용자가 입력한 도시·국가 검색어                            |
| `selectedCityInfo`                                          | 카드 선택, 필터 변경 결과를 표시하는 상태 문구              |
| `selectedHeroMode`                                          | `now`, `today`, `city` 보기 모드                            |
| `selectedTemperatureCategory`                               | 전체·더움·선선함·추움 필터                                  |
| `sortOrder`                                                 | 기본·기온 높은 순·낮은 순 정렬 기준                         |
| `todaySummaries`, `todaySummaryLoaded`                      | 오늘 최저·최고 기온 결과와 최초 호출 여부 캐시              |
| `isWeatherLoading`, `weatherApiError`, `lastUpdated`        | 메인 API의 로딩·오류·최근 갱신 상태                         |
| `cityData`, `forecastList`, `airQuality`                    | 상세 View의 선택 도시·24시간 예보·대기질 데이터             |
| `touristAttractions`, `isTourismLoading`, `tourismApiError` | 관광지 목록·로딩·오류 상태                                  |

#### 작성한 Computed

| Computed                                                 | 계산 내용                                  |
| -------------------------------------------------------- | ------------------------------------------ |
| `activeHeroMode`, `heroEyebrowLabel`                     | 현재 모드에 맞는 Hero 제목·설명·라벨 선택  |
| `modeWeatherList`                                        | 도시 모드일 때 국가별 대표 도시만 선택     |
| `filteredWeatherList`                                    | 검색어와 일치하는 도시·국가 필터링         |
| `categorizedWeatherList`                                 | 섭씨 원본 기온으로 더움·선선함·추움 분류   |
| `sortedWeatherList`                                      | 필터 결과를 기온 기준으로 정렬             |
| `displayTemp`, `displayFeelsLike`, `displayForecastList` | Store 단위에 맞춰 섭씨·화씨 표시값 계산    |
| `airQualityLabel`                                        | AQI 숫자를 좋음·보통·나쁨 등의 문구로 변환 |

#### 작성한 Watcher

| Watcher                              | 동작                                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| `watch(searchQuery)`                 | 검색어를 `?search=` URL Query와 동기화                       |
| `watch(selectedCityInfo)`            | 카드 선택과 상태 문구 변경 감지                              |
| `watch(sortOrder)`                   | 기온 정렬 기준 변경 감지                                     |
| `watch(selectedTemperatureCategory)` | 필터 변경 후 표시 도시 수와 상태 문구 갱신                   |
| `watch(selectedHeroMode)`            | Hero 문구·도시 수 갱신 및 `오늘` 모드 최초 선택 시 예보 요청 |
| `watchEffect()`                      | 검색어와 API 목록을 반응형으로 추적하는 과정 확인            |

### Vue Router

| 경로               | View                    | 설명                                        |
| ------------------ | ----------------------- | ------------------------------------------- |
| `/`                | `WeatherHomeView.vue`   | 메인 날씨·관광 대시보드                     |
| `/weather/:cityId` | `WeatherDetailView.vue` | `cityId`로 도시를 선택하는 동적 상세 페이지 |
| `/about`           | `WeatherAboutView.vue`  | 서비스 소개와 메인 이동                     |
| `/guide`           | `WeatherGuideView.vue`  | 개인 추가 View인 날씨 활용·여행 가이드      |
| `/:pathMatch(.*)*` | `NotFoundView.vue`      | Catch-all Route로 잘못된 주소 처리          |

- 모든 View는 `component: () => import(...)` 방식으로 Lazy Loading합니다.
- 도시 카드의 상세보기는 `router.push('/weather/' + cityId)`로 Programmatic Navigation합니다.
- 상세 View는 Mount 시점에 `route.params.cityId`를 읽어 도시 객체를 선택합니다.

### Pinia Store

`src/stores/configStore.js`에서 전역 설정과 최근 조회 정보를 관리합니다.

- state
  - `unit`: 현재 온도 단위 (`celsius` / `fahrenheit`)
  - `toggleCount`: 단위 변경 횟수
  - `recentCities`: 최근 조회 도시
  - `maxRecentCities`: 최근 조회 최대 저장 개수
- getters
  - `unitSymbol`: 현재 단위 기호 (`℃` / `℉`)
  - `unitLabel`: 현재 단위의 한글 이름
  - `recentCount`: 최근 조회 도시 개수
  - `latestCity`: 가장 최근에 조회한 도시
- actions
  - `toggleUnit()`: 섭씨·화씨 전환
  - `addRecentCity()`: 중복 없이 최근 도시 저장
  - `clearRecentCities()`: 최근 조회 기록 삭제

최근 조회 도시는 최대 5개까지 유지되며, 같은 도시를 다시 조회하면 목록의 맨 앞으로 이동합니다.

별도의 `recentCityStore.js`를 유지하지 않고 최근 조회 기능을 `configStore.js`에 합쳤습니다. 과제의 기본 단위 설정과 개인 추가 사용자 설정을 하나의 Store에서 관리하여 사용하는 컴포넌트가 하나의 Store만 참조하도록 정리했습니다.

### Axios 및 외부 API

날씨·대기질 요청은 `src/services/weatherApi.js`, 관광지 요청은 `src/services/tourismApi.js`에 Axios 인스턴스와 요청 함수를 분리했습니다.

- OpenWeatherMap Current Weather API
  - 현재 기온, 체감 온도, 습도, 풍속, 날씨 상태
- OpenWeatherMap 5 Day / 3 Hour Forecast API
  - 메인 오늘 탭의 도시별 최저·최고 기온
  - 상세 화면의 향후 24시간 예보와 강수 확률
- Open-Meteo Air Quality API
  - 미국 AQI, PM2.5, PM10, 자외선 지수
- OpenTripMap Places API
  - 도시 위도·경도 반경 15km 안의 주요 관광지 검색
  - 장소명, 종류별 이모지, 거리, 설명, 주소 표시
  - 원본 데이터에 따라 장소 정보가 영어 또는 현지어로 표시될 수 있음을 화면에 안내
- Axios timeout 및 401·429·네트워크 오류 처리
- 일부 도시 호출 실패 시 해당 도시만 Mock Data로 대체

API에서는 섭씨 원본 데이터를 받아 저장하며, 화씨 변환은 화면의 `computed`에서 처리합니다. 따라서 기온 정렬과 필터 기준은 단위 변경과 관계없이 일정하게 유지됩니다.

## 프로젝트 구조

```text
src/
├── App.vue
├── main.js
├── router/
│   └── index.js
├── stores/
│   └── configStore.js
├── services/
│   ├── weatherApi.js
│   └── tourismApi.js
├── data/
│   └── weatherCities.js
├── components/exercise/
│   ├── BaseDashboardCard.vue
│   ├── SearchBar.vue
│   ├── WeatherCard.vue
│   ├── WeatherHero.vue
│   ├── WeatherHeroModeSelector.vue
│   ├── UnitToggler.vue
│   ├── RecentCitiesPanel.vue
│   ├── WeatherApiStatus.vue
│   ├── WeatherTravelIntro.vue
│   └── TouristAttractions.vue
└── views/
    ├── WeatherHomeView.vue
    ├── WeatherDetailView.vue
    ├── WeatherAboutView.vue
    ├── WeatherGuideView.vue
    └── NotFoundView.vue
```

## 설치 및 실행

저장소의 `.env.example`을 복사하여 Git에서 제외되는 `.env.local`을 만들고 API Key를 입력합니다.

```sh
cp .env.example .env.local
```

```env
VITE_OPENWEATHER_API_KEY=발급받은_OpenWeatherMap_API_KEY
VITE_OPENTRIPMAP_API_KEY=발급받은_OpenTripMap_API_KEY
```

```sh
npm install
npm run dev
```

프로덕션 빌드:

```sh
npm run build
```

코드 검사:

```sh
npm run lint
```

## API Key 보안 관리

- OpenWeatherMap Key는 `VITE_OPENWEATHER_API_KEY`로 관리합니다.
- OpenTripMap Key는 `VITE_OPENTRIPMAP_API_KEY`로 관리합니다.
- 실제 Key가 저장되는 `.env`, `.env.*` 파일은 `.gitignore`에서 제외합니다.
- 변수 이름만 제공하는 `.env.example`은 Git에 포함합니다.
- 환경 변수를 변경한 후에는 Vite 개발 서버나 Build를 다시 실행해야 합니다.

OpenWeatherMap Key를 입력하지 않았거나 API 요청이 실패하면 대시보드는 기존 Mock Data를 표시합니다. OpenTripMap Key가 없으면 상세 화면에 Key 설정 안내가 표시됩니다. Open-Meteo 대기질 API는 별도의 Key 없이 동작합니다.

> `VITE_` 환경 변수는 브라우저용 Build 결과에 포함됩니다. Git 소스 노출은 방지할 수 있지만 완전한 비밀 보관 방식은 아니므로, 각 API 서비스에서 도메인 제한과 사용량 제한을 함께 설정하는 것이 안전합니다.

## ESLint 품질 점검 결과

제출 전 아래 명령을 실행했습니다.

```sh
npm run lint
```

`npm run lint`는 프로젝트에 설정된 Oxlint와 ESLint를 순서대로 실행합니다.

| 검사 도구  | 최종 결과                |
| ---------- | ------------------------ |
| Oxlint     | `0 warnings`, `0 errors` |
| ESLint     | Error 없이 통과          |
| Vite Build | `npm run build` 성공     |

- Vue Template, Script, scoped Style을 포함한 `src` 전체를 검사했습니다.
- 관광지 이미지 방식, 환경 변수 전환, 가독성 개선 이후에도 다시 검사했습니다.
- 프로덕션 Build 결과는 `dist/`에 정상 생성되는 것을 확인했습니다.

## Build 및 Hosting

ESLint 검사와 프로덕션 Build를 실행합니다.

```sh
npm run lint
npm run build
```

Build 결과는 `dist/` 폴더에 생성됩니다. 배포 서버에는 소스 전체가 아니라 `dist/` 내부의 정적 파일을 Hosting 합니다. Vue Router의 동적 경로를 직접 열어도 동작하려면 서버에서 존재하지 않는 경로를 `index.html`로 연결하는 SPA fallback 설정이 필요합니다.

배포 전 로컬에서 Build 결과를 확인합니다.

```sh
npm run preview
```

배포 서비스의 환경 변수 설정에도 다음 이름을 동일하게 등록한 다음 새로 Build해야 합니다.

```env
VITE_OPENWEATHER_API_KEY=발급받은_OpenWeatherMap_API_KEY
VITE_OPENTRIPMAP_API_KEY=발급받은_OpenTripMap_API_KEY
```

### Hosting: GitHub Pages

GitHub Actions 자동 배포는 사용하지 않습니다. 로컬 `.env.local`에 API Key를 입력한 상태에서 `npm run build`를 실행하고, 생성된 `dist/` 내부 정적 파일을 GitHub Pages에 Hosting 됩니다. `.env.local`은 Git에 올리지 않으며, 공개된 웹 애플리케이션에서 사용하는 API Key에는 각 API 제공 사이트에서 허용 도메인과 사용량 제한을 설정합니다.

GitHub Pages에 올릴 때는 저장소 경로에 맞는 Vite `base` 설정과 Vue Router 동적 경로의 새로고침을 위한 SPA fallback 설정을 확인해야 합니다.
