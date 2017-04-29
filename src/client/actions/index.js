'use strict';

let nextModuleId = 0;
let nextClipId = 0;

export const setPlaying = (playing) => ({
  type: 'SET_PLAYING',
  playing
});

export const setTempo = (tempo) => ({
  type: 'SET_TEMPO',
  tempo
});

export const setPosition = (position) => ({
  type: 'SET_POSITION',
  position
});

export const createModule = (name) => ({
  type: 'CREATE_MODULE',
  id: nextModuleId++,
  name
});

export const removeModule = (id) => ({
  type: 'REMOVE_MODULE',
  id
});

export const moveModule = (id, n) => ({
  type: 'MOVE_MODULE',
  id,
  n
});

export const renameModule = (id, name) => ({
  type: 'RENAME_MODULE',
  id,
  name
});

export const toggleExpandModule = (id) => ({
  type: 'TOGGLE_EXPAND_MODULE',
  id
});

export const setSource = (id, file) => ({
  type: 'SET_SOURCE',
  id,
  file
});

export const createClip = (file) => ({
  type: 'CREATE_CLIP',
  id: nextClipId++,
  file
});
