import { DIRECTIONS } from '../../constants.js';

const ENTER_KEY = 'Enter';

/**
 * Escucha flechas y Enter del teclado.
 * Devuelve dispose() para quitar la escucha.
 * @param {{onDirection: (d: {x:number,y:number}) => void, onEnter?: () => void}} handlers
 * @returns {() => void}
 */
export function initInput({ onDirection, onEnter }) {
  function onKeyDown(event) {
    if (event.key === ENTER_KEY) {
      if (!event.repeat && onEnter) onEnter();
      return;
    }
    const direction = DIRECTIONS[event.key];
    if (!direction) return;
    event.preventDefault(); // evita el scroll de la página
    onDirection(direction);
  }
  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
}
