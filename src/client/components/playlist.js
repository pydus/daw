'use strict';
import React from 'react';

export default class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {left: [], right: []};
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  static drawLine(fromX, fromY, toX, toY, ctx) {
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  }

  static resize(width, canvas) {
    canvas.width = width;
    canvas.style.width = width + 'px';
  }

  updateCanvas() {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    const canvasWidth = 1024;
    const canvasHeight = 720;
    const originalWidth = canvas.offsetWidth;

    if (originalWidth === 0) {
      return false;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (this.props.bufferSource && this.props.bufferSource.buffer) {
      const buffer = this.props.bufferSource.buffer;
      const N_SEGMENTS = Math.ceil(buffer.duration);
      const SEGMENT_WIDTH = 5; //Math.floor(canvasWidth / N_SEGMENTS);
      const SEGMENT_SCALE = 1;

      const segmentSectionWidth = N_SEGMENTS * SEGMENT_WIDTH;

      if (segmentSectionWidth > this.props.width) {
        Playlist.resize(segmentSectionWidth, canvas);
        this.props.onWiden(segmentSectionWidth);
      } else {
        Playlist.resize(this.props.width, canvas);
      }

      ctx.strokeStyle = '#10b98a';
      ctx.lineWidth = Math.floor(SEGMENT_WIDTH * 0.8);

      const stereo = buffer.numberOfChannels === 2;
      const left = buffer.getChannelData(0);
      const right = stereo ? buffer.getChannelData(1) : null;
      const MAX_POINTS_PER_SEGMENT = (N_SEGMENTS > left.length) ?
        1 : Math.floor(left.length / N_SEGMENTS);

      const POINTS_PER_SEGMENT = 100;
      const STEP = Math.ceil(MAX_POINTS_PER_SEGMENT / POINTS_PER_SEGMENT);

      for (let i = 0, j = 0, sum = 0, s = 0; i < left.length; i += STEP, j += STEP) {
        if (stereo) {
          sum += (Math.abs(left[i]) + Math.abs(right[i])) / 2;
        } else {
          sum += Math.abs(left[i]);
        }
        if (j >= MAX_POINTS_PER_SEGMENT) {
          const height = sum * STEP / MAX_POINTS_PER_SEGMENT * canvasHeight;
          Playlist.drawLine(
            SEGMENT_WIDTH * s, canvasHeight / 2 - height * SEGMENT_SCALE,
            SEGMENT_WIDTH * s, canvasHeight / 2 + height * SEGMENT_SCALE,
            ctx
          );
          s++;
          j = 0;
          sum = 0;
        }
      }
    }
  }

  render () {
    return (
      <div className="playlist">
        <div className="wrapper">
          <canvas ref="canvas" width="1024" height="720"/>
        </div>
      </div>
    );
  }
};
