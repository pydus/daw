'use strict';
import {ctx} from '../app';

let nextModuleId = 0;
let nextSampleId = 0;

/**
 * Song
 */

const dispatchPosition = (dispatch, position) => {
  dispatch({
    type: SET_POSITION,
    position
  });
};

const startUpdatingPosition = (dispatch, getState) => {
  let lastTime = Date.now();
  const updatePosition = () => {
    const state = getState();
    const now = Date.now();
    const position =
      state.song.position +
      (now - lastTime) / 1000 *
      state.song.tempo / 60;
    lastTime = now;
    if (state.song.isPlaying) {
      dispatchPosition(dispatch, position);
    }
    if (position > state.song.beats) {
      dispatch({
        type: SET_PLAYING,
        playing: false
      });
    } else if (state.song.isPlaying) {
      window.requestAnimationFrame(updatePosition);
    }
  };
  window.requestAnimationFrame(updatePosition);
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

const increaseBeatsIfNecessary = (dispatch, getState) => {
  const state = getState();
  const song = state.song;
  const bps = song.tempo / 60;
  const modulesById = state.modules.modulesById;

  for (let id in modulesById) {
    modulesById[id].clips.forEach(clip => {
      const beatsInClip = clip.buffer.duration * bps;
      const highestBeat = clip.position + beatsInClip;
      if (highestBeat > song.beats) {
        dispatch(setBeats(highestBeat));
      }
    });
  }
};

export const ADD_CLIP = 'ADD_CLIP';
export const addClip = (id, file) => (
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
    dispatch({
      type: ADD_CLIP,
      id,
      file,
      position
    });
    loadBuffer(file, (buffer) => {
      state = getState();
      module = state.modules.modulesById[id];
      module.clips.forEach((clip, i) => {
        if (!clip.buffer && clip.file === file) {
          dispatch(setBuffer(id, i, buffer));
        }
      });
      increaseBeatsIfNecessary(dispatch, getState);
    });
  }
);

export const REMOVE_CLIP = 'REMOVE_CLIP';
export const removeClip = (id, index) => ({
  type: REMOVE_CLIP,
  id,
  index
});

export const MOVE_CLIP = 'MOVE_CLIP';
export const moveClip = (id, index, position) => (
  (dispatch, getState) => {
    dispatch({
      type: MOVE_CLIP,
      id,
      index,
      position
    });
    increaseBeatsIfNecessary(dispatch, getState);
  }
);

export const CUT = 'CUT';
export const cut = (position, id) => (
  (dispatch, getState) => {
    const state = getState();
    if (state.song.isPlaying) {
      dispatch(setPlaying(false));
    }
    state.modules.modules.forEach(id => {
      state.modules.modulesById[id].clips.forEach((clip, clipIndex) => {
        const bps = state.song.tempo / 60;
        const end = clip.position + clip.buffer.duration * bps;
        if (clip.position < position && end > position) {
          const secondsInNewClip = (position - clip.position) / bps;
          const index = Math.floor(secondsInNewClip * clip.buffer.sampleRate);
          const firstBuffer = ctx.createBuffer(2, index, clip.buffer.sampleRate);
          const secondBuffer = ctx.createBuffer(2, clip.buffer.length - index, clip.buffer.sampleRate);
          for (let channel = 0; channel < 2; channel++) {
            const channelData = clip.buffer.getChannelData(channel);
            const firstData = channelData.slice(0, index);
            const secondData = channelData.slice(index);
            firstBuffer.copyToChannel(firstData, channel);
            secondBuffer.copyToChannel(secondData, channel);
          }
          dispatch(removeClip(id, clipIndex));
          dispatch({
            type: ADD_CLIP,
            id,
            file: clip.file,
            position: clip.position,
            buffer: firstBuffer
          });
          dispatch({
            type: ADD_CLIP,
            id,
            file: clip.file,
            position,
            buffer: secondBuffer
          });
        }
      });
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

export const EDIT_EFFECT = 'EDIT_EFFECT';
export const editEffect = (id, index, settings) => ({
  type: EDIT_EFFECT,
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
