import {
  PLAYER_START,
  GHOST_STARTS,
  PLAYER_MOVE_DELAY,
  GHOST_MOVE_DELAY,
  DOT,
  EMPTY,
  DOT_POINTS,
} from '../../constants.js';
import { isWall } from './maze.js';

const ALL_DIRECTIONS = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
];

export function createPlayer() {
  return {
    x: PLAYER_START.x,
    y: PLAYER_START.y,
    prevX: PLAYER_START.x,
    prevY: PLAYER_START.y,
    dir: { x: 0, y: 0 },
    nextDir: { x: 0, y: 0 },
    timer: 0,
  };
}

export function createGhosts() {
  return GHOST_STARTS.map((pos) => ({
    x: pos.x,
    y: pos.y,
    prevX: pos.x,
    prevY: pos.y,
    dir: { x: 0, y: 0 },
    timer: 0,
  }));
}

/**
 * Mueve al jugador una casilla cada PLAYER_MOVE_DELAY frames.
 * Devuelve los puntos ganados en este frame.
 */
export function movePlayer(player, maze) {
  player.timer++;
  if (player.timer < PLAYER_MOVE_DELAY) return 0;
  player.timer = 0;

  // Intenta girar hacia la dirección pedida; si hay pared, sigue recto
  if (!isWall(maze, player.x + player.nextDir.x, player.y + player.nextDir.y)) {
    player.dir = player.nextDir;
  }
  const nx = player.x + player.dir.x;
  const ny = player.y + player.dir.y;
  if (isWall(maze, nx, ny)) return 0;

  player.prevX = player.x;
  player.prevY = player.y;
  player.x = nx;
  player.y = ny;

  if (maze[ny][nx] === DOT) {
    maze[ny][nx] = EMPTY;
    return DOT_POINTS;
  }
  return 0;
}

/** Mueve cada fantasma una casilla cada GHOST_MOVE_DELAY frames. */
export function moveGhosts(ghosts, maze) {
  for (const ghost of ghosts) {
    ghost.timer++;
    if (ghost.timer < GHOST_MOVE_DELAY) continue;
    ghost.timer = 0;

    const options = ALL_DIRECTIONS.filter(
      (d) => !isWall(maze, ghost.x + d.x, ghost.y + d.y)
    );
    // Evita dar media vuelta salvo que no haya otra salida
    const forward = options.filter(
      (d) => !(d.x === -ghost.dir.x && d.y === -ghost.dir.y)
    );
    const choices = forward.length > 0 ? forward : options;
    ghost.dir = choices[Math.floor(Math.random() * choices.length)];

    ghost.prevX = ghost.x;
    ghost.prevY = ghost.y;
    ghost.x += ghost.dir.x;
    ghost.y += ghost.dir.y;
  }
}

/** Colisión en la misma casilla o cruzándose en sentidos opuestos. */
export function hitsGhost(player, ghosts) {
  return ghosts.some((g) => {
    const sameTile = g.x === player.x && g.y === player.y;
    const swapped =
      g.x === player.prevX && g.y === player.prevY &&
      g.prevX === player.x && g.prevY === player.y;
    return sameTile || swapped;
  });
}
