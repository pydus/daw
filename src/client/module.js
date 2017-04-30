'use strict';

const ctx = new AudioContext();

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

export const addFileToModule = (file, module) => {
  module.file = file;
};

export const addBufferToModule = (buffer, module) => {
  const currentBufferSource = module.bufferSource;
  const source =  currentBufferSource ?
    currentBufferSource : ctx.createBufferSource();
  module.bufferSource = source;
  module.bufferSource.buffer = buffer;
  const last = connectToEffects(source, module.effects);
  last.connect(ctx.destination);
};

export const loadBuffer = (file, cb) => {
  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);

  fileReader.onload = (e) => {
    const arrayBuffer = e.target.result;
    ctx.decodeAudioData(arrayBuffer, cb);
  };
};

export const createModule = (id, name) => ({
  id: id,
  name: name ? name : '',
  effects: [],
  file: null,
  bufferSource: null,
  isOpen: false
});
