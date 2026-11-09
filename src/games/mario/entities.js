import {
  TILE_SIZE,
  MARIO_CELL,
  MARIO_PLAYER_START,
  MARIO_PLAYER_W,
  MARIO_PLAYER_H,
  MARIO_ENEMY_W,
  MARIO_ENEMY_H,
  MARIO_ENEMY_START_DIR,
  PLAYER_SPEED,
  GRAVITY,
  MAX_FALL_SPEED,
  JUMP_SPEED,
  ENEMY_SPEED,
  COIN_POINTS,
  HALF,
} from '../../constants.js';
import { isSolid, LEVEL_ROWS, LEVEL_COLS, levelWidthPx } from './level.js';

export function createPlayer() {
  return {
    x: MARIO_PLAYER_START.x,
    y: MARIO_PLAYER_START.y,
    vx: 0,
    vy: 0,
    w: MARIO_PLAYER_W,
    h: MARIO_PLAYER_H,
    grounded: false,
  };
}

/**
 * Crea los enemigos a partir de las celdas con código 5 y las sustituye por aire
 * en el nivel de trabajo (la plantilla original no se toca).
 */
export function createEnemies(level) {
  const enemies = [];
  for (let row = 0; row < LEVEL_ROWS; row++) {
    for (let col = 0; col < LEVEL_COLS; col++) {
      if (level[row][col] !== MARIO_CELL.ENEMY) continue;
      level[row][col] = MARIO_CELL.AIR;
      const x = col * TILE_SIZE + (TILE_SIZE - MARIO_ENEMY_W) * HALF;
      const y = (row + 1) * TILE_SIZE - MARIO_ENEMY_H;
      enemies.push({
        x,
        y,
        w: MARIO_ENEMY_W,
        h: MARIO_ENEMY_H,
        dir: MARIO_ENEMY_START_DIR,
        alive: true,
        startX: x,
        startY: y,
      });
    }
  }
  return enemies;
}

/** Devuelve los enemigos vivos a su posición inicial. */
export function respawnEnemies(enemies) {
  enemies.forEach((e) => {
    e.x = e.startX;
    e.y = e.startY;
    e.dir = MARIO_ENEMY_START_DIR;
  });
}

/** Rango de celdas (col/row) que cubre un rectángulo. */
function cellRange(x, y, w, h) {
  return {
    c0: Math.floor(x / TILE_SIZE),
    c1: Math.ceil((x + w) / TILE_SIZE) - 1,
    r0: Math.floor(y / TILE_SIZE),
    r1: Math.ceil((y + h) / TILE_SIZE) - 1,
  };
}

function overlapsSolid(level, x, y, w, h) {
  const { c0, c1, r0, r1 } = cellRange(x, y, w, h);
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      if (isSolid(level, c, r)) return true;
    }
  }
  return false;
}

/** ¿Alguna celda solapada por el rectángulo tiene este código? */
function overlapsCell(level, rect, code) {
  const { c0, c1, r0, r1 } = cellRange(rect.x, rect.y, rect.w, rect.h);
  for (let r = Math.max(r0, 0); r <= Math.min(r1, LEVEL_ROWS - 1); r++) {
    for (let c = Math.max(c0, 0); c <= Math.min(c1, LEVEL_COLS - 1); c++) {
      if (level[r][c] === code) return true;
    }
  }
  return false;
}

/** Velocidad horizontal según teclas mantenidas (ambas = parado). */
export function applyHorizontal(player, held) {
  const dir = (held.right ? 1 : 0) - (held.left ? 1 : 0);
  player.vx = dir * PLAYER_SPEED;
}

export function applyGravity(player) {
  player.vy = Math.min(player.vy + GRAVITY, MAX_FALL_SPEED);
}

/** Salta solo si está apoyado. */
export function jump(player) {
  if (!player.grounded) return;
  player.vy = JUMP_SPEED;
  player.grounded = false;
}

/** Mueve por ejes separados (X y luego Y) y resuelve contra celdas sólidas. */
export function moveAndCollide(player, level) {
  // Eje X
  player.x += player.vx;
  const maxX = levelWidthPx() - player.w;
  if (player.x < 0) player.x = 0;
  if (player.x > maxX) player.x = maxX;
  if (overlapsSolid(level, player.x, player.y, player.w, player.h)) {
    const { c0, c1 } = cellRange(player.x, player.y, player.w, player.h);
    if (player.vx > 0) player.x = c1 * TILE_SIZE - player.w;
    else if (player.vx < 0) player.x = (c0 + 1) * TILE_SIZE;
    player.vx = 0;
  }

  // Eje Y
  player.y += player.vy;
  player.grounded = false;
  if (overlapsSolid(level, player.x, player.y, player.w, player.h)) {
    const { r0, r1 } = cellRange(player.x, player.y, player.w, player.h);
    if (player.vy > 0) {
      player.y = r1 * TILE_SIZE - player.h;
      player.grounded = true;
    } else if (player.vy < 0) {
      player.y = (r0 + 1) * TILE_SIZE;
    }
    player.vy = 0;
  }
}

/** Patrulla: avanza y se da la vuelta ante pared, bloque o borde de plataforma. */
export function moveEnemies(enemies, level) {
  enemies.forEach((e) => {
    if (!e.alive) return;
    const nextX = e.x + e.dir * ENEMY_SPEED;
    const leadX = e.dir > 0 ? nextX + e.w - 1 : nextX;
    const groundRow = Math.floor((e.y + e.h) / TILE_SIZE);
    const groundCol = Math.floor(leadX / TILE_SIZE);
    const blocked = overlapsSolid(level, nextX, e.y, e.w, e.h);
    const noGround = !isSolid(level, groundCol, groundRow);
    if (blocked || noGround) {
      e.dir = -e.dir;
    } else {
      e.x = nextX;
    }
  });
}

/** Recoge las monedas solapadas y devuelve los puntos ganados. */
export function collectCoins(player, level) {
  const { c0, c1, r0, r1 } = cellRange(player.x, player.y, player.w, player.h);
  let points = 0;
  for (let r = Math.max(r0, 0); r <= Math.min(r1, LEVEL_ROWS - 1); r++) {
    for (let c = Math.max(c0, 0); c <= Math.min(c1, LEVEL_COLS - 1); c++) {
      if (level[r][c] === MARIO_CELL.COIN) {
        level[r][c] = MARIO_CELL.AIR;
        points += COIN_POINTS;
      }
    }
  }
  return points;
}

export function touchesGoal(player, level) {
  return overlapsCell(level, player, MARIO_CELL.GOAL);
}

export function overlapsEnemy(player, enemy) {
  return (
    player.x < enemy.x + enemy.w &&
    player.x + player.w > enemy.x &&
    player.y < enemy.y + enemy.h &&
    player.y + player.h > enemy.y
  );
}

/**
 * Pisotón: cae y su parte inferior está por encima del centro del enemigo.
 * `prev` ({y, vy}) es el personaje antes de moverse en este frame: con caídas
 * rápidas el pie puede pasar el centro (o tocar suelo y anular vy) en un frame.
 */
export function isStomp(player, enemy, prev = player) {
  const falling = player.vy > 0 || prev.vy > 0;
  return falling && prev.y + player.h < enemy.y + enemy.h * HALF;
}
