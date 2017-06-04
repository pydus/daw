'use strict';
import {ctx} from '../app';
import {defaultCompressor} from '../settings';
import {
  ADD_EQ,
  ADD_COMPRESSOR,
  EDIT_EFFECT,
  REMOVE_EFFECT
} from '../actions';

const compressor = (state, action) => {
  const newState = Object.assign({}, state);

  switch (action.type) {
    case ADD_COMPRESSOR:
      const inputGain = ctx.createGain();
      const analyserIn = ctx.createAnalyser();
      const compressor = ctx.createDynamicsCompressor();
      const outputGain = ctx.createGain();
      const analyserOut = ctx.createAnalyser();
      compressor.threshold.value = defaultCompressor.threshold;
      compressor.ratio.value = defaultCompressor.ratio;
      compressor.knee.value = defaultCompressor.knee;
      compressor.attack.value = defaultCompressor.attack / 1000;
      compressor.release.value = defaultCompressor.release / 1000;
      inputGain.connect(analyserIn);
      analyserIn.connect(compressor);
      compressor.connect(outputGain);
      outputGain.connect(analyserOut);
      return {
        type: 'COMPRESSOR',
        inputGain,
        input: inputGain,
        analyserIn,
        compressor,
        outputGain,
        analyserOut,
        output: analyserOut
      };
    case EDIT_EFFECT:
      const settings = action.settings;
      if (typeof settings.inputGain !== 'undefined')
        newState.inputGain.gain.value = settings.inputGain;
      if (typeof settings.outputGain !== 'undefined')
        newState.outputGain.gain.value = settings.outputGain;
      if (typeof settings.threshold !== 'undefined')
        newState.compressor.threshold.value = settings.threshold;
      if (typeof settings.ratio !== 'undefined')
        newState.compressor.ratio.value = settings.ratio;
      if (typeof settings.knee !== 'undefined')
        newState.compressor.knee.value = settings.knee;
      if (typeof settings.attack !== 'undefined')
        newState.compressor.attack.value = settings.attack;
      if (typeof settings.release !== 'undefined')
        newState.compressor.release.value = settings.release;
      return newState;
    default:
      return state;
  }
};

const effects = (state = [], action) => {
  const newState = [...state];

  switch (action.type) {
    case REMOVE_EFFECT:
      newState.splice(action.index, 1);
      return newState;
    case ADD_EQ:
      const inputGain = ctx.createGain();
      const outputGain = ctx.createGain();
      const initFrequencies = [63, 136, 294, 632, 1263, 2936, 6324];
      const filters = [];
      for (let i = 0; i < initFrequencies.length; i++) {
        const filter = ctx.createBiquadFilter();
        if (i === 0) {
          filter.type = 'lowshelf';
        } else if (i === initFrequencies.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
        }
        if (i > 0) {
          filters[i - 1].connect(filter);
        }
        filter.frequency.value = initFrequencies[i];
        filters.push(filter);
      }
      inputGain.connect(outputGain);
      newState[action.index] = {
        type: 'EQ',
        filters,
        inputGain,
        outputGain,
        input: inputGain,
        output: outputGain
      };
      return newState;
    case ADD_COMPRESSOR:
    case EDIT_EFFECT:
      newState[action.index] = compressor(newState[action.index], action);
      return newState;
    default:
      return state;
  }
};

export default effects;
