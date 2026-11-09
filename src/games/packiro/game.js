import { GAME_STATES, INITIAL_LIVES } from '../../constants.js';
import { createWorkingMaze, countDots } from './maze.js';
import {
  createPlayer,
  createGhosts,
  movePlayer,
  moveGhosts,
  hitsGhost,
} from './entities.js';
import { initInput } from './input.js';

/** Estado único del juego. Se muta solo desde este módulo. */
export const state = {
  gameState: GAME_STATES.START,
  maze: createWorkingMaze(),
  player: createPlayer(),
  ghosts: createGhosts(),
  score: 0,
  lives: INITIAL_LIVES,
};

/** Reinicia todo desde la plantilla originalMaze, incluidos los timers. */
export function resetGame() {
  state.maze = createWorkingMaze();
  state.player = createPlayer(); // timer y direcciones a cero
  state.ghosts = createGhosts(); // timers a cero
  state.score = 0;
  state.lives = INITIAL_LIVES;
}

/** Reposiciona personajes tras perder una vida (el laberinto se conserva). */
function respawnCharacters() {
  state.player = createPlayer();
  state.ghosts = createGhosts();
}

/** Tras gameOver/levelComplete: reinicia y deja el estado en 'start'. */
function restartFromEnd() {
  resetGame();
  state.gameState = GAME_STATES.START;
}

function isEndState() {
  return (
    state.gameState === GAME_STATES.GAME_OVER ||
    state.gameState === GAME_STATES.LEVEL_COMPLETE
  );
}

/** Gestiona una flecha pulsada según el estado actual. */
export function handleDirection(direction) {
  if (isEndState()) {
    restartFromEnd();
    return;
  }
  if (state.gameState === GAME_STATES.START) {
    state.gameState = GAME_STATES.PLAYING;
  }
  state.player.nextDir = direction;
}

/** Enter solo reinicia al terminar la partida. */
export function handleEnter() {
  if (isEndState()) restartFromEnd();
}

let disposeInput = null;

/** Prepara una partida nueva y registra el teclado. */
export function start() {
  stop();
  resetGame();
  state.gameState = GAME_STATES.START;
  disposeInput = initInput({ onDirection: handleDirection, onEnter: handleEnter });
}

/** Quita las escuchas de teclado del juego. */
export function stop() {
  if (disposeInput) disposeInput();
  disposeInput = null;
}

/** Estado para el renderer (solo lectura). */
export function getState() {
  return state;
}

function checkCollisions() {
  if (!hitsGhost(state.player, state.ghosts)) return;
  state.lives--;
  if (state.lives <= 0) {
    state.gameState = GAME_STATES.GAME_OVER;
  } else {
    respawnCharacters();
  }
}

/** Un frame de lógica. */
export function update() {
  if (state.gameState !== GAME_STATES.PLAYING) return;

  state.score += movePlayer(state.player, state.maze);
  checkCollisions();
  if (state.gameState !== GAME_STATES.PLAYING) return;

  moveGhosts(state.ghosts, state.maze);
  checkCollisions();
  if (state.gameState !== GAME_STATES.PLAYING) return;

  if (countDots(state.maze) === 0) {
    state.gameState = GAME_STATES.LEVEL_COMPLETE;
  }
}
