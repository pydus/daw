'use strict';
import { combineReducers } from 'redux';
import modules from './modules';

import {
  SET_PLAYING,
  SET_TEMPO,
  SET_BEATS,
  SET_POSITION,
  CREATE_CLIP
} from '../actions';

const song = (
  state = {
    isPlaying: false,
    tempo: 120,
    beatsPerBar: 4,
    beats: 60,
    position: 0
  },
  action
) => {
  switch (action.type) {
    case SET_PLAYING:
      return Object.assign({}, state, {isPlaying: action.playing});
    case SET_TEMPO:
      return Object.assign({}, state, {tempo: action.tempo});
    case SET_BEATS:
      return Object.assign({}, state, {beats: beats});
    case SET_POSITION:
      return Object.assign({}, state, {position: (action.position < 0) ? 0 : action.position});
    default:
      return state;
  }
};

const clips = (state = [], action) => {
  switch (action.type) {
    case CREATE_CLIP:
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
  clips
});
