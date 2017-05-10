'use strict';
import { ctx } from '../app';
import { MAX_ROUTES } from '../settings';
import effects from './effects';
import {
  CREATE_MODULE,
  REMOVE_MODULE,
  MOVE_MODULE,
  RENAME_MODULE,
  SET_VOLUME,
  MUTE_MODULE,
  SOLO_MODULE,
  TOGGLE_EXPAND_MODULE,
  ADD_CLIP,
  SET_BUFFER,
  ROUTE,
  UNROUTE,
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

const connectToEffects = (node, effects) => {
  node.disconnect();
  let last = node;
  effects.forEach((effect) => {
    if (effect) {
      last.connect(effect.input);
      effect.output.disconnect();
      last = effect.output;
    }
  });
  return last;
};

const wireUp = (module) => {
  const newModule = Object.assign({}, module);
  const {leftMerger, rightMerger, effects} = newModule;
  const merger = ctx.createChannelMerger(2);
  leftMerger.disconnect();
  rightMerger.disconnect();
  leftMerger.connect(merger, 0, 0);
  rightMerger.connect(merger, 0, 1);
  const last = connectToEffects(merger, effects);
  last.connect(module.muteGain);
  module.muteGain.connect(module.gain);
  return newModule;
};

const connectToDestination = (module) => {
  module.gain.connect(ctx.destination);
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
        clips: [],
        splitter: ctx.createChannelSplitter(2),
        leftMerger: ctx.createChannelMerger(MAX_ROUTES),
        rightMerger: ctx.createChannelMerger(MAX_ROUTES),
        muteGain: ctx.createGain(),
        gain: ctx.createGain(),
        isMuted: false,
        isSoloed: false,
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
    case SET_VOLUME:
      newState.gain.gain.value = action.volume;
      return newState;
    case MUTE_MODULE:
      if (newState.isMuted) {
        newState.muteGain.gain.value = 1;
      } else {
        newState.muteGain.gain.value = 0;
      }
      return Object.assign({}, state, {isMuted: !state.isMuted});
    case SOLO_MODULE:
      return Object.assign({}, state, {isSoloed: !state.isSoloed});
    case TOGGLE_EXPAND_MODULE:
      return Object.assign({}, state, {isOpen: !state.isOpen});
    case ADD_CLIP:
      return Object.assign({}, state, {
        clips: [...state.clips, {
          file: action.file,
          buffer: 0,
          bufferSource: null,
          position: action.position
        }]
      });
    case SET_BUFFER:
      newState.clips[action.index].buffer = action.buffer;
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
      if (action.type.slice(0, 3) === 'ADD' || action.type === REMOVE_EFFECT) {
        return wireUp(
          Object.assign({}, state, {effects: effects(state.effects, action)})
        );
      }
      return Object.assign({}, state, {effects: effects(state.effects, action)});
  }
};

export default module;
