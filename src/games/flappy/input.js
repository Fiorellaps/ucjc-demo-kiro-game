import { FLAPPY_KEYS } from '../../constants.js';

/**
 * Escucha Espacio (aleteo) y Enter (reinicio).
 * Devuelve dispose() para quitar la escucha.
 * @param {{onFlap: () => void, onEnter?: () => void}} handlers
 * @returns {() => void}
 */
export function initInput({ onFlap, onEnter }) {
  function onKeyDown(event) {
    if (event.key === FLAPPY_KEYS.FLAP) {
      event.preventDefault(); // evita el scroll de la página
      if (!event.repeat) onFlap();
    } else if (event.key === FLAPPY_KEYS.RESTART) {
      if (!event.repeat && onEnter) onEnter();
    }
  }
  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
}
