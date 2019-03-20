import React from 'react';

export default Component => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.clearCanvas = this.clearCanvas.bind(this);
      this.setLine = this.setLine.bind(this);
      this.drawLine = this.drawLine.bind(this);
      this.fillRect = this.fillRect.bind(this);
    }

    clearCanvas(canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    setLine(width, color, ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
    }

    drawLine(fromX, fromY, toX, toY, ctx) {
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();
    }

    fillRect(x, y, width, height, ctx) {
      ctx.fillRect(x, y, width, height);
    }

    render() {
      return (
        <Component
          clearCanvas={this.clearCanvas}
          setLine={this.setLine}
          drawLine={this.drawLine}
          fillRect={this.fillRect}
          {...this.props}
        />
      );
    }
  }
};
