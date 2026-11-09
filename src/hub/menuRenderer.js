// Dibujo del menú. Solo lee el estado { userName, selectedIndex, labels }.
import {
  HALF,
  MENU_LAYOUT,
  MENU_TITLE,
  MENU_USER_LABEL,
  MENU_USER_MAX_WIDTH,
  MENU_USER_MIN_FONT,
  MENU_OPTION_BG,
  MENU_OPTION_TEXT_SELECTED,
  MENU_BORDER_WIDTH,
  MENU_HINT,
  MENU_HINT_Y,
  MENU_HINT_FONT_SIZE,
  MENU_HINT_COLOR,
  BACKGROUND_COLOR,
  FONT_FAMILY,
} from '../constants.js';
import { getOptionRects } from './menu.js';

export function createMenuRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width * HALF;

  // Nombre de usuario completo: reduce la fuente si no cabe
  function drawUser(userName) {
    const text = MENU_USER_LABEL + userName;
    let size = MENU_LAYOUT.userFontSize;
    ctx.font = `${size}px ${FONT_FAMILY}`;
    while (ctx.measureText(text).width > MENU_USER_MAX_WIDTH && size > MENU_USER_MIN_FONT) {
      size--;
      ctx.font = `${size}px ${FONT_FAMILY}`;
    }
    ctx.fillStyle = MENU_LAYOUT.normalColor;
    ctx.fillText(text, centerX, MENU_LAYOUT.userY);
  }

  return function render(menu) {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = MENU_LAYOUT.selectedColor;
    ctx.font = `bold ${MENU_LAYOUT.titleFontSize}px ${FONT_FAMILY}`;
    ctx.fillText(MENU_TITLE, centerX, MENU_LAYOUT.titleY);

    drawUser(menu.userName);

    const rects = getOptionRects(MENU_LAYOUT, menu.labels.length);
    ctx.font = `bold ${MENU_LAYOUT.optionFontSize}px ${FONT_FAMILY}`;
    rects.forEach((r, i) => {
      const selected = i === menu.selectedIndex;
      ctx.fillStyle = selected ? MENU_LAYOUT.selectedColor : MENU_OPTION_BG;
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.lineWidth = MENU_BORDER_WIDTH;
      ctx.strokeStyle = selected ? MENU_LAYOUT.selectedColor : MENU_LAYOUT.normalColor;
      ctx.strokeRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle = selected ? MENU_OPTION_TEXT_SELECTED : MENU_LAYOUT.normalColor;
      ctx.fillText(menu.labels[i], r.x + r.w * HALF, r.y + r.h * HALF);
    });

    ctx.fillStyle = MENU_HINT_COLOR;
    ctx.font = `${MENU_HINT_FONT_SIZE}px ${FONT_FAMILY}`;
    ctx.fillText(MENU_HINT, centerX, MENU_HINT_Y);
  };
}
