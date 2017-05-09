'use strict';
import { combineReducers } from 'redux';
import { ctx } from '../app';
import { MAX_ROUTES } from '../settings';
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
  ADD_EQ,
  ADD_COMPRESSOR,
  REMOVE_EFFECT,
  OPEN_EFFECT,
  SET_PLAYING,
  SET_POSITION
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

const play = (module, song, newSongPosition) => {
  const songPosition = newSongPosition || song.position;
  const { clips, leftMerger, rightMerger } = module;
  module.bufferSources = [];
  clips.forEach(clip => {
    const { buffer, position } = clip;
    if (!buffer) return;
    const bufferSource = ctx.createBufferSource();

    const secondsPerBeat = 60 / song.tempo;
    const secondsToSongPosition = secondsPerBeat * songPosition;
    const secondsToClipPosition = secondsPerBeat * position;

    let when = secondsToClipPosition - secondsToSongPosition;
    when = (when < 0) ? 0 : when;
    const offset = (when > 0) ? 0 : secondsToSongPosition - secondsToClipPosition;

    bufferSource.buffer = buffer;
    const splitter = ctx.createChannelSplitter(2);
    bufferSource.connect(splitter);
    splitter.connect(leftMerger, 0);
    splitter.connect(rightMerger, 1);
    bufferSource.start(ctx.currentTime + when, offset);
    clip.bufferSource = bufferSource;
  });
};

const stop = ({ clips }) => {
  clips.forEach(({ bufferSource }) => {
    if (bufferSource) {
      bufferSource.stop();
      bufferSource = null;
    }
  });
};

const solo = (id, modulesById) => {
  let unSolo = false;
  if (modulesById[id].isSoloed) {
    unSolo = true;
    for (let key in modulesById) {
      if (modulesById[key].isSoloed && key !== String(id) && key !== '0') {
        unSolo = false;
        break;
      }
    }
    if (!unSolo) {
      modulesById[id].muteGain.gain.value = 0;
    }
  } else if (!modulesById[id].isMuted) {
    modulesById[id].muteGain.gain.value = 1;
  }

  let isFirstSolo = true;
  for (let key in modulesById) {
    if (modulesById[key].isSoloed) {
      isFirstSolo = false;
      break;
    }
  }

  if (isFirstSolo && id !== 0) {
    modulesById[0].isSoloed = true;
  }

  if (unSolo && id !== 0) {
    modulesById[0].isSoloed = false;
  }

  for (let key in modulesById) {
    if (!modulesById[key].isSoloed && key !== String(id)) {
      if (unSolo && !modulesById[key].isMuted) {
        modulesById[key].muteGain.gain.value = 1;
      } else {
        modulesById[key].muteGain.gain.value = 0;
      }
    }
  }
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
  const splitter = ctx.createChannelSplitter(2);
  source.gain.connect(splitter);
  splitter.connect(destination.leftMerger, 0);
  splitter.connect(destination.rightMerger, 1);
};

const disconnectModules = (source, destination) => {
  source.gain.disconnect(destination.merger);
};

const wireUp = (module) => {
  const newModule = Object.assign({}, module);
  const {leftMerger, rightMerger, effects} = newModule;
  const merger = ctx.createChannelMerger(2);
  leftMerger.connect(merger, 0, 0);
  rightMerger.connect(merger, 0, 1);
  const last = connectToEffects(merger, effects);
  last.connect(module.muteGain);
  module.muteGain.connect(module.gain);
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
        type: 'EQ',
        param1: {freq: 0, value: 0},
        param2: {freq: 0, value: 0},
        param3: {freq: 0, value: 0},
        param4: {freq: 0, value: 0},
        param5: {freq: 0, value: 0},
        param6: {freq: 0, value: 0}
      };
      // TODO connect effect
      return newState;
    case ADD_COMPRESSOR:
      newState[action.index] = {
        type: 'COMPRESSOR'
      };
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
        clips: [],
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
    case SOLO_MODULE:
      solo(action.id, newState);
    case MUTE_MODULE:
      if (
        action.type === MUTE_MODULE &&
        newState[action.id].isMuted &&
        !newState[action.id].isSoloed
      ) {
        let moduleIsSoloed = false;
        for (let id in newState) {
          if (newState[id].isSoloed && id !== String(action.id)) {
            moduleIsSoloed = true;
            break;
          }
        }
        if (moduleIsSoloed) {
          newState[action.id].isMuted = false;
          return newState;
        }
      }
    case RENAME_MODULE:
    case SET_VOLUME:
    case TOGGLE_EXPAND_MODULE:
    case ADD_CLIP:
    case SET_BUFFER:
    case ADD_EQ:
    case ADD_COMPRESSOR:
    case REMOVE_EFFECT:
    case OPEN_EFFECT:
      return Object.assign({}, state, {
        [action.id]: module(state[action.id], action)
      });
    case SET_PLAYING:
      for (let id in newState) {
        if (action.playing) {
          play(newState[id], action.song);
        } else {
          stop(newState[id]);
        }
      }
      return newState;
    case SET_POSITION:
      if (action.song && action.song.isPlaying) {
        for (let id in newState) {
          stop(newState[id]);
          play(newState[id], action.song, (action.position < 0) ? 0 : action.position);
        }
      }
      return newState;
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
