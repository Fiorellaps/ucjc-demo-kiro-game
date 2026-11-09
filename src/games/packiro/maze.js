import { EMPTY, WALL, DOT } from '../../constants.js';

// '#' pared, '.' punto, ' ' vacío
const LAYOUT = [
  '###################',
  '#........#........#',
  '#.##.###.#.###.##.#',
  '#.................#',
  '#.##.#.#####.#.##.#',
  '#....#...#...#....#',
  '####.###.#.###.####',
  '#.................#',
  '####.#.#####.#.####',
  '#.................#',
  '#.##.###.#.###.##.#',
  '#..#...........#..#',
  '##.#.#.#####.#.#.##',
  '#........#........#',
  '###################',
];

const CHAR_TO_CELL = { '#': WALL, '.': DOT, ' ': EMPTY };

// Plantilla inmutable: nunca se modifica durante la partida
export const originalMaze = Object.freeze(
  LAYOUT.map((row) => Object.freeze([...row].map((c) => CHAR_TO_CELL[c])))
);

export const MAZE_COLS = originalMaze[0].length;
export const MAZE_ROWS = originalMaze.length;

/** Devuelve una copia de trabajo nueva a partir de la plantilla. */
export function createWorkingMaze() {
  return originalMaze.map((row) => [...row]);
}

export function isWall(maze, x, y) {
  return maze[y]?.[x] !== EMPTY && maze[y]?.[x] !== DOT;
}

export function countDots(maze) {
  return maze.flat().filter((cell) => cell === DOT).length;
}
