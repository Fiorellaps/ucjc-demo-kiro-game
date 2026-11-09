import {
  PADDING_SIDES,
  HALF,
  TILE_SIZE,
  WALL,
  DOT,
  GAME_STATES,
  GHOST_COLORS,
  HUD_HEIGHT,
  HUD_PADDING,
  HALF_TILE,
  TWO_PI,
  FONT_FAMILY,
  FONT_SIZE_TITLE,
  FONT_SIZE_TEXT,
  OVERLAY_LINE_SPACING,
  OVERLAY_COLOR,
  BACKGROUND_COLOR,
  TEXT_COLOR,
  WALL_COLOR,
  DOT_COLOR,
  DOT_RADIUS,
  PLAYER_FALLBACK_COLOR,
  PLAYER_SPRITE_PADDING,
  PLAYER_FALLBACK_INSET,
  GHOST_INSET,
  GHOST_TOP_OFFSET,
  GHOST_EYE_LEFT_X,
  GHOST_EYE_RIGHT_X,
  GHOST_EYE_Y,
  GHOST_EYE_W,
  GHOST_EYE_H,
} from '../../constants.js';
import { MAZE_COLS, MAZE_ROWS } from './maze.js';

// El tamaño del canvas lo fija main.js (CANVAS_WIDTH x CANVAS_HEIGHT)
export function createRenderer(canvas, kiroImage) {
  const ctx = canvas.getContext('2d');

  function drawMaze(maze) {
    for (let y = 0; y < MAZE_ROWS; y++) {
      for (let x = 0; x < MAZE_COLS; x++) {
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;
        if (maze[y][x] === WALL) {
          ctx.fillStyle = WALL_COLOR;
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        } else if (maze[y][x] === DOT) {
          ctx.fillStyle = DOT_COLOR;
          ctx.beginPath();
          ctx.arc(px + HALF_TILE, py + HALF_TILE, DOT_RADIUS, 0, TWO_PI);
          ctx.fill();
        }
      }
    }
  }

  function drawPlayer(player) {
    const px = player.x * TILE_SIZE;
    const py = player.y * TILE_SIZE;
    if (kiroImage) {
      const size = TILE_SIZE - PLAYER_SPRITE_PADDING * PADDING_SIDES;
      ctx.drawImage(kiroImage, px + PLAYER_SPRITE_PADDING, py + PLAYER_SPRITE_PADDING, size, size);
    } else {
      // Respaldo si kiro-logo.png no carga
      ctx.fillStyle = PLAYER_FALLBACK_COLOR;
      ctx.beginPath();
      ctx.arc(px + HALF_TILE, py + HALF_TILE, HALF_TILE - PLAYER_FALLBACK_INSET, 0, TWO_PI);
      ctx.fill();
    }
  }

  function drawGhosts(ghosts) {
    ghosts.forEach((g, i) => {
      const px = g.x * TILE_SIZE;
      const py = g.y * TILE_SIZE;
      ctx.fillStyle = GHOST_COLORS[i % GHOST_COLORS.length];
      ctx.beginPath();
      ctx.arc(px + HALF_TILE, py + HALF_TILE - GHOST_TOP_OFFSET, HALF_TILE - GHOST_INSET, Math.PI, 0);
      ctx.lineTo(px + TILE_SIZE - GHOST_INSET, py + TILE_SIZE - GHOST_INSET);
      ctx.lineTo(px + GHOST_INSET, py + TILE_SIZE - GHOST_INSET);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = TEXT_COLOR;
      ctx.fillRect(px + GHOST_EYE_LEFT_X, py + GHOST_EYE_Y, GHOST_EYE_W, GHOST_EYE_H);
      ctx.fillRect(px + GHOST_EYE_RIGHT_X, py + GHOST_EYE_Y, GHOST_EYE_W, GHOST_EYE_H);
    });
  }

  function drawHud(score, lives) {
    const y = MAZE_ROWS * TILE_SIZE;
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
      { text: 'PAC-KIRO', size: FONT_SIZE_TITLE },
      { text: 'Use arrow keys to move!', size: FONT_SIZE_TEXT },
      { text: 'Press any arrow key to start', size: FONT_SIZE_TEXT },
    ],
    [GAME_STATES.GAME_OVER]: [
      { text: 'GAME OVER', size: FONT_SIZE_TITLE },
      { text: 'Press an arrow key or Enter to restart', size: FONT_SIZE_TEXT },
    ],
    [GAME_STATES.LEVEL_COMPLETE]: [
      { text: 'LEVEL COMPLETE!', size: FONT_SIZE_TITLE },
      { text: 'Press an arrow key or Enter to play again', size: FONT_SIZE_TEXT },
    ],
  };

  return function render(state) {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawMaze(state.maze);
    drawPlayer(state.player);
    drawGhosts(state.ghosts);
    drawHud(state.score, state.lives);
    const overlay = OVERLAYS[state.gameState];
    if (overlay) drawOverlay(overlay);
  };
}
