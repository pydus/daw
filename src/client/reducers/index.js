'use strict';
import { combineReducers } from 'redux';

const song = (
    state = {playing: false, tempo: 120, position: 0},
    action
  ) => {
  switch (action.type) {
    case 'SET_PLAYING':
      return Object.assign({}, state, {playing: action.playing});
    case 'SET_TEMPO':
      return Object.assign({}, state, {tempo: action.tempo});
    case 'SET_POSITION':
      return Object.assign({}, state, {position: action.position});
    default:
      return state;
  }
};

const module = (state = {}, action) => {};

const getIndexById = (id, array) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === id) {
      return i;
    }
  }
  return -1;
};

const modulesById = (state = {}, action) => {
  let newState;
  switch (action.type) {
    case 'CREATE_MODULE':
      return Object.assign({}, state, {
        [action.id]: {
          id: action.id,
          name: action.name ? action.name : '',
          effects: [],
          isOpen: false
        }
      });
    case 'REMOVE_MODULE':
      newState = Object.assign({}, state);
      delete newState[action.id];
      return newState;
    case 'RENAME_MODULE':
      newState = Object.assign({}, state);
      newState[action.id].name = action.name;
      return newState;
    case 'TOGGLE_EXPAND_MODULE':
      newState = Object.assign({}, state);
      newState[action.id].isOpen = !newState[action.id].isOpen;
      return newState;
    case 'MOVE_MODULE':
    default:
      return state;
  }
};

const modules = (
    state = {modules: [], modulesById: {}},
    action
  ) => {
  let newModules, index;
  switch (action.type) {
    case 'CREATE_MODULE':
      return {
        modules: [...state.modules, action.id],
        modulesById: modulesById(state.modulesById, action)
      };
    case 'REMOVE_MODULE':
      newModules = [...state.modules];
      index = getIndexById(action.id, newModules);
      newModules.splice(index, 1);
      return {
        modules: newModules,
        modulesById: modulesById(state.modulesById, action)
      };
    case 'MOVE_MODULE':
      newModules = [...state.modules];
      index = getIndexById(action.id, newModules);
      newModules.splice(index + action.n, 0, newModules.splice(index, 1)[0]);
      return Object.assign({}, state, {
        modules: newModules
      });
    case 'RENAME_MODULE':
    case 'TOGGLE_EXPAND_MODULE':
      return Object.assign({}, state, {
        modulesById: modulesById(state.modulesById, action)
      });
    default:
      return state;
  }
};

const reducers = combineReducers({
  song,
  modules
});

export default reducers;
