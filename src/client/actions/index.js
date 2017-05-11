'use strict';
import { ctx } from '../app';

let nextModuleId = 0;
let nextSampleId = 0;

/**
 * Song
 */

import { UPDATE_INTERVAL } from '../settings';

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
      UPDATE_INTERVAL / 1000 *
      state.song.tempo / 60;
    dispatchPosition(dispatch, position);
  }, UPDATE_INTERVAL);
};

const stopUpdatingPosition = () => {
  clearInterval(interval);
};

export const SET_PLAYING = 'SET_PLAYING';
export const setPlaying = (playing) => (
  (dispatch, getState) => {
    const state = getState();
    const song = state.song;
    dispatch({
      type: SET_PLAYING,
      playing,
      song
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
    const song = state.song;
    dispatch({
      type: SET_POSITION,
      position,
      song
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

export const SET_VOLUME = 'SET_VOLUME';
export const setVolume = (id, volume) => ({
  type: SET_VOLUME,
  id,
  volume
});

export const MUTE_MODULE = 'MUTE_MODULE';
export const muteModule = (id) => ({
  type: MUTE_MODULE,
  id
});

export const SOLO_MODULE = 'SOLO_MODULE';
export const soloModule = (id) => ({
  type: SOLO_MODULE,
  id
});

export const TOGGLE_EXPAND_MODULE = 'TOGGLE_EXPAND_MODULE';
export const toggleExpandModule = (id) => ({
  type: TOGGLE_EXPAND_MODULE,
  id
});

export const SET_BUFFER = 'SET_BUFFER';
export const setBuffer = (id, index, buffer) => ({
  type: SET_BUFFER,
  id,
  index,
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

export const ADD_CLIP = 'ADD_CLIP';
export const addClip = (id, file, position) => (
  (dispatch, getState) => {
    let state = getState();
    const song = state.song;
    let bps = song.tempo / 60;
    let module = state.modules.modulesById[id];
    let position = 0;
    module.clips.forEach(clip => {
      const end = clip.position + clip.buffer.duration * bps;
      if (end > position) {
        position = end;
      }
    });
    const action = dispatch({
      type: ADD_CLIP,
      id,
      file,
      position
    });
    loadBuffer(file, (buffer) => {
      state = getState();
      module = state.modules.modulesById[id];
      bps = state.song.tempo / 60;
      let totalBeats = buffer.duration * bps;
      module.clips.forEach((clip, i) => {
        if (!clip.buffer && clip.file === file) {
          dispatch(setBuffer(id, i, buffer));
        } else if (clip.buffer) {
          totalBeats += clip.buffer.duration * bps;
        }
      });
      if (totalBeats > state.song.beats) {
        dispatch(setBeats(totalBeats));
      }
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

export const ADD_COMPRESSOR = 'ADD_COMPRESSOR';
export const addCompressor = (id, index) => ({
  type: ADD_COMPRESSOR,
  id,
  index
});

export const EDIT_COMPRESSOR = 'EDIT_COMPRESSOR';
export const editCompressor = (id, index, settings) => ({
  type: EDIT_COMPRESSOR,
  id,
  index,
  settings
});


export const REMOVE_EFFECT = 'REMOVE_EFFECT';
export const removeEffect = (id, index) => ({
  type: REMOVE_EFFECT,
  id,
  index
});

/**
 * Samples
 */

export const CREATE_SAMPLE = 'CREATE_SAMPLE';
export const createSample = (file) => ({
  type: CREATE_SAMPLE,
  id: nextSampleId++,
  file
});
