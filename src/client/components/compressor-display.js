'use strict';
import React from 'react';
import Range from './range';
import Meter from './meter';
import {defaultCompressor, SECOND_COLOR} from '../settings';

export default class CompressorDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      percentage: 0,
      reductionHeights: [],
      waveform: []
    };
    this.onChange = this.onChange.bind(this);
    this.timeInterval = 5;
    this.max = 5;
    this.min = -90;
    this.willDraw = true;
  }

  drawReductions() {
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    this.setState(prevState => {
      const reductionHeights = [];
      const lastTime = prevState.reductionHeights[prevState.reductionHeights.length - 1].time;
      ctx.beginPath();
      for (let i = 0; i < prevState.reductionHeights.length; i++) {
        let obj = prevState.reductionHeights[i];
        let {reductionHeight, time} = obj;
        const dt = (lastTime - time) / 1000;
        if (dt > this.timeInterval) continue;
        const x = canvas.width - canvas.width * dt / this.timeInterval;
        ctx.lineTo(x, this.max / (this.max - this.min) * canvas.height + reductionHeight);
        reductionHeights.push(obj);
      }
      ctx.stroke();
      return {reductionHeights};
    });
  }

  drawReductionCurve(time) {
    const canvas = this.canvas;
    if (!canvas) return;
    const compressor = this.props.effect.compressor;
    const interval = this.max - this.min;
    let reduction = compressor.reduction;
    if (typeof reduction === 'object') {
      reduction = reduction.value;
    }
    const reductionHeight = -1 * reduction / interval * canvas.height;
    this.setState(prevState => {
      return {
        reductionHeights: [...prevState.reductionHeights, {reductionHeight, time}]
      };
    });
    this.drawReductions();
  }

  componentWillUnmount() {
    this.willDraw = false;
  }

  componentDidMount() {
    this.calculatePercentage(this.state.value);
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = SECOND_COLOR;
    ctx.lineWidth = 1;
    const draw = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.drawReductionCurve(time);
      if (this.willDraw) {
        window.requestAnimationFrame(draw);
      }
    };
    window.requestAnimationFrame(draw);
  }

  calculatePercentage(value) {
    const val = Math.abs(this.min - value);
    const interval = Math.abs(this.max - this.min);
    const percentage = 100 * val / interval;
    this.setState({percentage});
  }

  onChange(value) {
    this.props.onChange(value);
    this.setState({value});
    this.calculatePercentage(value);
  }

  render() {
    return (
      <Range
        onChange={this.onChange}
        min={this.min}
        max={this.max}
        default={defaultCompressor.threshold}
      >
        <div className="display">
          <canvas width="257" height="181" ref={canvas => this.canvas = canvas}/>
          <Meter
            width={257}
            height={181}
            analyser={this.props.effect.analyserIn}
            timeInterval={this.timeInterval}
          />
          <div
            className="indicator"
            style={{bottom: `${this.state.percentage}%`}}
          >
          </div>
        </div>
      </Range>
    );
  }
};
