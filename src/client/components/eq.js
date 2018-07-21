'use strict';
import React from 'react';
import Range from './range';
import {LIGHT_GRAY} from '../settings';

export default class Eq extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputGain: props.effect.inputGain.gain.value,
      outputGain: props.effect.outputGain.gain.value
    };
    this.onInputGainChange = this.onInputGainChange.bind(this);
    this.onOutputGainChange = this.onOutputGainChange.bind(this);
    this.onFrequencyChange = this.onFrequencyChange.bind(this);
    this.onGainChange = this.onGainChange.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.minFrequency = 20;
    this.maxFrequency = 20000;
    this.maxValue = 20;
    this.QStepPercentage = 12;
  }

  componentDidMount() {
    this.drawGrid();
    this.drawCurve();
  }

  usesGain(filter) {
    return ['highshelf', 'lowshelf', 'peaking'].indexOf(filter.type) !== -1;
  }

  getBandwidth(filter) {
    return 2 / Math.log(2) * Math.asinh(1 / (2 * filter.Q.value));
  }

  getLogFrequencyRatio(frequency) {
    return (
      Math.log10(frequency / this.minFrequency) /
      Math.log10(this.maxFrequency / this.minFrequency)
    );
  }

  getFrequencyAtX(x) {
    return (
      this.minFrequency *
      Math.pow(
        10,
        x / this.canvas.width * Math.log10(this.maxFrequency / this.minFrequency)
      )
    );
  }

  edit(settings) {
    this.props.onEdit(settings);
  }

  onInputGainChange(value) {
    this.setState({inputGain: value});
    this.edit({inputGain: value});
  }

  onOutputGainChange(value) {
    this.setState({outputGain: value});
    this.edit({outputGain: value});
  }

  onFrequencyChange(frequency, index) {
    this.edit({frequency, index});
    this.drawCurve();
  }

  onGainChange(gain, index) {
    if (this.usesGain(this.props.effect.filters[index])) {
      this.edit({gain, index});
      this.drawCurve();
    }
  }

  onWheel(e, index) {
    e.preventDefault();
    const sign = Math.abs(e.deltaY) / (e.deltaY || 1);
    const Q = this.props.effect.filters[index].Q.value * (1 + sign * this.QStepPercentage / 100);
    this.edit({Q, index});
    this.drawCurve();
  }

  drawCurve() {
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    const length = Math.floor(canvas.width);
    const frequencyArray = new Float32Array(length).map(
      (el, x) => this.getFrequencyAtX(x)
    );
    const filters = this.props.effect.filters;
    const magResponses = filters.map(filter => {
      const magResponse = new Float32Array(length);
      const phaseResponse = new Float32Array(length);
      filter.getFrequencyResponse(frequencyArray, magResponse, phaseResponse);
      return magResponse;
    });

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = LIGHT_GRAY;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    frequencyArray.forEach((frequency, x) => {
      const gainValues = magResponses.map(magResponse => 20 * Math.log10(magResponse[x]));
      const totalGain = gainValues.reduce((a, b) => a + b);
      const y = canvas.height * (0.5 - 0.5 * totalGain / this.maxValue);
      ctx.lineTo(x, y);
    });

    ctx.stroke();
  }

  drawGrid() {
    const gridCanvas = this.gridCanvas;
    const ctx = gridCanvas.getContext('2d');
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#1e2e4d';
    ctx.beginPath();

    for (let i = 10; i < 10000; i *= 10) {
      for (let j = 1; j < 10; j++) {
        const frequency = i * (j + 1);
        const ratio = this.getLogFrequencyRatio(frequency);
        const x = gridCanvas.width * ratio;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, gridCanvas.height);
      }
    }

    const drawHorizontalLine = y => {
      ctx.moveTo(0, y);
      ctx.lineTo(gridCanvas.width, y);
    };

    for (let i = 0; i < 7; i++) {
      drawHorizontalLine((i + 1) * gridCanvas.height / 8);
    }

    ctx.stroke();
  }

  render() {
    const eq = this.props.effect;
    const controls = eq.filters.map((filter, i) => (
      <Range
        key={i}
        onChange={value => this.onFrequencyChange(value, i)}
        max={this.maxFrequency}
        min={this.minFrequency}
        default={eq.initialFrequencies[i]}
        value={filter.frequency.value}
        direction="horizontal"
      >
        <Range
          onChange={value => this.onGainChange(value, i)}
          max={this.maxValue}
          min={-this.maxValue}
          default={0}
          value={filter.gain.value}
        >
          <div
            className="control"
            onWheel={e => this.onWheel(e, i)}
            style={{
              left: `${100 * this.getLogFrequencyRatio(filter.frequency.value)}%`,
              top: `${this.usesGain(filter) ? 50 - 50 * filter.gain.value / this.maxValue : 50}%`
            }}
          >
            <div className={`text ${filter.gain.value > 15 ? 'low' : ''} ${filter.frequency.value > 13000 ? 'left' : ''} ${filter.frequency.value < 28 ? 'right' : ''}`}>
              {`${filter.gain.value.toFixed(2)} dB`}
            </div>
            <div className={`text ${filter.gain.value < -15 ? 'high' : ''} ${filter.frequency.value > 13000 ? 'left' : ''} ${filter.frequency.value < 28 ? 'right' : ''}`}>
              {`${filter.frequency.value.toFixed(2)} Hz`}
            </div>
          </div>
        </Range>
      </Range>
    ));
    return (
      <div>
        <Range
          display="block"
          onChange={this.onInputGainChange}
          min="0"
          max="2"
          default="1"
          value={this.state.inputGain}
        >
          <div className="volume-wrapper">
            <div
              className="volume"
              style={{height: `${this.state.inputGain / 2 * 100}%`}}
            ></div>
          </div>
        </Range>
        <Range
          display="block"
          onChange={this.onOutputGainChange}
          min="0"
          max="2"
          default="1"
          value={this.state.outputGain}
        >
          <div className="volume-wrapper right">
            <div
              className="volume"
              style={{height: `${this.state.outputGain / 2 * 100}%`}}
            ></div>
          </div>
        </Range>
        <div className="content">
          <div className="panel">
            <div className="knob"></div>
          </div>
          <div className="eq-display">
            <canvas width="396" height="183" ref={gridCanvas => this.gridCanvas = gridCanvas}/>
            <canvas width="396" height="183" ref={canvas => this.canvas = canvas}/>
            {controls}
          </div>
        </div>
      </div>
    );
  }
};
