export default {
  calc: function(rect, text) {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    const top = rect.bottom + scrollY + 10;
    const left = rect.left + scrollX + (rect.width / 2);

    console.log(`선택된 텍스트 : ${text}`);
    console.log(`말풍선 출력 위치 : top=${top}px , left= ${left}px`);

    return {
      top: top, 
      left : left
    };
  }
}