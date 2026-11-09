import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  FLAPPY_GRAVITY,
  FLAPPY_FLAP_VELOCITY,
  FLAPPY_PIPE_SPEED,
  FLAPPY_PIPE_GAP,
  FLAPPY_PIPE_WIDTH,
  FLAPPY_GAP_MIN_Y,
  FLAPPY_GAP_MAX_Y,
  FLAPPY_GROUND_HEIGHT,
  FLAPPY_BIRD_SIZE,
  FLAPPY_BIRD_START,
} from '../../constants.js';

/** Y del borde superior del suelo. */
export const GROUND_Y = CANVAS_HEIGHT - FLAPPY_GROUND_HEIGHT;

/** Pájaro: (x, y) es la esquina superior izquierda. */
export function createBird() {
  return { x: FLAPPY_BIRD_START.x, y: FLAPPY_BIRD_START.y, vy: 0 };
}

/**
 * Par de tuberías en el borde derecho. gapY es el borde superior del hueco.
 * @param {() => number} random generador en [0, 1)
 */
export function createPipe(random = Math.random) {
  const range = FLAPPY_GAP_MAX_Y - FLAPPY_GAP_MIN_Y + 1;
  const gapY = FLAPPY_GAP_MIN_Y + Math.floor(random() * range);
  return { x: CANVAS_WIDTH, gapY, scored: false };
}

/** Un frame de gravedad: vy += gravedad; y += vy. */
export function applyGravity(bird) {
  bird.vy += FLAPPY_GRAVITY;
  bird.y += bird.vy;
}

/** Aleteo: sustituye la velocidad vertical. */
export function flap(bird) {
  bird.vy = FLAPPY_FLAP_VELOCITY;
}

/** Mueve las tuberías y devuelve la lista sin las que salieron por la izquierda. */
export function movePipes(pipes) {
  pipes.forEach((pipe) => {
    pipe.x -= FLAPPY_PIPE_SPEED;
  });
  return pipes.filter((pipe) => pipe.x + FLAPPY_PIPE_WIDTH >= 0);
}

/** ¿El borde izquierdo del pájaro ha superado el borde derecho de la tubería? */
export function birdPassedPipe(bird, pipe) {
  return bird.x > pipe.x + FLAPPY_PIPE_WIDTH;
}

/** Colisión del pájaro con el tubo superior o inferior de un par. */
export function birdHitsPipe(bird, pipe) {
  const overlapsX = bird.x < pipe.x + FLAPPY_PIPE_WIDTH && bird.x + FLAPPY_BIRD_SIZE > pipe.x;
  if (!overlapsX) return false;
  const aboveGap = bird.y < pipe.gapY;
  const belowGap = bird.y + FLAPPY_BIRD_SIZE > pipe.gapY + FLAPPY_PIPE_GAP;
  return aboveGap || belowGap;
}

/** Colisión con el suelo o con el borde superior del canvas. */
export function birdHitsBounds(bird) {
  return bird.y < 0 || bird.y + FLAPPY_BIRD_SIZE >= GROUND_Y;
}
