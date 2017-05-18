'use strict';

export const FIRST_COLOR = '#3047d2';
export const SECOND_COLOR = '#12e6ba';
export const LIGHT_GRAY = '#465a7b';

export const MAX_ROUTES = 10;
export const SEGMENT_DURATION_STEP_PERCENT = 10;
export const MIN_SEGMENT_DURATION = 100;
export const MAX_SEGMENT_DURATION = 20000;

export const defaultCompressor = {
  threshold: 0,
  ratio: 1,
  knee: 0,
  attack: 0, // ms
  release: 200 // ms
};
