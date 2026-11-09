import {
  GAME_STATES,
  MARIO_LIVES,
  MARIO_KEYS,
  CANVAS_WIDTH,
  STOMP_POINTS,
  STOMP_BOUNCE_SPEED,
  HALF,
} from '../../constants.js';
import { createWorkingLevel, levelWidthPx, levelHeightPx } from './level.js';
import {
  createPlayer,
  createEnemies,
  respawnEnemies,
  applyHorizontal,
  applyGravity,
  jump,
  moveAndCollide,
  moveEnemies,
  collectCoins,
  touchesGoal,
  overlapsEnemy,
  isStomp,
} from './entities.js';
import { initInput } from './input.js';

/** Teclas mantenidas (las escribe input.js; game.js solo las lee). */
export const held = { left: false, right: false };

function createInitialState() {
  const level = createWorkingLevel();
  return {
    gameState: GAME_STATES.START,
    level,
    player: createPlayer(),
    enemies: createEnemies(level), // vacía las celdas 5 del nivel de trabajo
    score: 0,
    lives: MARIO_LIVES,
    cameraX: 0,
  };
}

/** Estado único del juego. Se muta solo desde este módulo. */
export const state = createInitialState();

/** Reinicia todo desde la plantilla originalLevel: velocidad, cámara y puntos a 0. */
export function resetGame() {
  Object.assign(state, createInitialState());
}

function restartFromEnd() {
  resetGame();
  state.gameState = GAME_STATES.START;
}

const ARROW_KEYS = [MARIO_KEYS.LEFT, MARIO_KEYS.RIGHT, MARIO_KEYS.UP, MARIO_KEYS.DOWN];

/** Eventos puntuales de teclado según el estado actual. */
export function handlePress(key) {
  switch (state.gameState) {
    case GAME_STATES.START:
      if (ARROW_KEYS.includes(key)) state.gameState = GAME_STATES.PLAYING;
      break;
    case GAME_STATES.PLAYING:
      if (key === MARIO_KEYS.JUMP) jump(state.player);
      break;
    default:
      if (key === MARIO_KEYS.ENTER) restartFromEnd();
  }
}

let disposeInput = null;

/** Prepara una partida nueva y registra el teclado. */
export function start() {
  stop();
  resetGame();
  disposeInput = initInput(held, handlePress);
}

/** Quita las escuchas de teclado del juego. */
export function stop() {
  if (disposeInput) disposeInput();
  disposeInput = null;
  held.left = false;
  held.right = false;
}

/** Estado para el renderer (solo lectura). */
export function getState() {
  return state;
}

/** Cámara centrada en el personaje y limitada a los bordes del nivel. */
function updateCamera() {
  const target = state.player.x + state.player.w * HALF - CANVAS_WIDTH * HALF;
  const maxCamera = levelWidthPx() - CANVAS_WIDTH;
  state.cameraX = Math.min(Math.max(target, 0), maxCamera);
}

/** Resta una vida; sin vidas termina la partida, si no reposiciona. */
function loseLife() {
  state.lives--;
  if (state.lives <= 0) {
    state.gameState = GAME_STATES.GAME_OVER;
    return;
  }
  state.player = createPlayer();
  respawnEnemies(state.enemies);
  updateCamera();
}

/** Pisotón o daño con los enemigos vivos. Devuelve true si perdió una vida. */
function checkEnemies(prev) {
  for (const enemy of state.enemies) {
    if (!enemy.alive || !overlapsEnemy(state.player, enemy)) continue;
    if (isStomp(state.player, enemy, prev)) {
      enemy.alive = false;
      state.score += STOMP_POINTS;
      state.player.vy = STOMP_BOUNCE_SPEED;
      state.player.grounded = false;
    } else {
      loseLife();
      return true;
    }
  }
  return false;
}

/** Un frame de lógica. */
export function update() {
  if (state.gameState !== GAME_STATES.PLAYING) return;

  applyHorizontal(state.player, held);
  applyGravity(state.player);
  const prev = { y: state.player.y, vy: state.player.vy };
  moveAndCollide(state.player, state.level);
  state.score += collectCoins(state.player, state.level);

  moveEnemies(state.enemies, state.level);
  if (checkEnemies(prev)) return;

  if (state.player.y > levelHeightPx()) {
    loseLife();
    return;
  }

  updateCamera();
  if (touchesGoal(state.player, state.level)) {
    state.gameState = GAME_STATES.LEVEL_COMPLETE;
  }
}
