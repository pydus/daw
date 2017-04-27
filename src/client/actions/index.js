'use strict';

let nextModuleId = 0;

export const setPlaying = (playing) => {
  return {
    type: 'SET_PLAYING',
    playing
  };
};

export const setTempo = (tempo) => {
  return {
    type: 'SET_TEMPO',
    tempo
  };
};

export const setPosition = (position) => {
  return {
    type: 'SET_POSITION',
    position
  };
};

export const createModule = (name) => {
  return {
    type: 'CREATE_MODULE',
    id: nextModuleId++,
    name
  };
};

export const removeModule = (id) => {
  return {
    type: 'REMOVE_MODULE',
    id
  };
};

export const moveModule = (id, n) => {
  return {
    type: 'MOVE_MODULE',
    id,
    n
  };
};

export const renameModule = (id, name) => {
  return {
    type: 'RENAME_MODULE',
    id,
    name
  };
};

export const toggleExpandModule = (id) => {
  return {
    type: 'TOGGLE_EXPAND_MODULE',
    id
  };
};
