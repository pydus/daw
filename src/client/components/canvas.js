import React, {Component} from 'react';

export default class extends Component {
  constructor(props) {
    super(props);
    this.clearCanvas = this.clearCanvas.bind(this);
    this.setLine = this.setLine.bind(this);
    this.drawLine = this.drawLine.bind(this);
    this.fillRect = this.fillRect.bind(this);
    this.getRect = this.getRect.bind(this);
    this.drawVerticalLine = this.drawVerticalLine.bind(this);
    this.drawHorizontalLine = this.drawHorizontalLine.bind(this);
    this.getApi = this.getApi.bind(this);
    this.canvas = null;
  }

  componentDidMount() {
    this.draw();
  }

  getContext() {
    return this.canvas.getContext('2d');
  }

  clearCanvas() {
    const ctx = this.getContext();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setLine(width, color) {
    const ctx = this.getContext();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
  }

  drawLine(fromX, fromY, toX, toY) {
    const ctx = this.getContext();
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  }

  drawVerticalLine(x) {
    this.drawLine(x, 0, x, this.canvas.height);
  };

  drawHorizontalLine(y) {
    this.drawLine(0, y, this.canvas.width, y);
  }

  fillRect(x, y, width, height) {
    const ctx = this.getContext();
    ctx.fillRect(x, y, width, height);
  }

  getRect() {
    return this.canvas.getBoundingClientRect();
  }

  setCanvasWidth(width) {
    this.canvas.width = width;
  }

  getApi() {
    return {
      canvas: this.canvas,
      clearCanvas: this.clearCanvas,
      setLine: this.setLine,
      drawLine: this.drawLine,
      drawVerticalLine: this.drawVerticalLine,
      drawHorizontalLine: this.drawHorizontalLine,
      fillRect: this.fillRect,
      getRect: this.getRect
    };
  }

  draw() {
    if (typeof this.props.draw === 'function') {
      const api = this.getApi();
      this.props.draw(api);
    }
  }

  componentDidUpdate() {
    if (this.props.shouldUpdate) {
      this.draw();
    }
  }

  render() {
    return (
      <canvas
        width={this.props.width}
        height={this.props.height}
        ref={canvas => this.canvas = canvas}
      >
      </canvas>
    );
  }
};
