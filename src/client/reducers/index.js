'use strict';
import { combineReducers } from 'redux';

const ctx = new AudioContext();

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

const connectToEffects = (node, effects) => {
  let last = node;
  effects.forEach((effect) => {
    if (effect) {
      last.connect(effect);
      effect.disconnect();
      last = effect;
    }
  });
  return last;
};

const addFileToModule = (file, module) => {
  const currentBufferSource = module.bufferSource;
  const source =  currentBufferSource ?
    currentBufferSource : ctx.createBufferSource();
  module.source = file;
  module.bufferSource = source;

  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);

  const handleBuffer = (buffer) => {
    source.buffer = buffer;
    const last = connectToEffects(source, module.effects);
    last.connect(ctx.destination);
  };

  fileReader.onload = (e) => {
    const arrayBuffer = e.target.result;
    ctx.decodeAudioData(arrayBuffer, handleBuffer);
  };
};

const createModule = (id, name) => ({
  id: id,
  name: name ? name : '',
  effects: [],
  source: null,
  bufferSource: null,
  audioData: null,
  isOpen: false
});

const modulesById = (state = {}, action) => {
  const newState = Object.assign({}, state);
  const module = newState[action.id];

  switch (action.type) {
    case 'CREATE_MODULE':
      return Object.assign({}, state, {
        [action.id]: createModule(action.id, action.name)
      });
    case 'REMOVE_MODULE':
      delete newState[action.id];
      return newState;
    case 'RENAME_MODULE':
      module.name = action.name;
      return newState;
    case 'TOGGLE_EXPAND_MODULE':
      module.isOpen = !module.isOpen;
      return newState;
    case 'SET_SOURCE':
      addFileToModule(action.file, module);
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
  const newModules = [...state.modules];
  let index;

  switch (action.type) {
    case 'CREATE_MODULE':
      return {
        modules: [...state.modules, action.id],
        modulesById: modulesById(state.modulesById, action)
      };
    case 'REMOVE_MODULE':
      index = getIndexById(action.id, newModules);
      newModules.splice(index, 1);
      return {
        modules: newModules,
        modulesById: modulesById(state.modulesById, action)
      };
    case 'MOVE_MODULE':
      index = getIndexById(action.id, newModules);
      newModules.splice(index + action.n, 0, newModules.splice(index, 1)[0]);
      return Object.assign({}, state, {
        modules: newModules
      });
    case 'RENAME_MODULE':
    case 'TOGGLE_EXPAND_MODULE':
    case 'SET_SOURCE':
      return Object.assign({}, state, {
        modulesById: modulesById(state.modulesById, action)
      });
    default:
      return state;
  }
};

const clips = (state = [], action) => {
  switch (action.type) {
    case 'CREATE_CLIP':
      const clip = {
        id: action.id,
        file: action.file
      };
      return [...state, clip];
    default:
      return state;
  }
};

const reducers = combineReducers({
  song,
  modules,
  clips
});

export default reducers;
