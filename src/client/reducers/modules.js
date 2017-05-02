'use strict';
import { combineReducers } from 'redux';
import { ctx } from '../app';

import {
  CREATE_MODULE,
  REMOVE_MODULE,
  MOVE_MODULE,
  RENAME_MODULE,
  TOGGLE_EXPAND_MODULE,
  SET_FILE,
  SET_BUFFER,
  ROUTE,
  UNROUTE
} from '../actions';

let colorIndex = 0;

const colors = [
  '#12e6ba',
  '#e6cd12',
  '#e61269',
  '#12a0e6',
  '#e68612',
  '#dde0e6',
  '#d112e6',
  '#45e612',
  '#8312e6',
  '#607290',
  '#bae612',
  '#b312e6',
  '#e61212',
];

const getNextColor = () => {
  if (colorIndex > colors.length - 1) {
    colorIndex = 0;
  }
  return colors[colorIndex++];
};

const getIndexById = (id, array) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === id) {
      return i;
    }
  }
  return -1;
};

const connectToEffects = (node, effects) => {
  node.disconnect();
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

const connectToDestination = (module) => {
  module.gain.connect(ctx.destination);
};

const connectModules = (source, destination) => {
  source.gain.connect(destination.merger);
};

const disconnectModules = (source, destination) => {
  source.gain.disconnect(destination.merger);
};

const wireUp = (module) => {
  const newModule = Object.assign({}, module);
  const {bufferSource, merger, effects} = newModule;

  bufferSource.disconnect();
  bufferSource.connect(merger);
  const last = connectToEffects(merger, effects);
  last.connect(module.gain);

  return newModule;
};

const modulesById = (state = {}, action) => {
  const newState = Object.assign({}, state);
  const module = newState[action.id];

  switch (action.type) {
    case CREATE_MODULE:
      const newModule = wireUp({
        id: action.id,
        name: action.name ? action.name : '',
        effects: [],
        file: null,
        merger: ctx.createChannelMerger(),
        bufferSource: ctx.createBufferSource(),
        gain: ctx.createGain(),
        isOpen: false,
        destinations: [],
        sources: [],
        color: getNextColor()
      });

      if (action.id === 0) {
        connectToDestination(newModule);
      }

      return Object.assign({}, state, {
        [action.id]: newModule
      });
    case REMOVE_MODULE:
      delete newState[action.id];
      return newState;
    case RENAME_MODULE:
      module.name = action.name;
      return newState;
    case TOGGLE_EXPAND_MODULE:
      module.isOpen = !module.isOpen;
      return newState;
    case SET_FILE:
      module.file = action.file;
      return newState;
    case SET_BUFFER:
      module.bufferSource.buffer = action.buffer;
      return newState;
    /*case ADD_EQ:
      module.effects[action.index] = {
        param1: {freq: 0, value: 0},
        param2: {freq: 0, value: 0},
        param3: {freq: 0, value: 0},
        param4: {freq: 0, value: 0},
        param5: {freq: 0, value: 0},
        param6: {freq: 0, value: 0}
      };*/
    case ROUTE:
      if (action.id !== action.destination && action.id !== 0) {
        const destination = newState[action.destination];
        const destinationIndex = module.destinations.indexOf(action.destination);
        const sourceIndex = destination.sources.indexOf(action.id);
        const rerouteIndex = destination.destinations.indexOf(action.id);
        if (destinationIndex === -1 && sourceIndex === -1 && rerouteIndex === -1) {
          module.destinations.push(action.destination);
          destination.sources.push(action.id);
          connectModules(module, destination);
        }
      }
      return newState;
    case UNROUTE:
      const destination = newState[action.destination];
      const destinationIndex = module.destinations.indexOf(action.destination);
      const sourceIndex = destination.sources.indexOf(action.id);
      if (destinationIndex !== -1 && sourceIndex !== -1) {
        module.destinations.splice(destinationIndex, 1);
        destination.sources.splice(sourceIndex, 1);
        disconnectModules(module, newState[action.destination]);
      }
      return newState;
    case MOVE_MODULE:
    default:
      return state;
  }
};

const modules = (state = [], action) => {
  const newState = [...state];
  let index = getIndexById(action.id, state);

  switch (action.type) {
    case CREATE_MODULE:
      return [...state, action.id];
    case REMOVE_MODULE:
      newState.splice(index, 1);
      return newState;
    case MOVE_MODULE:
      newState.splice(
        index + action.n, 0, newState.splice(index, 1)[0]);
      return newState;
    default:
      return state;
  }
};

export default combineReducers({
  modules,
  modulesById
});
