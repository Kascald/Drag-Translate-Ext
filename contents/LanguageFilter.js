class LanguageFilter {
  constructor() {
    // 언어별 판별 정규식
    this.patterns = {
      korean: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
      japanese: /[ぁ-んァ-ヶ]/,
      chinese: /[\u4E00-\u9FFF]/,
      kanji: /[\u4E00-\u9FFF]/, // 일어 한자 포함
    };
  }

  /**
   * 번역 스킵 여부 판별
   * @param {string} text
   * @param {boolean} skipNative (설정) 모국어 제외 여부
   */
  shouldSkip(text, skipNative) {
    if (!skipNative) return false;

    // 모국어(한글) 포함 시 API 호출 생략 (비용 절감)
    // 추후 설정에서 제외 언어 커스텀 가능하도록 확장 예정
    return this.patterns.korean.test(text);
  }

  // 일본어 텍스트 여부 확인 (Context 파라미터 적용 판단용)
  isJapanese(text) {
    // 히라가나/가타카나 포함 시 일어로 간주
    return this.patterns.japanese.test(text);
  }
}

export default new LanguageFilter();
