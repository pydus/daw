'use strict';
import { loadBuffer } from '../module';
let nextModuleId = 0;
let nextClipId = 0;

export const SET_PLAYING = 'SET_PLAYING';
export const setPlaying = (playing) => ({
  type: SET_PLAYING,
  playing
});

export const SET_TEMPO = 'SET_TEMPO';
export const setTempo = (tempo) => ({
  type: SET_TEMPO,
  tempo
});

export const SET_POSITION = 'SET_POSITION';
export const setPosition = (position) => ({
  type: SET_POSITION,
  position
});

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

export const SET_SOURCE = 'SET_SOURCE';
export const setSource = (id, file) => (
  (dispatch) => {
    dispatch(setFile(id, file));
    loadBuffer(file, (buffer) => {
      dispatch(setBuffer(id, buffer));
    });
  }
);

export const CREATE_CLIP = 'CREATE_CLIP';
export const createClip = (file) => ({
  type: CREATE_CLIP,
  id: nextClipId++,
  file
});
