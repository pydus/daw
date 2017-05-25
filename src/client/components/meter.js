'use strict';
import React from 'react';
import {connect} from 'react-redux';
import {SECOND_COLOR, LIGHT_GRAY} from '../settings';

export default connect((state) => ({
  song: state.song
}))(class Meter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {waveform: [], willLoop: true};
    this.timeInterval = this.props.timeInterval || 2;
    // peak meters measuring digital audio need a level adjustment
    // to get closer to the true peak and to allow headroom for signal
    // processing that may increase the amplitude
    this.alignmentLevel = -20; // dB corresponding to a true level of 0 VU
    this.max = 3;
    this.min = -60;
  }

  componentWillReceiveProps(nextProps) {
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    if (nextProps.song.isPlaying) {
      if (!this.props.song.isPlaying) {
        this.setState({waveform: []});
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (this.props.type === 'line') {
        this.drawZeroDbLine();
      }
      this.drawLevel(Date.now());
    }
  }

  componentDidMount() {
    const analyser = this.props.analyser;
    analyser.fftSize = 2048;
    analyser.maxDecibels = this.max + this.alignmentLevel;
    analyser.minDecibels = this.min;
    analyser.smoothingTimeConstant = 0;
    if (this.props.type === 'line') {
      this.drawZeroDbLine();
    }
  }

  drawLine(y) {
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = this.props.color || SECOND_COLOR;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  drawWaveform(y, time) {
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.props.color || SECOND_COLOR;
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

    let peak = 0;

    for (let i = 0; i < bufferLength; i++) {
      if (data[i] > peak) {
        peak = data[i]
      }
    }

    const levelRatio = peak / 255;
    const y = canvas.height * (1 - levelRatio);

    if (this.props.type === 'line') {
      this.drawLine(y);
    } else {
      this.drawWaveform(y, time);
    }
  }

  drawZeroDbLine() {
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    const analyser = this.props.analyser;
    const interval = analyser.maxDecibels - analyser.minDecibels;
    const y = canvas.height * (this.max - 1) / interval;
    ctx.lineWidth = 1;
    ctx.strokeStyle = LIGHT_GRAY;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
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
