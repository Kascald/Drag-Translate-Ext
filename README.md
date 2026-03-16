# 🚀 Drag-Translate_Ext

> 드래그 한 번으로 DeepL의 강력한 번역을 경험하세요.  

---

## ✨ Key Features

- **Instant Translation:** 텍스트 드래그 시 즉시 번역 팝업 출력
- **Smart Context:** 일본어 번역 시 DeepL `context` 파라미터를 활용하여 시적/중의적 표현 보정
- **Optimized Performance:** - `chrome.storage` 캐싱을 통해 불필요한 I/O 최소화
  - 한국어 포함 시 API 호출을 자동 차단하는 **Native Language Filter** 탑재
- **Clean UI:** 다크 모드 기반의 깔끔한 디자인 및 원클릭 복사 버튼 제공

---

## 🌐 Supported Languages (Detection & Filter)

현재 버전(v0.1.0)에서는 아래 언어들에 대한 판별 및 필터링을 지원합니다.

- **번역 대상 언어:** 일본어(Japanese), 영어(English), 중국어(Chinese)
- **필터링(Skip) 언어:** 한국어(Korean) - 모국어 포함 시 API 호출을 차단하여 효율성 극대화
- **특화 기능:** 일본어 감성 문구/가사 번역 시 Context 튜닝 적용

---

## 🛠 Tech Stack

- **Frontend:** JavaScript (ES6+), CSS3
- **Build Tool:** Vite
- **API:** DeepL API (Free/Pro)
- **Architecture:** Module-based Clean Structure

---

## ⚙️ Installation & Setup

### 1. Build
이 프로젝트는 Vite를 사용합니다. 의존성 설치 후 빌드를 진행해주세요.
```bash
npm install
npm run build

```

### 2. Load Extension

1. 브라우저에서 [`chrome://extensions`](chrome://extensions) 접속 (Edge: [`edge://extensions`](edge://extensions))
2. **개발자 모드** 활성화
3. **압축해제된 확장 프로그램을 로드** 클릭 후 프로젝트의 `dist` 폴더 선택

### 3. API Key Setting

확장 프로그램 옵션 페이지에서 본인의 **DeepL API Key**를 입력하면 바로 사용 가능합니다.

---

## 💡 Why this project?

### 1. UX 최적화: "단 한 번의 액션으로 번역까지"
 기존 크로미움 기반 브라우저의 번역 확장 프로그램(구글 번역 등)은 텍스트 선택 후 **별도의 버튼을 클릭**하거나, **우클릭 메뉴에서 '번역'을 선택**해야 하는 번거로운 Depth가 존재했습니다.  
 이 프로젝트는 **"드래그 즉시 번역(Instant-on-Selection)"** 방식을 채택하여 사용자의 액션을 최소화하고 탐색의 연속성을 유지하는 것을 목표로 시작되었습니다.

### 2. 기술적 보완: "기계 번역의 한계를 Context 파라미터로 극복"
 제작 과정에서 단순 API 호출만으로는 은유적이거나 중의적인 표현(예: 특히 일본어 번역 시)의 뉘앙스가 뭉개지는 한계를 발견했습니다.  

 > 이를 보완하기 위해 **DeepL API의 `context` 파라미터를 동적으로 주입**하는 로직을 구현했습니다.
 이를 통해 기계적인 직역을 넘어 문맥에 맞는 자연스러운 번역 결과물을 내도록했습니다.
---

## 📄 License

이 프로젝트는 [MIT License](https://opensource.org/licenses/MIT)를 따릅니다.