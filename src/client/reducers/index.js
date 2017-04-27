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

const modules = (state = {}, action) => {
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
    default:
      return state;
  }
};

const reducers = combineReducers({
  song,
  modules
});

export default reducers;
