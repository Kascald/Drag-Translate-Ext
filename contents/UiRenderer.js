import "../contents/style/style.css";

class UiRenderer {
  constructor() {
    this.popup = null;
  }

  // 기존 팝업 제거 및 상태 초기화
  removePopup() {
    const existingPopup = document.getElementById("translate-ext-popup");
    if (existingPopup) {
      existingPopup.remove();
      this.popup = null;
    }
  }

  // 팝업 생성 및 초기 위치 설정
  render(x, y) {
    this.removePopup();

    const popup = document.createElement("div");
    popup.id = "translate-ext-popup";
    popup.textContent = "번역 중 . . .";

    // 계산된 좌표 적용
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    // 팝업 내부 클릭 시 document의 mouseup 이벤트 전파 방지 (팝업 닫힘 방어)
    popup.addEventListener("mousedown", (e) => {
      e.stopPropagation();
    });

    document.body.appendChild(popup);
    this.popup = popup;

    return popup;
  }

  // 번역 결과 업데이트 및 복사 기능 주입
  updatePopupText(text) {
    if (this.popup) {
      // 텍스트 영역 및 복사 버튼 렌더링
      this.popup.innerHTML = `
      <div style="margin-bottom: 8px; word-break: break-all;">${text}</div>
      <div style="text-align: right;">
        <button id="ext-copy-btn" style="
          font-size: 11px; 
          cursor: pointer; 
          background: #444; 
          color: #fff; 
          border: none; 
          padding: 2px 6px; 
          border-radius: 3px;
        ">복사</button>
      </div>
    `;

      // 복사 기능 구현 (Clipboard API)
      this.popup
        .querySelector("#ext-copy-btn")
        .addEventListener("click", (e) => {
          e.stopPropagation(); // 버튼 클릭 시 팝업 닫힘 방지
          navigator.clipboard.writeText(text).then(() => {
            e.target.textContent = "완료!";
            setTimeout(() => (e.target.textContent = "복사"), 1000);
          });
        });
    }
  }
}

// 싱글톤 인스턴스로 export
export default new UiRenderer();
