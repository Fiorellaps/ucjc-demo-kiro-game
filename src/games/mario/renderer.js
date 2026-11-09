import {
  TILE_SIZE,
  MARIO_CELL,
  GAME_STATES,
  HUD_HEIGHT,
  HUD_PADDING,
  HALF,
  TWO_PI,
  FONT_FAMILY,
  FONT_SIZE_TITLE,
  FONT_SIZE_TEXT,
  OVERLAY_LINE_SPACING,
  OVERLAY_COLOR,
  BACKGROUND_COLOR,
  TEXT_COLOR,
  PLAYER_FALLBACK_COLOR,
  MARIO_SKY_COLOR,
  MARIO_GROUND_COLOR,
  MARIO_BLOCK_COLOR,
  MARIO_COIN_COLOR,
  MARIO_COIN_RADIUS,
  MARIO_GOAL_COLOR,
  MARIO_GOAL_WIDTH,
  MARIO_ENEMY_COLOR,
  MARIO_TILE_BORDER,
} from '../../constants.js';
import { LEVEL_ROWS, LEVEL_COLS } from './level.js';

// El tamaño del canvas lo fija main.js (CANVAS_WIDTH x CANVAS_HEIGHT)
export function createRenderer(canvas, kiroImage) {
  const ctx = canvas.getContext('2d');
  const blockSize = TILE_SIZE - MARIO_TILE_BORDER - MARIO_TILE_BORDER;

  function drawLevel(level, cameraX) {
    const firstCol = Math.max(Math.floor(cameraX / TILE_SIZE), 0);
    const lastCol = Math.min(Math.ceil((cameraX + canvas.width) / TILE_SIZE), LEVEL_COLS - 1);
    for (let row = 0; row < LEVEL_ROWS; row++) {
      for (let col = firstCol; col <= lastCol; col++) {
        const px = Math.round(col * TILE_SIZE - cameraX);
        const py = row * TILE_SIZE;
        switch (level[row][col]) {
          case MARIO_CELL.GROUND:
            ctx.fillStyle = MARIO_GROUND_COLOR;
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            break;
          case MARIO_CELL.BLOCK:
            ctx.fillStyle = MARIO_BLOCK_COLOR;
            ctx.fillRect(
              px + MARIO_TILE_BORDER,
              py + MARIO_TILE_BORDER,
              blockSize,
              blockSize
            );
            break;
          case MARIO_CELL.COIN:
            ctx.fillStyle = MARIO_COIN_COLOR;
            ctx.beginPath();
            ctx.arc(px + TILE_SIZE * HALF, py + TILE_SIZE * HALF, MARIO_COIN_RADIUS, 0, TWO_PI);
            ctx.fill();
            break;
          case MARIO_CELL.GOAL:
            ctx.fillStyle = MARIO_GOAL_COLOR;
            ctx.fillRect(px + (TILE_SIZE - MARIO_GOAL_WIDTH) * HALF, py, MARIO_GOAL_WIDTH, TILE_SIZE);
            break;
          default:
            break;
        }
      }
    }
  }

  function drawEnemies(enemies, cameraX) {
    ctx.fillStyle = MARIO_ENEMY_COLOR;
    enemies.forEach((e) => {
      if (!e.alive) return;
      ctx.fillRect(Math.round(e.x - cameraX), e.y, e.w, e.h);
    });
  }

  function drawPlayer(player, cameraX) {
    const px = Math.round(player.x - cameraX);
    if (kiroImage) {
      // Sprite cuadrado de lado h, centrado sobre la caja de colisión
      const offset = (player.h - player.w) * HALF;
      ctx.drawImage(kiroImage, px - offset, player.y, player.h, player.h);
    } else {
      // Respaldo si kiro-logo.png no carga
      ctx.fillStyle = PLAYER_FALLBACK_COLOR;
      ctx.beginPath();
      ctx.arc(px + player.w * HALF, player.y + player.h * HALF, player.h * HALF, 0, TWO_PI);
      ctx.fill();
    }
  }

  function drawHud(score, lives) {
    const y = LEVEL_ROWS * TILE_SIZE;
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, y, canvas.width, HUD_HEIGHT);
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = `${FONT_SIZE_TEXT}px ${FONT_FAMILY}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Score: ${score}`, HUD_PADDING, y + HUD_HEIGHT * HALF);
    ctx.textAlign = 'right';
    ctx.fillText(`Lives: ${lives}`, canvas.width - HUD_PADDING, y + HUD_HEIGHT * HALF);
  }

  function drawOverlay(lines) {
    ctx.fillStyle = OVERLAY_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = TEXT_COLOR;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    lines.forEach(({ text, size }, i) => {
      ctx.font = `${size}px ${FONT_FAMILY}`;
      const offset = (i - (lines.length - 1) * HALF) * OVERLAY_LINE_SPACING;
      ctx.fillText(text, canvas.width * HALF, canvas.height * HALF + offset);
    });
  }

  const OVERLAYS = {
    [GAME_STATES.START]: [
      { text: 'SUPER MARIO', size: FONT_SIZE_TITLE },
      { text: 'Use arrow keys to move, Space to jump!', size: FONT_SIZE_TEXT },
      { text: 'Press any arrow key to start', size: FONT_SIZE_TEXT },
    ],
    [GAME_STATES.GAME_OVER]: [
      { text: 'GAME OVER', size: FONT_SIZE_TITLE },
      { text: 'Press Enter to restart', size: FONT_SIZE_TEXT },
    ],
    [GAME_STATES.LEVEL_COMPLETE]: [
      { text: 'LEVEL COMPLETE!', size: FONT_SIZE_TITLE },
      { text: 'Press Enter to play again', size: FONT_SIZE_TEXT },
    ],
  };

  return function render(state) {
    ctx.fillStyle = MARIO_SKY_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawLevel(state.level, state.cameraX);
    drawEnemies(state.enemies, state.cameraX);
    drawPlayer(state.player, state.cameraX);
    drawHud(state.score, state.lives);
    const overlay = OVERLAYS[state.gameState];
    if (overlay) drawOverlay(overlay);
  };
}
