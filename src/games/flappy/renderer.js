import {
  HALF,
  GAME_STATES,
  FONT_FAMILY,
  FONT_SIZE_TITLE,
  FONT_SIZE_TEXT,
  OVERLAY_LINE_SPACING,
  OVERLAY_COLOR,
  TEXT_COLOR,
  TWO_PI,
  FLAPPY_PIPE_GAP,
  FLAPPY_PIPE_WIDTH,
  FLAPPY_BIRD_SIZE,
  FLAPPY_GROUND_HEIGHT,
  FLAPPY_SKY_COLOR,
  FLAPPY_PIPE_COLOR,
  FLAPPY_PIPE_BORDER_COLOR,
  FLAPPY_PIPE_BORDER_WIDTH,
  FLAPPY_GROUND_COLOR,
  FLAPPY_BIRD_FALLBACK_COLOR,
  FLAPPY_SCORE_Y,
  FLAPPY_SCORE_FONT_SIZE,
  FLAPPY_TEXTS,
} from '../../constants.js';

export function createRenderer(canvas, kiroImage) {
  const ctx = canvas.getContext('2d');

  function drawPipe(pipe) {
    const groundY = canvas.height - FLAPPY_GROUND_HEIGHT;
    const bottomY = pipe.gapY + FLAPPY_PIPE_GAP;
    ctx.fillStyle = FLAPPY_PIPE_COLOR;
    ctx.strokeStyle = FLAPPY_PIPE_BORDER_COLOR;
    ctx.lineWidth = FLAPPY_PIPE_BORDER_WIDTH;
    ctx.fillRect(pipe.x, 0, FLAPPY_PIPE_WIDTH, pipe.gapY);
    ctx.strokeRect(pipe.x, 0, FLAPPY_PIPE_WIDTH, pipe.gapY);
    ctx.fillRect(pipe.x, bottomY, FLAPPY_PIPE_WIDTH, groundY - bottomY);
    ctx.strokeRect(pipe.x, bottomY, FLAPPY_PIPE_WIDTH, groundY - bottomY);
  }

  function drawGround() {
    ctx.fillStyle = FLAPPY_GROUND_COLOR;
    ctx.fillRect(0, canvas.height - FLAPPY_GROUND_HEIGHT, canvas.width, FLAPPY_GROUND_HEIGHT);
  }

  function drawBird(bird) {
    if (kiroImage) {
      ctx.drawImage(kiroImage, bird.x, bird.y, FLAPPY_BIRD_SIZE, FLAPPY_BIRD_SIZE);
    } else {
      // Respaldo: mismo centro y diámetro que el sprite
      const radius = FLAPPY_BIRD_SIZE * HALF;
      ctx.fillStyle = FLAPPY_BIRD_FALLBACK_COLOR;
      ctx.beginPath();
      ctx.arc(bird.x + radius, bird.y + radius, radius, 0, TWO_PI);
      ctx.fill();
    }
  }

  function drawScore(score) {
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = `${FLAPPY_SCORE_FONT_SIZE}px ${FONT_FAMILY}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(score), canvas.width * HALF, FLAPPY_SCORE_Y);
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

  function getOverlay(state) {
    if (state.gameState === GAME_STATES.START) {
      return [
        { text: FLAPPY_TEXTS.START_TITLE, size: FONT_SIZE_TITLE },
        { text: FLAPPY_TEXTS.START_LINE1, size: FONT_SIZE_TEXT },
        { text: FLAPPY_TEXTS.START_LINE2, size: FONT_SIZE_TEXT },
      ];
    }
    if (state.gameState === GAME_STATES.GAME_OVER) {
      return [
        { text: FLAPPY_TEXTS.GAME_OVER, size: FONT_SIZE_TITLE },
        { text: `${FLAPPY_TEXTS.SCORE}${Math.trunc(state.score)}`, size: FONT_SIZE_TEXT },
        { text: FLAPPY_TEXTS.RESTART, size: FONT_SIZE_TEXT },
      ];
    }
    return null;
  }

  return function render(state) {
    ctx.fillStyle = FLAPPY_SKY_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    state.pipes.forEach(drawPipe);
    drawGround();
    drawBird(state.bird);
    drawScore(state.score);
    const overlay = getOverlay(state);
    if (overlay) drawOverlay(overlay);
  };
}
