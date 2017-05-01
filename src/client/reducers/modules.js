'use strict';
import { combineReducers } from 'redux';
import { ctx } from '../app';

import {
  CREATE_MODULE,
  REMOVE_MODULE,
  MOVE_MODULE,
  RENAME_MODULE,
  TOGGLE_EXPAND_MODULE,
  SET_FILE,
  SET_BUFFER
} from '../actions';

const getIndexById = (id, array) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === id) {
      return i;
    }
  }
  return -1;
};

const connectToEffects = (node, effects) => {
  node.disconnect();
  let last = node;
  effects.forEach((effect) => {
    if (effect) {
      last.connect(effect);
      effect.disconnect();
      last = effect;
    }
  });
  return last;
};

const wireUp = (module) => {
  const newModule = Object.assign({}, module);
  const {bufferSource, effects} = newModule;
  const last = connectToEffects(bufferSource, effects);
  last.connect(ctx.destination);
  return newModule;
};

const modulesById = (state = {}, action) => {
  const newState = Object.assign({}, state);
  const module = newState[action.id];

  switch (action.type) {
    case CREATE_MODULE:
      return Object.assign({}, state, {
        [action.id]: wireUp({
          id: action.id,
          name: action.name ? action.name : '',
          effects: [],
          file: null,
          bufferSource: ctx.createBufferSource(),
          isOpen: false
        })
      });
    case REMOVE_MODULE:
      delete newState[action.id];
      return newState;
    case RENAME_MODULE:
      module.name = action.name;
      return newState;
    case TOGGLE_EXPAND_MODULE:
      module.isOpen = !module.isOpen;
      return newState;
    case SET_FILE:
      module.file = action.file;
      return newState;
    case SET_BUFFER:
      module.bufferSource.buffer = action.buffer;
      return newState;
    /*case ADD_EQ:
      module.effects[action.index] = {
        param1: {freq: 0, value: 0},
        param2: {freq: 0, value: 0},
        param3: {freq: 0, value: 0},
        param4: {freq: 0, value: 0},
        param5: {freq: 0, value: 0},
        param6: {freq: 0, value: 0}
      };*/
    case MOVE_MODULE:
    default:
      return state;
  }
};

const modules = (state = [], action) => {
  const newState = [...state];
  let index = getIndexById(action.id, state);

  switch (action.type) {
    case CREATE_MODULE:
      return [...state, action.id];
    case REMOVE_MODULE:
      newState.splice(index, 1);
      return newState;
    case MOVE_MODULE:
      newState.splice(
        index + action.n, 0, newState.splice(index, 1)[0]);
      return newState;
    default:
      return state;
  }
};

export default combineReducers({
  modules,
  modulesById
});
