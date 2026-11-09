// Game_Menu: lógica pura (sin DOM). Se puede probar en Node.
import { MENU_LAYOUT } from '../constants.js';

// Selección cíclica
export function moveSelection(index, delta, count) {
  return (((index + delta) % count) + count) % count;
}

// Rectángulos { x, y, w, h } de las opciones, de arriba abajo
export function getOptionRects(layout, count) {
  const rects = [];
  for (let i = 0; i < count; i++) {
    rects.push({
      x: layout.optionX,
      y: layout.optionY + i * (layout.optionHeight + layout.optionGap),
      w: layout.optionWidth,
      h: layout.optionHeight,
    });
  }
  return rects;
}

// Índice de la opción bajo (x, y) en coordenadas de canvas, o null
export function hitTest(x, y, layout, count) {
  const rects = getOptionRects(layout, count);
  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return i;
  }
  return null;
}

// Convierte un clic (clientX/Y) a coordenadas de canvas, compensando el escalado CSS
export function clientToCanvas(clientX, clientY, canvasRect, canvasWidth, canvasHeight) {
  return {
    x: (clientX - canvasRect.left) * (canvasWidth / canvasRect.width),
    y: (clientY - canvasRect.top) * (canvasHeight / canvasRect.height),
  };
}

export function menuHitFromEvent(event, canvas, count, layout = MENU_LAYOUT) {
  const rect = canvas.getBoundingClientRect();
  const p = clientToCanvas(event.clientX, event.clientY, rect, canvas.width, canvas.height);
  return hitTest(p.x, p.y, layout, count);
}
