import React, {Component} from 'react';
import {LIGHT_GRAY} from '../settings';

export default class Curve extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.draw();
  }

  getFrequencyAtX(x) {
    return (
      this.props.minFrequency *
      Math.pow(
        10,
        x / this.canvas.width * Math.log10(this.props.maxFrequency / this.props.minFrequency)
      )
    );
  }

  draw() {
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    const length = Math.floor(canvas.width);
    const frequencyArray = new Float32Array(length).map(
      (el, x) => this.getFrequencyAtX(x)
    );
    const filters = this.props.filters;
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
      const y = canvas.height * (0.5 - 0.5 * totalGain / this.props.maxValue);
      ctx.lineTo(x, y);
    });

    ctx.stroke();
  }

  componentDidUpdate() {
    this.draw();
  }

  render() {
    return <canvas width={this.props.width} height={this.props.height} ref={canvas => this.canvas = canvas}/>;
  }
}
