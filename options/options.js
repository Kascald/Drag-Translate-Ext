const inputApiKey = document.getElementById("apiKey");
const selectTargetLang = document.getElementById("targetLang");
const checkboxSkipNative = document.getElementById("skipNative");
const saveBtn = document.getElementById("saveBtn");
const statusText = document.getElementById("status");

// 저장된 설정 로드 (초기값 설정 포함)
chrome.storage.sync.get(
  {
    deeplApiKey: "",
    targetLang: "KO",
    skipNative: false,
  },
  (items) => {
    inputApiKey.value = items.deeplApiKey;
    selectTargetLang.value = items.targetLang;
    checkboxSkipNative.checked = items.skipNative;
  },
);

// 설정 변경 사항 일괄 저장
saveBtn.addEventListener("click", () => {
  const key = inputApiKey.value.trim();
  const lang = selectTargetLang.value;
  const skip = checkboxSkipNative.checked;

  chrome.storage.sync.set(
    {
      deeplApiKey: key,
      targetLang: lang,
      skipNative: skip,
    },
    () => {
      // 저장 완료 UI 피드백
      statusText.textContent = "설정이 저장되었습니다!";
      statusText.style.color = "#4CAF50";

      setTimeout(() => {
        statusText.textContent = "";
      }, 2000);
    },
  );
});

const domainListContainer = document.getElementById("domainList"); // HTML에 추가 필요

// 제외된 도메인 리스트 렌더링
const renderDomainList = () => {
  chrome.storage.sync.get({ disabledDomains: [] }, (items) => {
    domainListContainer.innerHTML = ""; // 기존 리스트 초기화

    if (items.disabledDomains.length === 0) {
      domainListContainer.innerHTML = "<li>제외된 사이트가 없습니다.</li>";
      return;
    }

    items.disabledDomains.forEach((domain) => {
      const li = document.createElement("li");
      li.textContent = domain;

      const delBtn = document.createElement("button");
      delBtn.textContent = "삭제";
      delBtn.style.marginLeft = "10px";

      delBtn.onclick = () => {
        const updatedDomains = items.disabledDomains.filter(
          (d) => d !== domain,
        );
        chrome.storage.sync.set(
          { disabledDomains: updatedDomains },
          renderDomainList,
        );
      };

      li.appendChild(delBtn);
      domainListContainer.appendChild(li);
    });
  });
};

// 페이지 로드 시 리스트 출력
document.addEventListener("DOMContentLoaded", renderDomainList);