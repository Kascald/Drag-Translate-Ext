const mainToggle = document.getElementById("mainToggle");
const disableSiteBtn = document.getElementById("disableSite");
const openOptionsBtn = document.getElementById("openOptions");

console.log("[Popup] 스크립트 로드됨");

// 1. 초기 상태 로드
chrome.storage.sync.get({ isEnabled: true }, (data) => {
  console.log("[Popup] 초기 설정 로드:", data);
  mainToggle.checked = data.isEnabled;
});

// 2. 활성화 토글
mainToggle.addEventListener("change", () => {
  const isEnabled = mainToggle.checked;
  console.log("[Popup] 기능 활성화 변경:", isEnabled);
  chrome.storage.sync.set({ isEnabled }, () => {
    console.log("[Popup] 활성화 상태 저장 완료");
  });
});

// 3. 현재 사이트 제외
disableSiteBtn.addEventListener("click", () => {
  console.log("[Popup] '현재 사이트 제외' 클릭됨");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("[Popup] 현재 탭 정보:", tabs[0]);

    if (!tabs[0]?.url) {
      console.error("[Popup] 탭 URL을 읽을 수 없음 (권한 확인 필요)");
      return;
    }

    try {
      const url = new URL(tabs[0].url);
      const domain = url.hostname;
      console.log("[Popup] 추출된 도메인:", domain);

      chrome.storage.sync.get({ disabledDomains: [] }, (data) => {
        const domains = new Set(data.disabledDomains);

        if (domains.has(domain)) {
          console.warn("[Popup] 이미 리스트에 존재함:", domain);
          alert("이미 제외된 사이트입니다.");
          return;
        }

        domains.add(domain);
        chrome.storage.sync.set(
          { disabledDomains: Array.from(domains) },
          () => {
            console.log("[Popup] 제외 리스트 저장 완료:", Array.from(domains));
            alert(`[${domain}] 제외 완료`);
            window.close();
          },
        );
      });
    } catch (e) {
      console.error("[Popup] URL 파싱 에러:", e);
    }
  });
});

// 4. 설정 페이지 열기
openOptionsBtn.addEventListener("click", () => {
  console.log("[Popup] 설정 페이지 열기 시도");
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage(() => {
      console.log("[Popup] 설정 페이지 호출 완료");
    });
  } else {
    console.error("[Popup] openOptionsPage 메소드 사용 불가");
    window.open(chrome.runtime.getURL("options.html"));
  }
});
