'use strict';
import React from 'react';
import Range from './range';
import Meter from './meter';
import {defaultCompressor, SECOND_COLOR, LIGHT_GRAY} from '../settings';

export default class CompressorDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reductionHeights: [],
      waveform: []
    };
    this.onChange = this.onChange.bind(this);
    this.timeInterval = 5;
    this.max = 3;
    this.min = -60;
    this.willDraw = true;
  }

  componentDidMount() {
    this.initContext();
    this.startDrawingLoop();
  }

  initContext() {
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = SECOND_COLOR;
    ctx.lineWidth = 1;
  }

  startDrawingLoop() {
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    const drawTick = time => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawReductionCurve(time);
      if (this.willDraw) {
        window.requestAnimationFrame(drawTick);
      }
    };
    window.requestAnimationFrame(drawTick);
  }

  getReductionPosition(reductionHeight, dt, canvas) {
    const xRatio = dt / this.timeInterval;
    const x = canvas.width * (1 - xRatio);
    const yRatio = (this.max - this.min) / this.max;
    const y = 1 / yRatio * canvas.height + reductionHeight;
    return [x, y];
  }

  drawReductions() {
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');

    this.setState(prevState => {
      const reductionHeights = [];
      const lastIndex = prevState.reductionHeights.length - 1;
      const lastTime = prevState.reductionHeights[lastIndex].time;

      ctx.beginPath();

      prevState.reductionHeights.forEach(obj => {
        let {reductionHeight, time} = obj;
        const dt = (lastTime - time) / 1000;
        if (dt > this.timeInterval) return;
        const [x, y] = this.getReductionPosition(reductionHeight, dt, canvas);
        ctx.lineTo(x, y);
        reductionHeights.push(obj);
      });

      ctx.stroke();

      return {reductionHeights};
    });
  }

  drawReductionCurve(time) {
    if (!this.canvas) return;
    const compressor = this.props.effect.compressor;
    const interval = this.max - this.min;
    let reduction = compressor.reduction;

    if (typeof reduction === 'object') {
      reduction = reduction.value;
    }

    const reductionHeight = -1 * reduction / interval * this.canvas.height;

    this.setState(prevState => ({
      reductionHeights: [...prevState.reductionHeights, {reductionHeight, time}]
    }));

    this.drawReductions();
  }

  componentWillUnmount() {
    this.willDraw = false;
  }

  getPercentage(value) {
    const val = value - this.min;
    const interval = this.max - this.min;
    const percentage = 100 * val / interval;
    return percentage;
  }

  onChange(value) {
    this.props.onChange(value);
  }

  render() {
    return (
      <Range
        onChange={this.onChange}
        min={this.min}
        max={this.max > 0 ? 0 : this.max}
        value={this.props.effect.compressor.threshold.value}
        default={defaultCompressor.threshold}
      >
        {(value, percentage) => (
          <div className="display">
            <Meter
              width={257}
              height={183}
              analyser={this.props.effect.analyserIn}
              timeInterval={this.timeInterval}
              color={LIGHT_GRAY}
            />
            <canvas width="257" height="183" ref={canvas => this.canvas = canvas}/>
            <div
              className="indicator"
              style={{bottom: `${this.getPercentage(value)}%`}}
            >
            </div>
          </div>
        )}
      </Range>
    );
  }
};
