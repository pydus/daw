import React, {Component} from 'react';

export default class Grid extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.draw();
  }

  getLogFrequencyRatio(frequency) {
    return (
      Math.log10(frequency / this.props.minFrequency) /
      Math.log10(this.props.maxFrequency / this.props.minFrequency)
    );
  }

  draw() {
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#1e2e4d';
    ctx.beginPath();

    for (let i = 10; i < 10000; i *= 10) {
      for (let j = 1; j < 10; j++) {
        const frequency = i * (j + 1);
        const ratio = this.getLogFrequencyRatio(frequency);
        const x = canvas.width * ratio;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
    }

    const drawHorizontalLine = y => {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    };

    for (let i = 0; i < 7; i++) {
      drawHorizontalLine((i + 1) * canvas.height / 8);
    }

    ctx.stroke();
  }

  render() {
    return <canvas width={this.props.width} height={this.props.height} ref={canvas => this.canvas = canvas}/>;
  }
}
