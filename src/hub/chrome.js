// Barra de botones y lista de controles (DOM).
import { DOM_IDS } from '../constants.js';

const byId = (id) => document.getElementById(id);

// Conecta los botones. Devuelve la API para que el Hub actualice la vista.
export function createChrome({ onLogout, onMenu }) {
  byId(DOM_IDS.LOGOUT).addEventListener('click', onLogout);
  byId(DOM_IDS.MENU).addEventListener('click', onMenu);

  return {
    // hubState: 'login' | 'menu' | 'game'; controls: textos del juego activo
    show(hubState, controls = []) {
      const inLogin = hubState === 'login';
      const inGame = hubState === 'game';
      byId(DOM_IDS.BAR).hidden = inLogin;
      byId(DOM_IDS.MENU).hidden = !inGame;
      const list = byId(DOM_IDS.CONTROLS);
      list.replaceChildren();
      if (inGame) {
        for (const text of controls) {
          const li = document.createElement('li');
          li.textContent = text;
          list.appendChild(li);
        }
      }
      list.hidden = !inGame;
      this.showMessage('');
    },
    showMessage(text) {
      byId(DOM_IDS.MESSAGE).textContent = text;
    },
  };
}
