chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    // 비동기 처리를 위해 true 반환 유지
    translateWithDeepL(request, sendResponse);
    return true;
  }
});

async function translateWithDeepL(request, sendResponse) {
  const API_URL = "https://api-free.deepl.com/v2/translate";

  try {
    const res = await chrome.storage.sync.get(["deeplApiKey"]);
    const DEEPL_API_KEY = res.deeplApiKey?.trim();

    if (!DEEPL_API_KEY) {
      sendResponse({ translatedText: "설정에서 API 키를 입력해주세요." });
      return;
    }

    const { text, targetLang, context } = request;
    const params = new URLSearchParams();
    params.append("auth_key", DEEPL_API_KEY);
    params.append("text", text);
    params.append("target_lang", targetLang);

    // context 파라미터 활용 (일어 등 중의적 표현 보정용)
    if (context) {
      params.append("context", context);
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API 에러 발생 (${response.status}):`, errorText);
      throw new Error(`HTTP_${response.status}`);
    }

    const data = await response.json();

    if (data.translations && data.translations.length > 0) {
      sendResponse({ translatedText: data.translations[0].text });
    } else {
      sendResponse({ translatedText: "번역 결과가 없습니다." });
    }
  } catch (error) {
    console.error("통신 실패 상세:", error);
    let errorMsg = "번역 실패";
    if (error.message.includes("403")) errorMsg = "403: API 키 또는 권한 오류";

    sendResponse({ translatedText: errorMsg });
  }
}
