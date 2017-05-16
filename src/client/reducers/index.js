'use strict';
import {combineReducers} from 'redux';
import modules from './modules';

import {
  SET_PLAYING,
  SET_TEMPO,
  SET_BEATS,
  SET_POSITION,
  CREATE_SAMPLE,
  SAVE_POSITION
} from '../actions';

const song = (
  state = {
    isPlaying: false,
    tempo: 120,
    beatsPerBar: 4,
    beats: 100,
    position: 0,
    savedPosition: 0,
    loopPosition: 0
  },
  action
) => {
  switch (action.type) {
    case SET_PLAYING:
      return Object.assign({}, state, {isPlaying: action.playing, position: state.savedPosition});
    case SET_TEMPO:
      return Object.assign({}, state, {tempo: action.tempo});
    case SET_BEATS:
      return Object.assign({}, state, {beats: action.beats});
    case SET_POSITION:
      return Object.assign({}, state, {position: (action.position < 0) ? 0 : action.position});
    case SAVE_POSITION:
      return Object.assign({}, state, {savedPosition: (action.position < 0) ? 0 : action.position});
    default:
      return state;
  }
};

const samples = (state = [], action) => {
  switch (action.type) {
    case CREATE_SAMPLE:
      return [...state, {
        id: action.id,
        file: action.file
      }];
    default:
      return state;
  }
};

export default combineReducers({
  song,
  modules,
  samples
});
