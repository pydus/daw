'use strict';
import { combineReducers } from 'redux';
import { ctx } from '../app';
import { MAX_ROUTES } from '../settings';
import {
  CREATE_MODULE,
  REMOVE_MODULE,
  MOVE_MODULE,
  RENAME_MODULE,
  TOGGLE_EXPAND_MODULE,
  SET_FILE,
  SET_BUFFER,
  ROUTE,
  UNROUTE,
  ADD_EQ,
  REMOVE_EFFECT,
  OPEN_EFFECT
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

const effects = (state = [], action) => {
  const newState = [...state];
  switch (action.type) {
    case REMOVE_EFFECT:
      newState.splice(action.index, 1);
      // TODO disconnect effect
      return newState;
    case ADD_EQ:
      newState[action.index] = {
        param1: {freq: 0, value: 0},
        param2: {freq: 0, value: 0},
        param3: {freq: 0, value: 0},
        param4: {freq: 0, value: 0},
        param5: {freq: 0, value: 0},
        param6: {freq: 0, value: 0}
      };
      // TODO connect effect
      return newState;
    default:
      return state;
  }
};

const module = (state = {}, action) => {
  const newState = Object.assign({}, state);

  switch (action.type) {
    case CREATE_MODULE:
      const newModule = wireUp({
        id: action.id,
        name: action.name ? action.name : '',
        effects: [],
        openEffect: -1,
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

      return newModule;
    case RENAME_MODULE:
      return Object.assign({}, state, {name: action.name});
    case TOGGLE_EXPAND_MODULE:
      return Object.assign({}, state, {isOpen: !state.isOpen});
    case SET_FILE:
      return Object.assign({}, state, {file: action.file});
    case SET_BUFFER:
      newState.bufferSource.buffer = action.buffer;
      return newState;
    case ROUTE:
      if (action.id === state.id) {
        newState.destinations.push(action.destination);
      } else {
        newState.sources.push(action.id);
      }
      return newState;
    case UNROUTE:
      if (action.id === state.id) {
        const destinationIndex = state.destinations.indexOf(action.destination);
        newState.destinations.splice(destinationIndex, 1);
      } else {
        const sourceIndex = state.sources.indexOf(action.id);
        newState.sources.splice(sourceIndex, 1);
      }
      return newState;
    case OPEN_EFFECT:
      const index = (
          newState.effects[action.index] &&
          action.index !== newState.openEffect
        ) ? action.index : -1;
      return Object.assign({}, state, {openEffect: index});
    default:
      return Object.assign({}, state, {effects: effects(state.effects, action)});
  }
};

const modulesById = (state = {}, action) => {
  const newState = Object.assign({}, state);

  switch (action.type) {
    case CREATE_MODULE:
      return Object.assign({}, state, {
         [action.id]: module(undefined, action)
      });
    case REMOVE_MODULE:
      delete newState[action.id];
      return newState;
    case ROUTE:
      if (action.id !== action.destination && action.id !== 0) {
        const source = newState[action.id];
        const destination = newState[action.destination];
        const destinationIndex = source.destinations.indexOf(action.destination);
        const sourceIndex = destination.sources.indexOf(action.id);
        const rerouteIndex = destination.destinations.indexOf(action.id);
        if (
            source.destinations.length < MAX_ROUTES &&
            destinationIndex === -1 &&
            sourceIndex === -1 &&
            rerouteIndex === -1
          ) {
          newState[action.id] = module(source, action);
          newState[action.destination] = module(destination, action);
          connectModules(source, destination);
        }
      }
      return newState;
    case UNROUTE:
      const source = newState[action.id];
      const destination = newState[action.destination];
      const destinationIndex = source.destinations.indexOf(action.destination);
      const sourceIndex = destination.sources.indexOf(action.id);
      if (destinationIndex !== -1 && sourceIndex !== -1) {
        newState[action.id] = module(source, action);
        newState[action.destination] = module(destination, action);
        disconnectModules(source, newState[action.destination]);
      }
      return newState;
    case RENAME_MODULE:
    case TOGGLE_EXPAND_MODULE:
    case SET_FILE:
    case SET_BUFFER:
    case ADD_EQ:
    case REMOVE_EFFECT:
    case OPEN_EFFECT:
      return Object.assign({}, state, {
        [action.id]: module(state[action.id], action)
      });
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
        index + action.n, 0, newState.splice(index, 1)[0]
      );
      return newState;
    default:
      return state;
  }
};

export default combineReducers({
  modules,
  modulesById
});
