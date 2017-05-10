'use strict';
import { ctx } from '../app';
import { defaultCompressor } from '../settings';
import {
  ADD_EQ,
  ADD_COMPRESSOR,
  EDIT_COMPRESSOR,
  REMOVE_EFFECT,
  OPEN_EFFECT
} from '../actions';

const compressor = (state, action) => {
  const newState = Object.assign({}, state);

  switch (action.type) {
    case ADD_COMPRESSOR:
      const input = ctx.createGain();
      const compressor = ctx.createDynamicsCompressor();
      const output = ctx.createGain();
      compressor.threshold.value = defaultCompressor.threshold;
      compressor.ratio.value = defaultCompressor.ratio;
      compressor.knee.value = defaultCompressor.knee;
      compressor.attack.value = defaultCompressor.attack / 1000;
      compressor.release.value = defaultCompressor.release / 1000;
      input.connect(compressor);
      compressor.connect(output);
      return {
        type: 'COMPRESSOR',
        input,
        compressor,
        output
      };
    case EDIT_COMPRESSOR:
      const settings = action.settings;
      if (settings.inputGain) newState.input.gain.value = settings.inputGain;
      if (settings.outputGain) newState.output.gain.value = settings.outputGain;
      if (settings.threshold) newState.compressor.threshold.value = settings.threshold;
      if (settings.ratio) newState.compressor.ratio.value = settings.ratio;
      if (settings.knee) newState.compressor.knee.value = settings.knee;
      if (settings.attack) newState.compressor.attack.value = settings.attack;
      if (settings.release) newState.compressor.release.value = settings.release;
      return newState;
    default:
      return state;
  }
};

const effects = (state = [], action) => {
  const newState = [...state];
  let input, output;

  switch (action.type) {
    case REMOVE_EFFECT:
      newState.splice(action.index, 1);
      return newState;
    case ADD_EQ:
      input = ctx.createGain();
      output = ctx.createGain();
      // TODO create filters and connect them to each other, then to output
      input.connect(output);
      newState[action.index] = {
        type: 'EQ',
        param1: {freq: 0, value: 0},
        param2: {freq: 0, value: 0},
        param3: {freq: 0, value: 0},
        param4: {freq: 0, value: 0},
        param5: {freq: 0, value: 0},
        param6: {freq: 0, value: 0},
        input,
        output
      };
      return newState;
    case ADD_COMPRESSOR:
    case EDIT_COMPRESSOR:
      newState[action.index] = compressor(newState[action.index], action);
      return newState;
    default:
      return state;
  }
};

export default effects;
