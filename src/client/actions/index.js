'use strict';
import { ctx } from '../app';

let nextModuleId = 0;
let nextClipId = 0;

/**
 * Song
 */

const POSITION_UPDATE_INTERVAL = 1000 / 30;
let interval;

const dispatchPosition = (dispatch, position) => {
  dispatch({
    type: SET_POSITION,
    position
  });
};

const startUpdatingPosition = (dispatch, getState) => {
  interval = setInterval(() => {
    const state = getState();
    const position =
      state.song.position +
      POSITION_UPDATE_INTERVAL / 1000 *
      state.song.tempo / 3600;
    dispatchPosition(dispatch, position);
  }, POSITION_UPDATE_INTERVAL);
};

const stopUpdatingPosition = () => {
  clearInterval(interval);
};

export const SET_PLAYING = 'SET_PLAYING';
export const setPlaying = (playing) => (
  (dispatch, getState) => {
    const state = getState();
    const positionRatio = state.song.position / state.song.beats;

    dispatch({
      type: SET_PLAYING,
      playing,
      positionRatio
    });

    if (playing) {
      startUpdatingPosition(dispatch, getState);
    } else {
      stopUpdatingPosition();
    }
  }
);

export const SET_TEMPO = 'SET_TEMPO';
export const setTempo = (tempo) => ({
  type: SET_TEMPO,
  tempo
});

export const SET_BEATS = 'SET_BEATS';
export const setBeats = (beats) => ({
  type: SET_BEATS,
  beats
});

export const SET_POSITION = 'SET_POSITION';
export const setPosition = (position) => (
  (dispatch, getState) => {
    const state = getState();
    const positionRatio = state.song.position / state.song.beats;
    const isPlaying = state.song.isPlaying;
    dispatch({
      type: SET_POSITION,
      position,
      positionRatio,
      isPlaying
    });
  }
);

export const SAVE_POSITION = 'SAVE_POSITION';
export const savePosition = (position) => ({
  type: SAVE_POSITION,
  position
});


/**
 * Modules
 */

export const CREATE_MODULE = 'CREATE_MODULE';
export const createModule = (name) => ({
  type: CREATE_MODULE,
  id: nextModuleId++,
  name
});

export const REMOVE_MODULE = 'REMOVE_MODULE';
export const removeModule = (id) => ({
  type: REMOVE_MODULE,
  id
});

export const MOVE_MODULE = 'MOVE_MODULE';
export const moveModule = (id, n) => ({
  type: MOVE_MODULE,
  id,
  n
});

export const RENAME_MODULE = 'RENAME_MODULE';
export const renameModule = (id, name) => ({
  type: RENAME_MODULE,
  id,
  name
});

export const TOGGLE_EXPAND_MODULE = 'TOGGLE_EXPAND_MODULE';
export const toggleExpandModule = (id) => ({
  type: TOGGLE_EXPAND_MODULE,
  id
});

export const SET_FILE = 'SET_FILE';
export const setFile = (id, file) => ({
  type: SET_FILE,
  id,
  file
});

export const SET_BUFFER = 'SET_BUFFER';
export const setBuffer = (id, buffer) => ({
  type: SET_BUFFER,
  id,
  buffer
});

export const ROUTE = 'ROUTE';
export const route = (id, destination) => ({
  type: ROUTE,
  id,
  destination
});

export const UNROUTE = 'UNROUTE';
export const unroute = (id, destination) => ({
  type: UNROUTE,
  id,
  destination
});

const loadBuffer = (file, cb) => {
  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);
  fileReader.onload = (e) => {
    const arrayBuffer = e.target.result;
    ctx.decodeAudioData(arrayBuffer, cb);
  };
};

export const SET_SOURCE = 'SET_SOURCE';
export const setSource = (id, file) => (
  (dispatch) => {
    dispatch(setFile(id, file));
    loadBuffer(file, (buffer) => {
      dispatch(setBuffer(id, buffer));
    });
  }
);

/**
 * Effects
 */

export const OPEN_EFFECT = 'OPEN_EFFECT';
export const openEffect = (id, index) => ({
  type: OPEN_EFFECT,
  id,
  index
});

export const ADD_EQ = 'ADD_EQ';
export const addEq = (id, index) => ({
  type: ADD_EQ,
  id,
  index
});

export const REMOVE_EFFECT = 'REMOVE_EFFECT';
export const removeEffect = (id, index) => ({
  type: REMOVE_EFFECT,
  id,
  index
});

/**
 * Clips
 */

export const CREATE_CLIP = 'CREATE_CLIP';
export const createClip = (file) => ({
  type: CREATE_CLIP,
  id: nextClipId++,
  file
});
