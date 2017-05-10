'use strict';
import { ctx } from '../app';
import {
  ADD_EQ,
  ADD_COMPRESSOR,
  REMOVE_EFFECT,
  OPEN_EFFECT
} from '../actions';

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
      input = ctx.createGain();
      output = ctx.createGain();
      input.connect(output);
      const compressor = ctx.createDynamicsCompressor();
      newState[action.index] = {
        type: 'COMPRESSOR',
        input,
        compressor,
        output
      };
      return newState;
    default:
      return state;
  }
};

export default effects;
