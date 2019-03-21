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

  draw() {
    const {maxFrequency, minFrequency} = this.props;
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#1e2e4d';
    ctx.beginPath();

    const drawHorizontalLine = y => {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    };

    const drawVerticalLine = x => {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    };

    for (let i = 10; i < maxFrequency; i *= 10) {
      for (let j = 1; j < 10; j++) {
        const freq = i * (j + 1);
        const ratio = getLogFrequencyRatio(freq, minFrequency, maxFrequency);
        const x = canvas.width * ratio;
        drawVerticalLine(x);  
      }
    }

    const numberOfHorizontalSpaces = 2 * this.props.maxValue / this.valuesPerHorizontalLine;
    const numberOfHorizontalLines = numberOfHorizontalSpaces - 1;

    for (let i = 0; i < numberOfHorizontalLines; i++) {
      drawHorizontalLine((i + 1) * canvas.height / numberOfHorizontalSpaces);
    }

    ctx.stroke();
  }

  render() {
    return <canvas width={this.props.width} height={this.props.height} ref={canvas => this.canvas = canvas}/>;
  }
}
