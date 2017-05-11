'use strict';

export const UPDATE_INTERVAL = 1000 / 60;

export const MAX_ROUTES = 10;

export const defaultCompressor = {
  threshold: 0,
  ratio: 1,
  knee: 0,
  attack: 0, // ms
  release: 200 // ms
};
