import locationCalc from "./text_loc_calculator.js";
import uiRenderer from "./UiRenderer.js";
import langFilter from "./LanguageFilter.js";

// 설정값 메모리 캐싱 (mouseup 시 스토리지 접근 오버헤드 방지)
let cachedSettings = {
  skipNative: false,
  targetLang: "KO",
  isEnabled: true,
  disabledDomains: [],
};

// 스토리지 데이터 동기화
const updateSettings = () => {
  chrome.storage.sync.get(
    {
      skipNative: false,
      targetLang: "KO",
      isEnabled: true,
      disabledDomains: [],
    },
    (items) => {
      cachedSettings = items;
    },
  );
};

// 초기화 및 실시간 설정 변경 감지
updateSettings();
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync") {
    updateSettings();
  }
});

document.addEventListener("mouseup", (e) => {
  uiRenderer.removePopup();

  // 캐시된 설정 로드 확인
  if (!cachedSettings.isEnabled) return;
  if (cachedSettings.disabledDomains.includes(window.location.hostname)) return;

  // 텍스트 추출 및 기본 검증
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  if (!selectedText) return;

  // 필터링 체크 (모국어 등 스킵 조건 확인)
  if (langFilter.shouldSkip(selectedText, cachedSettings.skipNative)) {
    console.log("필터링 조건에 의해 번역을 생략합니다.");
    return;
  }

  // 입력 폼/수정 가능 영역 제외
  const target = e.target;
  if (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable
  ) {
    return;
  }

  // 좌표 계산 및 팝업 초기 렌더링
  const range = selection.getRangeAt(0);
  const targetRect = range.getBoundingClientRect();
  const { top, left } = locationCalc.calc(targetRect, selectedText);

  // 언어별 맥락(Context) 판단 및 번역 요청
  uiRenderer.render(left, top, selectedText);

  const isJp = langFilter.isJapanese(selectedText);
  chrome.runtime.sendMessage(
    {
      action: "translate",
      text: selectedText,
      targetLang: cachedSettings.targetLang,
      context: isJp
        ? "This is a Japanese text, possibly lyrics or emotional prose. Translate naturally, preserving metaphors and nuanced meanings."
        : "",
    },
    (response) => {
      if (chrome.runtime.lastError) {
        uiRenderer.updatePopupText("통신 에러 발생");
        return;
      }

      if (response && response.translatedText) {
        uiRenderer.updatePopupText(response.translatedText);
      } else {
        uiRenderer.updatePopupText("번역 실패");
      }
    },
  );
});
