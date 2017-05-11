'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { UPDATE_INTERVAL } from '../settings';

export default connect((state) => ({
  song: state.song
}))(class Meter extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const analyser = this.props.analyser;
    analyser.fftSize = 256;
    analyser.maxDecibels = 3;
    analyser.minDecibels = -160;
    analyser.smoothingTimeConstant = 0.75;
  }

  drawLevel() {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    const analyser = this.props.analyser;
    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);

    analyser.getByteFrequencyData(data);

    let total = 0;

    for (let i = 0; i < bufferLength; i++) {
      total += data[i];
    }

    const averageLevel = total / bufferLength;
    const y = canvas.height - canvas.height * averageLevel / 75;
    const gradient = ctx.createLinearGradient(0, canvas.height, 0, y);
    gradient.addColorStop(0, '#3047d2');
    gradient.addColorStop(1, '#12e6ba');

    ctx.lineWidth = canvas.width;
    ctx.strokeStyle = gradient;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height);
    ctx.lineTo(canvas.width / 2, y);
    ctx.stroke();
  }

  componentDidUpdate() {
    if (this.props.song.isPlaying) {
      this.drawLevel();
    } else {
      const interval = setInterval(() => {
        this.drawLevel();
      }, UPDATE_INTERVAL);
      setTimeout(() => {
        clearInterval(interval);
      }, 2000);
    }
  }

  render() {
    return (
      <div className="meter">
        <canvas ref="canvas"></canvas>
      </div>
    );
  }
});
