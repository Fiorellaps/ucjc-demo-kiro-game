import { CANVAS_WIDTH, CANVAS_HEIGHT, DOM_IDS } from './constants.js';
import { createHub } from './hub/hub.js';
import { createAuth } from './hub/auth.js';
import { registry } from './hub/registry.js';

/** Carga el sprite; devuelve null si falla para usar el dibujo de respaldo. */
function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function main() {
  const canvas = document.getElementById(DOM_IDS.CANVAS);
  // Tamaño fijo y compartido, se establece una sola vez
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  // El bucle no arranca hasta que la imagen cargue o falle
  const kiroImage = await loadImage('kiro-logo.png');
  createHub({ canvas, kiroImage, registry, auth: createAuth() });
}

main();
