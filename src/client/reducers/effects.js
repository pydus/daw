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

const eq = (state, action) => {
  const newState = Object.assign({}, state);

  switch (action.type) {
    case ADD_EQ:
      const inputGain = ctx.createGain();
      const outputGain = ctx.createGain();
      const analyserIn = ctx.createAnalyser();
      const analyserOut = ctx.createAnalyser();
      const initialFrequencies = [63, 136, 294, 632, 1363, 2936, 6324];
      const filters = [];
      inputGain.connect(analyserIn);
      for (let i = 0; i < initialFrequencies.length; i++) {
        const filter = ctx.createBiquadFilter();
        if (i === 0) {
          filter.type = 'lowshelf';
          filter.Q.value = 0.74;
          analyserIn.connect(filter);
        } else if (i === initialFrequencies.length - 1) {
          filter.type = 'highshelf';
          filter.Q.value = 0.74;
          filter.connect(outputGain);
        } else {
          filter.type = 'peaking';
        }
        if (i > 0) {
          filters[i - 1].connect(filter);
        }
        filter.frequency.value = initialFrequencies[i];
        filters.push(filter);
      }
      outputGain.connect(analyserOut);
      return {
        type: 'EQ',
        initialFrequencies,
        filters,
        inputGain,
        outputGain,
        analyserIn,
        analyserOut,
        input: inputGain,
        output: analyserOut
      };
    case EDIT_EFFECT:
      const settings = action.settings;
      const filter = newState.filters[settings.index];
      if (typeof settings.inputGain !== 'undefined')
        newState.inputGain.gain.value = settings.inputGain;
      if (typeof settings.outputGain !== 'undefined')
        newState.outputGain.gain.value = settings.outputGain;
      if (typeof settings.gain !== 'undefined')
        filter.gain.value = settings.gain;
      if (typeof settings.frequency !== 'undefined')
        filter.frequency.value = settings.frequency;
      if (typeof settings.Q !== 'undefined')
        filter.Q.value = Math.max(0.001, Math.min(50, settings.Q));
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
      newState[action.index] = eq(newState[action.index], action);
      return newState;
    case ADD_COMPRESSOR:
      newState[action.index] = compressor(newState[action.index], action);
      return newState;
    case EDIT_EFFECT:
      switch (newState[action.index].type) {
        case 'COMPRESSOR':
          newState[action.index] = compressor(newState[action.index], action);
          break;
        case 'EQ':
          newState[action.index] = eq(newState[action.index], action);
          break;
        default:
      }
      return newState;
    default:
      return state;
  }
};

export default effects;
