import { MARIO_KEYS } from '../../constants.js';

/**
 * Escucha el teclado de Mario.
 * - Teclas mantenidas (izquierda/derecha): se escriben en el objeto `held`.
 * - Eventos puntuales (flechas, Espacio, Enter): se avisan con onPress(key).
 * Devuelve dispose() para quitar las escuchas.
 * @param {{left:boolean,right:boolean}} held
 * @param {(key: string) => void} onPress
 * @returns {() => void}
 */
export function initInput(held, onPress) {
  const pressable = new Set(Object.values(MARIO_KEYS));

  function clearHeld() {
    held.left = false;
    held.right = false;
  }

  function onKeyDown(event) {
    if (!pressable.has(event.key)) return;
    event.preventDefault(); // evita scroll de la página con flechas y Espacio
    if (event.key === MARIO_KEYS.LEFT) held.left = true;
    if (event.key === MARIO_KEYS.RIGHT) held.right = true;
    if (!event.repeat) onPress(event.key);
  }

  function onKeyUp(event) {
    if (event.key === MARIO_KEYS.LEFT) held.left = false;
    if (event.key === MARIO_KEYS.RIGHT) held.right = false;
  }

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', clearHeld);
  return () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('blur', clearHeld);
    clearHeld();
  };
}
