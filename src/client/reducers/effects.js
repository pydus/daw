'use strict';
import {
  ADD_EQ,
  ADD_COMPRESSOR,
  REMOVE_EFFECT,
  OPEN_EFFECT
} from '../actions';

const effects = (state = [], action) => {
  const newState = [...state];
  switch (action.type) {
    case REMOVE_EFFECT:
      newState.splice(action.index, 1);
      // TODO disconnect effect
      return newState;
    case ADD_EQ:
      newState[action.index] = {
        type: 'EQ',
        param1: {freq: 0, value: 0},
        param2: {freq: 0, value: 0},
        param3: {freq: 0, value: 0},
        param4: {freq: 0, value: 0},
        param5: {freq: 0, value: 0},
        param6: {freq: 0, value: 0}
      };
      // TODO connect effect
      return newState;
    case ADD_COMPRESSOR:
      newState[action.index] = {
        type: 'COMPRESSOR'
      };
      return newState;
    default:
      return state;
  }
};

export default effects;
