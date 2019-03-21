import React, {Component} from 'react';
import {getLogFrequencyRatio} from '../audio-tools';

export default class Grid extends Component {
  constructor(props) {
    super(props);
    this.valuesPerHorizontalLine = props.valuesPerHorizontalLine || 5;
  }

  componentDidMount() {
    this.draw();
  }

  drawVerticalLine(x) {
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  };

  drawHorizontalLine(y) {
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  drawVerticalLines() {
    const {maxFrequency, minFrequency} = this.props;
    const canvas = this.canvas;

    for (let i = 10; i < maxFrequency; i *= 10) {
      for (let j = 1; j < 10; j++) {
        const freq = i * (j + 1);
        const ratio = getLogFrequencyRatio(freq, minFrequency, maxFrequency);
        const x = canvas.width * ratio;
        this.drawVerticalLine(x);
      }
    }
  }

  drawHorizontalLines() {
    const canvas = this.canvas;
    const numberOfHorizontalSpaces = 2 * this.props.maxValue / this.valuesPerHorizontalLine;
    const numberOfHorizontalLines = numberOfHorizontalSpaces - 1;

    for (let i = 0; i < numberOfHorizontalLines; i++) {
      this.drawHorizontalLine((i + 1) * canvas.height / numberOfHorizontalSpaces);
    }
  }

  draw() {
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#1e2e4d';
    this.drawVerticalLines();
    this.drawHorizontalLines();
  }

  render() {
    return <canvas width={this.props.width} height={this.props.height} ref={canvas => this.canvas = canvas}/>;
  }
}
