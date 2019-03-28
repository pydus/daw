import React, {Component} from 'react';
import {getLogFrequencyRatio} from '../audio-tools';
import Canvas from './canvas';

export default class Grid extends Component {
  constructor(props) {
    super(props);
    this.valuesPerHorizontalLine = props.valuesPerHorizontalLine || 5;
    this.draw = this.draw.bind(this);
  }

  drawVerticalLines(canvas, drawVerticalLine) {
    const {maxFrequency, minFrequency} = this.props;

    for (let i = 10; i < maxFrequency; i *= 10) {
      for (let j = 1; j < 10; j++) {
        const freq = i * (j + 1);
        const ratio = getLogFrequencyRatio(freq, minFrequency, maxFrequency);
        const x = canvas.width * ratio;
        drawVerticalLine(x);
      }
    }
  }

  drawHorizontalLines(canvas, drawHorizontalLine) {
    const numberOfHorizontalSpaces = 2 * this.props.maxValue / this.valuesPerHorizontalLine;
    const numberOfHorizontalLines = numberOfHorizontalSpaces - 1;

    for (let i = 0; i < numberOfHorizontalLines; i++) {
      drawHorizontalLine((i + 1) * canvas.height / numberOfHorizontalSpaces);
    }
  }

  draw(api) {
    const {
      canvas,
      drawVerticalLine,
      drawHorizontalLine,
      setLine
    } = api;

    setLine(1, '#1e2e4d');

    this.drawVerticalLines(canvas, drawVerticalLine);
    this.drawHorizontalLines(canvas, drawHorizontalLine);
  }

  render() {
    return (
      <Canvas
        width={this.props.width}
        height={this.props.height}
        draw={this.draw}
      />
    );
  }
}
