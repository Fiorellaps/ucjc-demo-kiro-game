import { TILE_SIZE, MARIO_CELL } from '../../constants.js';

// Plantilla del nivel: '.' aire, '#' suelo, 'B' bloque, 'o' moneda, 'G' meta, 'E' enemigo
const LAYOUT = [
  '............................................................',
  '............................................................',
  '............................................................',
  '............................................................',
  '............................................................',
  '............................................................',
  '............................................................',
  '............................................................',
  '..........' + '..ooo.....' + '.........o' + '..........' + '..........' + '.......G..',
  '..........' + '..BBB.....' + '........BB' + 'B.........' + '..........' + '.......G..',
  '..........' + '..........' + '..........' + '.....BB...' + '..........' + '.......G..',
  '........oo' + 'o.........' + 'ooo.......' + '..........' + '..........' + 'ooo....G..',
  '..........' + '......E...' + '..........' + '..E.......' + '......E...' + '.......G..',
  '##########' + '##########' + '...#######' + '##########' + '...#######' + '##########',
  '##########' + '##########' + '...#######' + '##########' + '...#######' + '##########',
];

const SYMBOLS = {
  '.': MARIO_CELL.AIR,
  '#': MARIO_CELL.GROUND,
  B: MARIO_CELL.BLOCK,
  o: MARIO_CELL.COIN,
  G: MARIO_CELL.GOAL,
  E: MARIO_CELL.ENEMY,
};

/** Plantilla constante del nivel. Nunca se modifica. */
export const originalLevel = Object.freeze(
  LAYOUT.map((line) => Object.freeze([...line].map((ch) => SYMBOLS[ch])))
);

export const LEVEL_ROWS = originalLevel.length;
export const LEVEL_COLS = originalLevel[0].length;

/** Copia de trabajo que sí se modifica durante la partida. */
export function createWorkingLevel() {
  return originalLevel.map((row) => [...row]);
}

/** Suelo y bloque son sólidos. Fuera por los lados es sólido; por arriba/abajo no. */
export function isSolid(level, col, row) {
  if (col < 0 || col >= LEVEL_COLS) return true;
  if (row < 0 || row >= LEVEL_ROWS) return false;
  const cell = level[row][col];
  return cell === MARIO_CELL.GROUND || cell === MARIO_CELL.BLOCK;
}

export function levelWidthPx() {
  return LEVEL_COLS * TILE_SIZE;
}

export function levelHeightPx() {
  return LEVEL_ROWS * TILE_SIZE;
}
