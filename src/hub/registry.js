// Registro de juegos. Contrato por entrada:
// { id, label, controls, start, stop, update, getState, createRenderer }
import * as packiro from '../games/packiro/game.js';
import { createRenderer as createPackiroRenderer } from '../games/packiro/renderer.js';
import * as flappy from '../games/flappy/game.js';
import { createRenderer as createFlappyRenderer } from '../games/flappy/renderer.js';
import * as mario from '../games/mario/game.js';
import { createRenderer as createMarioRenderer } from '../games/mario/renderer.js';

export const registry = [
  {
    id: 'packiro',
    label: 'Pac-Kiro',
    controls: ['Flechas: mover', 'Enter o flecha: reiniciar al terminar', 'Escape: menú'],
    start: packiro.start,
    stop: packiro.stop,
    update: packiro.update,
    getState: packiro.getState,
    createRenderer: createPackiroRenderer,
  },
  {
    id: 'flappy',
    label: 'Flappy Bird',
    controls: ['Espacio: aletear / empezar', 'Enter: reiniciar al terminar', 'Escape: menú'],
    start: flappy.start,
    stop: flappy.stop,
    update: flappy.update,
    getState: flappy.getState,
    createRenderer: createFlappyRenderer,
  },
  {
    id: 'mario',
    label: 'Super Mario',
    controls: [
      'Flechas izquierda/derecha: mover',
      'Espacio: saltar',
      'Enter: reiniciar al terminar',
      'Escape: menú',
    ],
    start: mario.start,
    stop: mario.stop,
    update: mario.update,
    getState: mario.getState,
    createRenderer: createMarioRenderer,
  },
];
