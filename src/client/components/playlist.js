'use strict';
import React from 'react';

export default class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasDrawn: false}
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const canvas = this.refs.canvas;
    if (nextProps.width !== this.props.width || !this.state.hasDrawn) {
      return true;
    }
    return false;
  }

  resize(width) {
    const canvas = this.refs.canvas;
    canvas.width = width;
    canvas.style.width = width + 'px';
  }

  resizeIfNeeded(segmentSectionWidth) {
    if (segmentSectionWidth > this.props.width) {
      this.resize(segmentSectionWidth);
      this.props.onWiden(segmentSectionWidth);
    } else {
      this.resize(this.props.width);
    }
  }

  drawLine(fromX, fromY, toX, toY) {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  }

  drawSegment(n, width, value, padding) {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#12e6ba';
    ctx.lineWidth = width - padding;
    this.drawLine(
      width * n, canvas.height / 2 - value * canvas.height,
      width * n, canvas.height / 2 + value * canvas.height
    );
  }

  drawSegments(
    buffer,
    numberOfSegments,
    segmentWidth = 5,
    segmentPadding = 1,
    segmentScale = 1
  ) {
    const segmentSectionWidth = numberOfSegments * segmentWidth;
    const stereo = buffer.numberOfChannels === 2;
    const left = buffer.getChannelData(0);
    const right = stereo ? buffer.getChannelData(1) : null;
    const maxPointsPerSegment =
      (numberOfSegments > left.length) ?
      1 : Math.floor(left.length / numberOfSegments);
    const pointsPerSegment = 100;
    const step = Math.ceil(maxPointsPerSegment / pointsPerSegment);

    this.resizeIfNeeded(segmentSectionWidth);

    let sum = 0, s = 0;

    for (let i = 0, j = 0; i < left.length; i += step, j += step) {
      if (stereo) {
        sum += (Math.abs(left[i]) + Math.abs(right[i])) / 2;
      } else {
        sum += Math.abs(left[i]);
      }
      if (j >= maxPointsPerSegment) {
        const value = sum * step / maxPointsPerSegment;
        this.drawSegment(s, segmentWidth, value * segmentScale, segmentPadding);
        s++;
        j = 0;
        sum = 0;
      }
    }
  }

  drawWaveform(buffer, segmentDuration) {
    const numberOfSegments = Math.ceil(1000 * buffer.duration / segmentDuration);
    this.drawSegments(buffer, numberOfSegments, 5, 1, 1);
  }

  updateCanvas() {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');

    if (!this.props.bufferSource || !this.props.bufferSource.buffer) {
      return false;
    }

    const buffer = this.props.bufferSource.buffer;
    const segmentDuration = 1000;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawWaveform(buffer, segmentDuration);

    if (!this.state.hasDrawn) {
      this.setState({hasDrawn: true});
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
