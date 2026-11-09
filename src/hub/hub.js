// Hub: hubState, transiciones, bucle único de requestAnimationFrame y teclado del Hub.
import {
  HUB_STATES,
  MESSAGES,
  KEYS,
  IGNORED_KEY_TARGETS,
} from '../constants.js';
import { moveSelection, menuHitFromEvent } from './menu.js';
import { createMenuRenderer } from './menuRenderer.js';
import { createChrome } from './chrome.js';
import {
  initLoginScreen,
  resetLoginScreen,
  showLoginScreen,
  hideLoginScreen,
} from './login.js';

// ui permite inyectar sustitutos (tests); por defecto usa el DOM real.
export function createHub({ canvas, kiroImage, registry, auth, ui, win = window }) {
  const loop = { rafId: null };
  const renderers = new Map();
  let hubState = HUB_STATES.LOGIN;
  let selectedIndex = 0;
  let userName = '';
  let activeGame = null;
  let activeRender = null;

  const view = ui ?? {
    login: { init: initLoginScreen, reset: resetLoginScreen, show: showLoginScreen, hide: hideLoginScreen },
    chrome: createChrome({ onLogout: () => logout(), onMenu: () => enterMenu() }),
    menuRenderer: createMenuRenderer(canvas),
  };

  // --- Bucle único ---
  function frame() {
    if (hubState === HUB_STATES.GAME && activeGame) {
      activeGame.update();
      activeRender(activeGame.getState());
    } else if (hubState === HUB_STATES.MENU) {
      view.menuRenderer({ userName, selectedIndex, labels: registry.map((g) => g.label) });
    }
    loop.rafId = win.requestAnimationFrame(frame);
  }

  function cancelLoop() {
    if (loop.rafId !== null) win.cancelAnimationFrame(loop.rafId);
    loop.rafId = null;
  }

  function startLoop() {
    cancelLoop(); // nunca hay dos bucles
    loop.rafId = win.requestAnimationFrame(frame);
  }

  function stopActiveGame() {
    if (activeGame) activeGame.stop();
    activeGame = null;
    activeRender = null;
  }

  // --- Transiciones ---
  function enterLogin() {
    cancelLoop();
    stopActiveGame();
    hubState = HUB_STATES.LOGIN;
    canvas.hidden = true;
    view.chrome.show(hubState);
    view.login.show();
  }

  function enterMenu() {
    const session = auth.readSession();
    if (session === null) {
      enterLogin(); // sin sesión válida no se llega al menú
      return;
    }
    cancelLoop();
    stopActiveGame();
    userName = session;
    selectedIndex = 0;
    hubState = HUB_STATES.MENU;
    view.login.hide();
    canvas.hidden = false;
    view.chrome.show(hubState);
    // Si el foco quedó en un input/botón, Enter del menú se ignoraría
    const focused = typeof document !== 'undefined' ? document.activeElement : null;
    if (focused && focused.blur) focused.blur();
    startLoop();
  }

  function enterGame(index) {
    const game = registry[index];
    if (!game) return;
    cancelLoop();
    stopActiveGame(); // stop() del anterior antes de start() del siguiente
    if (!renderers.has(game.id)) {
      renderers.set(game.id, game.createRenderer(canvas, kiroImage));
    }
    activeGame = game;
    activeRender = renderers.get(game.id);
    game.start(); // resetGame() antes del primer update()
    hubState = HUB_STATES.GAME;
    view.chrome.show(hubState, game.controls);
    startLoop();
  }

  function logout() {
    if (!auth.logout()) {
      view.chrome.showMessage(MESSAGES.LOGOUT_FAILED);
      return;
    }
    view.login.reset();
    enterLogin();
  }

  // --- Teclado del Hub ---
  function handleKeyDown(event) {
    const tag = event.target && event.target.tagName;
    const onControl = IGNORED_KEY_TARGETS.includes(tag);
    if (hubState === HUB_STATES.GAME) {
      // Escape no activa botones, así que se permite aunque haya uno enfocado
      if (event.key === KEYS.ESCAPE) enterMenu();
      return;
    }
    if (hubState !== HUB_STATES.MENU || onControl) return;
    if (event.key === KEYS.UP || event.key === KEYS.DOWN) {
      event.preventDefault();
      const delta = event.key === KEYS.UP ? -1 : 1;
      selectedIndex = moveSelection(selectedIndex, delta, registry.length);
    } else if (event.key === KEYS.ENTER && !event.repeat) {
      event.preventDefault();
      enterGame(selectedIndex);
    }
  }

  function handleCanvasClick(event) {
    if (hubState !== HUB_STATES.MENU) return;
    const hit = menuHitFromEvent(event, canvas, registry.length);
    if (hit === null) return;
    selectedIndex = hit;
    enterGame(hit);
  }

  function init() {
    win.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('click', handleCanvasClick);
    view.login.init(auth, () => enterMenu());
    if (auth.readSession() !== null) enterMenu();
    else enterLogin();
  }

  init();

  return {
    getHubState: () => hubState,
    getSelectedIndex: () => selectedIndex,
    enterLogin,
    enterMenu,
    enterGame,
    logout,
    startLoop,
    cancelLoop,
    handleKeyDown,
  };
}
