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
