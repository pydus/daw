'use strict';
import React from 'react';

export default class Playlist extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const segments = [[], []];

    if (this.props.bufferSource && this.props.bufferSource.buffer) {
      const N_SEGMENTS = 1000;
      const buffer = this.props.bufferSource.buffer;

      for (let c = 0; c < buffer.numberOfChannels; c++) {
        if (c > 2) break;
        const audioData = buffer.getChannelData(0);
        const STEP = Math.floor(audioData.length / N_SEGMENTS);
        for (let i = 0; i < N_SEGMENTS; i++) {
          const dataPoint = audioData[i * STEP];
          const height = `${Math.abs(dataPoint * 100)}%`;
          segments[c].push(
            <div key={i} className="segment" style={{height}}></div>
          );
        }
      }

      if (buffer.numberOfChannels < 2) {
        segments[1] = segments[0];
      }
    }

    return (
      <div className="playlist">
        <div className="wrapper">
          <div className="channels">
            <div className="channel">
              <div className="segments">{segments[0]}</div>
            </div>
            <div className="channel">
              <div className="segments">{segments[1]}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
