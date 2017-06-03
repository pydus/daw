'use strict';
import {ctx} from '../app';
import {defaultCompressor} from '../settings';
import {
  ADD_EQ,
  ADD_COMPRESSOR,
  EDIT_COMPRESSOR,
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
    case EDIT_COMPRESSOR:
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
      // TODO create filters and connect them to each other, then to output
      inputGain.connect(outputGain);
      newState[action.index] = {
        type: 'EQ',
        param1: {freq: 0, value: 0},
        param2: {freq: 0, value: 0},
        param3: {freq: 0, value: 0},
        param4: {freq: 0, value: 0},
        param5: {freq: 0, value: 0},
        param6: {freq: 0, value: 0},
        inputGain,
        outputGain,
        input: inputGain,
        output: outputGain
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
