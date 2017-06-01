'use strict';
import {ctx} from '../app';
import {MAX_ROUTES} from '../settings';
import module from './module';
import {
  CREATE_MODULE,
  REMOVE_MODULE,
  MUTE_MODULE,
  SOLO_MODULE,
  ROUTE,
  UNROUTE,
  SET_PLAYING,
  SET_POSITION
} from '../actions';

const play = (module, song, newSongPosition) => {
  const songPosition = newSongPosition || song.position;
  const {clips, leftMerger, rightMerger} = module;
  module.bufferSources = [];
  clips.forEach(clip => {
    const {buffer, position} = clip;
    if (!buffer) return;
    const bufferSource = ctx.createBufferSource();

    const secondsPerBeat = 60 / song.tempo;
    const secondsToSongPosition = secondsPerBeat * songPosition;
    const secondsToClipPosition = secondsPerBeat * position;

    let when = Math.max(0, secondsToClipPosition - secondsToSongPosition);
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

const stop = ({clips}) => {
  clips.forEach(({bufferSource}) => {
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

const connectModules = (source, destination) => {
  const {splitter} = source;
  splitter.connect(destination.leftMerger, 0);
  splitter.connect(destination.rightMerger, 1);
};

const disconnectModules = (source, destination) => {
  const {splitter} = source;
  splitter.disconnect(destination.leftMerger, 0);
  splitter.disconnect(destination.rightMerger, 1);
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
    default:
      if (typeof action.id === 'undefined') {
        return state;
      }
      return Object.assign({}, state, {
        [action.id]: module(state[action.id], action)
      });
  }
};

export default modulesById;
