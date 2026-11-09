import { GAME_STATES, FLAPPY_PIPE_SPAWN_FRAMES } from '../../constants.js';
import {
  createBird,
  createPipe,
  applyGravity,
  flap,
  movePipes,
  birdPassedPipe,
  birdHitsPipe,
  birdHitsBounds,
} from './entities.js';
import { initInput } from './input.js';

/** Estado único del juego. Se muta solo desde este módulo. */
export const state = {
  gameState: GAME_STATES.START,
  bird: createBird(),
  pipes: [],
  score: 0,
  frameCounter: 0,
  pipeSpawnTimer: 0,
};

/** Reinicia puntuación, pájaro, tuberías y contadores. */
export function resetGame() {
  state.bird = createBird();
  state.pipes = [];
  state.score = 0;
  state.frameCounter = 0;
  state.pipeSpawnTimer = 0;
}

/** Espacio: inicia la partida (con impulso) o aletea. */
export function handleFlap() {
  if (state.gameState === GAME_STATES.START) {
    state.gameState = GAME_STATES.PLAYING;
    flap(state.bird);
  } else if (state.gameState === GAME_STATES.PLAYING) {
    flap(state.bird);
  }
}

/** Enter: reinicia solo en gameOver. */
export function handleEnter() {
  if (state.gameState !== GAME_STATES.GAME_OVER) return;
  resetGame();
  state.gameState = GAME_STATES.START;
}

let disposeInput = null;

/** Prepara una partida nueva y registra el teclado. */
export function start() {
  stop();
  resetGame();
  state.gameState = GAME_STATES.START;
  disposeInput = initInput({ onFlap: handleFlap, onEnter: handleEnter });
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

function spawnPipes(random) {
  state.pipeSpawnTimer++;
  if (state.pipeSpawnTimer >= FLAPPY_PIPE_SPAWN_FRAMES) {
    state.pipeSpawnTimer = 0;
    state.pipes.push(createPipe(random));
  }
}

function updateScore() {
  state.pipes.forEach((pipe) => {
    if (!pipe.scored && birdPassedPipe(state.bird, pipe)) {
      pipe.scored = true;
      state.score++;
    }
  });
}

function checkCollisions() {
  if (birdHitsBounds(state.bird) || state.pipes.some((pipe) => birdHitsPipe(state.bird, pipe))) {
    state.gameState = GAME_STATES.GAME_OVER;
  }
}

/**
 * Un frame de lógica. Tras gameOver no modifica nada.
 * @param {() => number} random generador inyectable (por defecto Math.random)
 */
export function update(random = Math.random) {
  if (state.gameState !== GAME_STATES.PLAYING) return;

  state.frameCounter++;
  applyGravity(state.bird);
  state.pipes = movePipes(state.pipes);
  spawnPipes(random);
  updateScore();
  checkCollisions();
}
