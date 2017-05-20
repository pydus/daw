'use strict';
import React from 'react';
import {connect} from 'react-redux';
import {FIRST_COLOR, SECOND_COLOR} from '../settings';

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
    if (!canvas) return;
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
    const maxLevel = analyser.maxDecibels - analyser.minDecibels;
    const y = canvas.height - canvas.height * averageLevel / maxLevel;
    const gradient = ctx.createLinearGradient(0, canvas.height, 0, y);
    gradient.addColorStop(0, FIRST_COLOR);
    gradient.addColorStop(1, SECOND_COLOR);

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
      let willLoop = true;
      const loop = () => {
        this.drawLevel();
        if (willLoop) {
          window.requestAnimationFrame(loop);
        }
      };
      window.requestAnimationFrame(loop);
      setTimeout(() => {
        willLoop = false;
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
