// Constantes globales del juego. Sin lógica.

export const TILE_SIZE = 32;

// Frames de espera entre movimientos (el jugador es más rápido que los fantasmas)
export const PLAYER_MOVE_DELAY = 8;
export const GHOST_MOVE_DELAY = 12;

export const INITIAL_LIVES = 3;
export const DOT_POINTS = 10;

// Códigos de celda del laberinto
export const EMPTY = 0;
export const WALL = 1;
export const DOT = 2;

export const GAME_STATES = Object.freeze({
  START: 'start',
  PLAYING: 'playing',
  GAME_OVER: 'gameOver',
  LEVEL_COMPLETE: 'levelComplete',
});

export const DIRECTIONS = Object.freeze({
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
});

export const PLAYER_START = Object.freeze({ x: 9, y: 9 });
export const GHOST_STARTS = Object.freeze([
  { x: 1, y: 7 },
  { x: 17, y: 7 },
]);
export const GHOST_COLORS = Object.freeze(['#ff4d4d', '#4dd2ff']);

// ---------------------------------------------------------------------------
// Comunes: canvas compartido, fuentes y offsets de dibujo
// ---------------------------------------------------------------------------
export const CANVAS_WIDTH = 608; // 19 columnas * TILE_SIZE
export const CANVAS_HEIGHT = 520; // 15 filas * TILE_SIZE + HUD_HEIGHT
export const HUD_HEIGHT = 40;
export const HUD_PADDING = 10;
export const HALF_TILE = TILE_SIZE / 2;
export const TWO_PI = Math.PI * 2;

export const FONT_FAMILY = 'monospace';
export const FONT_SIZE_TITLE = 32;
export const FONT_SIZE_TEXT = 18;
export const OVERLAY_LINE_SPACING = 40;
export const OVERLAY_COLOR = 'rgba(0, 0, 0, 0.75)';
export const BACKGROUND_COLOR = '#000';
export const TEXT_COLOR = '#fff';

// Pac-Kiro: dibujo
export const WALL_COLOR = '#1f3bd1';
export const DOT_COLOR = '#ffd9a0';
export const DOT_RADIUS = 3;
export const PLAYER_FALLBACK_COLOR = '#ffd400';
export const PLAYER_SPRITE_PADDING = 2;
export const PLAYER_FALLBACK_INSET = 3;
export const GHOST_INSET = 4;
export const GHOST_TOP_OFFSET = 2;
export const GHOST_EYE_LEFT_X = 10;
export const GHOST_EYE_RIGHT_X = 18;
export const GHOST_EYE_Y = 10;
export const GHOST_EYE_W = 4;
export const GHOST_EYE_H = 5;

// ---------------------------------------------------------------------------
// Hub: estados, login, sesión y menú
// ---------------------------------------------------------------------------
export const HUB_STATES = Object.freeze({
  LOGIN: 'login',
  MENU: 'menu',
  GAME: 'game',
});

export const MOCK_CREDENTIALS = Object.freeze({ user: 'kiro', pass: 'kiro123' });
export const SESSION_KEY = 'packiro.session';
export const SESSION_NAME_MAX = 20;

export const MENU_LAYOUT = Object.freeze({
  titleY: 90,
  userY: 140,
  optionX: 154,
  optionY: 200,
  optionWidth: 300,
  optionHeight: 60,
  optionGap: 20,
  titleFontSize: 36,
  userFontSize: 18,
  optionFontSize: 24,
  selectedColor: '#ffd400',
  normalColor: '#fff',
});

export const MESSAGES = Object.freeze({
  EMPTY_CREDENTIALS: 'Introduce usuario y contraseña',
  INVALID_CREDENTIALS: 'Usuario o contraseña incorrectos',
  LOGOUT_FAILED: 'No se pudo cerrar la sesión',
});

// ---------------------------------------------------------------------------
// Flappy Bird (píxeles y píxeles por frame)
// ---------------------------------------------------------------------------
export const FLAPPY_GRAVITY = 0.5;
export const FLAPPY_FLAP_VELOCITY = -8;
export const FLAPPY_PIPE_SPEED = 3;
export const FLAPPY_PIPE_SPAWN_FRAMES = 90;
export const FLAPPY_PIPE_GAP = 150;
export const FLAPPY_PIPE_WIDTH = 60;
export const FLAPPY_GROUND_HEIGHT = 40;
export const FLAPPY_GAP_MIN_Y = 40;
// MAX + GAP (150) = 440 <= CANVAS_HEIGHT - GROUND_HEIGHT (480)
export const FLAPPY_GAP_MAX_Y = 290;
export const FLAPPY_BIRD_SIZE = 32;
export const FLAPPY_BIRD_START = Object.freeze({ x: 100, y: 240 });

// ---------------------------------------------------------------------------
// Super Mario (píxeles y píxeles por frame)
// ---------------------------------------------------------------------------
export const PLAYER_SPEED = 3;
export const GRAVITY = 0.6;
export const MAX_FALL_SPEED = 12; // menor que TILE_SIZE: no atraviesa celdas
export const JUMP_SPEED = -12;
export const ENEMY_SPEED = 1;
export const STOMP_BOUNCE_SPEED = -8;
export const COIN_POINTS = 10;
export const STOMP_POINTS = 100;
export const MARIO_LIVES = 3;
export const MARIO_PLAYER_W = 24;
export const MARIO_PLAYER_H = 32;
// ---------------------------------------------------------------------------
// Hub: menú, teclas y ids del DOM
// ---------------------------------------------------------------------------
export const MENU_TITLE = 'Game Hub';
export const MENU_USER_LABEL = 'Usuario: ';
export const MENU_USER_MAX_WIDTH = 560; // ancho máximo del nombre antes de reducir la fuente
export const MENU_USER_MIN_FONT = 8;
export const MENU_OPTION_BG = '#1a1a1a';
export const MENU_OPTION_TEXT_SELECTED = '#000';
export const MENU_BORDER_WIDTH = 3;
export const MENU_HINT = 'Flechas + Enter, o haz clic';
export const MENU_HINT_Y = 480;
export const MENU_HINT_FONT_SIZE = 14;
export const MENU_HINT_COLOR = '#888';
export const KEYS = Object.freeze({
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
});
export const IGNORED_KEY_TARGETS = Object.freeze(['BUTTON', 'INPUT']);
export const DOM_IDS = Object.freeze({
  CANVAS: 'game',
  LOGOUT: 'btn-logout',
  MENU: 'btn-menu',
  BAR: 'hub-bar',
  CONTROLS: 'controls',
  MESSAGE: 'hub-message',
});

// ---------------------------------------------------------------------------
// Flappy Bird: teclas, colores y textos
// ---------------------------------------------------------------------------
export const FLAPPY_KEYS = Object.freeze({ FLAP: ' ', RESTART: 'Enter' });
export const FLAPPY_SKY_COLOR = '#4ec0ca';
export const FLAPPY_PIPE_COLOR = '#2e9e3a';
export const FLAPPY_PIPE_BORDER_COLOR = '#1b6b25';
export const FLAPPY_GROUND_COLOR = '#ded895';
export const FLAPPY_BIRD_FALLBACK_COLOR = '#ffd400';
export const FLAPPY_SCORE_Y = 50;
export const FLAPPY_SCORE_FONT_SIZE = 40;
export const FLAPPY_PIPE_BORDER_WIDTH = 3;
export const FLAPPY_TEXTS = Object.freeze({
  START_TITLE: 'FLAPPY BIRD',
  START_LINE1: 'Press Space to flap!',
  START_LINE2: 'Press Space to start',
  GAME_OVER: 'GAME OVER',
  SCORE: 'Score: ',
  RESTART: 'Press Enter to restart',
});

// ---------------------------------------------------------------------------
// Super Mario: celdas, posiciones iniciales, teclas y dibujo
// ---------------------------------------------------------------------------
export const MARIO_CELL = Object.freeze({
  AIR: 0,
  GROUND: 1,
  BLOCK: 2,
  COIN: 3,
  GOAL: 4,
  ENEMY: 5,
});
export const MARIO_LEVEL_ROWS = 15; // 15 * TILE_SIZE + HUD_HEIGHT = CANVAS_HEIGHT
export const MARIO_PLAYER_START = Object.freeze({ x: 64, y: 384 });
export const MARIO_ENEMY_W = 28;
export const MARIO_ENEMY_H = 28;
export const MARIO_ENEMY_START_DIR = -1;
export const HALF = 0.5;
export const MARIO_KEYS = Object.freeze({
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  JUMP: ' ',
  ENTER: 'Enter',
});
export const MARIO_SKY_COLOR = '#5c94fc';
export const MARIO_GROUND_COLOR = '#b5651d';
export const MARIO_BLOCK_COLOR = '#e0a030';
export const MARIO_COIN_COLOR = '#ffd400';
export const MARIO_COIN_RADIUS = 7;
export const MARIO_GOAL_COLOR = '#2ecc40';
export const MARIO_GOAL_WIDTH = 6;
export const MARIO_ENEMY_COLOR = '#8b4513';
export const MARIO_TILE_BORDER = 1;
export const PADDING_SIDES = 2; // relleno aplicado a ambos lados del sprite
