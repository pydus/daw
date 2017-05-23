'use strict';
import React from 'react';
import {connect} from 'react-redux';
import {SECOND_COLOR} from '../settings';

export default connect((state) => ({
  song: state.song
}))(class Meter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {waveform: [], willLoop: true};
    this.timeInterval = this.props.timeInterval || 2;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.song.isPlaying) {
      this.drawLevel(Date.now());
    }
  }

  componentDidMount() {
    const analyser = this.props.analyser;
    analyser.fftSize = 256;
    analyser.maxDecibels = 5;
    analyser.minDecibels = -90;
    analyser.smoothingTimeConstant = 0.75;
  }

  drawLine(y) {
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = SECOND_COLOR;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  drawWaveform(y, time) {
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;
    ctx.strokeStyle = SECOND_COLOR;
    this.setState(prevState => {
      prevState.waveform.push({y, time});
      const waveform = [];
      const lastTime = prevState.waveform[prevState.waveform.length - 1].time;
      ctx.beginPath();
      for (let i = 0; i < prevState.waveform.length; i++) {
        let obj = prevState.waveform[i];
        let {y, time} = obj;
        const dt = (lastTime - time) / 1000;
        if (dt > this.timeInterval) continue;
        const dx = canvas.width * dt / this.timeInterval;
        const x = (this.props.direction === 'right') ? dx : canvas.width - dx;
        ctx.lineTo(x, y);
        waveform.push(obj);
      }
      ctx.stroke();
      return {waveform};
    });
  }

  drawLevel(time) {
    const canvas = this.canvas;
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.props.type === 'line') {
      this.drawLine(y);
    } else {
      this.drawWaveform(y, time);
    }
  }

  render() {
    return (
      <div className="meter">
        <canvas
          ref={canvas => this.canvas = canvas}
          height={this.props.height}
          width={this.props.width}
        ></canvas>
      </div>
    );
  }
});
