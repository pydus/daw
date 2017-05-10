'use strict';
import { combineReducers } from 'redux';
import modulesById from './modules-by-id';
import {
  CREATE_MODULE,
  REMOVE_MODULE,
  MOVE_MODULE
} from '../actions';

const getIndexById = (id, array) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === id) {
      return i;
    }
  }
  return -1;
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
        index + action.n, 0, newState.splice(index, 1)[0]
      );
      return newState;
    default:
      return state;
  }
};

export default combineReducers({
  modules,
  modulesById
});
