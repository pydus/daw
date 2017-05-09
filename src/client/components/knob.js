'use strict';
import React from 'react';

export default class Knob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: Number(this.props.value), lastCursor: 0};
    // percentage to add to the value per pixel moved by the cursor
    this.step = props.step || 0.35;
    this.max = Number(props.max) || 100;
    this.min = 0;
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  onMouseMove(e) {
    const dy = this.state.lastCursor - e.clientY;
    this.setState((prevState) => {
      const interval = Math.abs(this.min) + Math.abs(this.max);
      const stepValue = this.step * interval / 100;
      let value = prevState.value + stepValue * dy;
      value = (value > this.max) ? this.max : value;
      value = (value < this.min) ? this.min : value;
      return {value, lastCursor: e.clientY};
    });
  }

  onMouseUp(e) {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown(e) {
    this.setState({lastCursor: e.clientY});
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  render() {
    const percentage = Math.round(100 * this.state.value / this.max);

    return (
      <div
        className={`knob progress-${percentage}`}
        onMouseDown={this.onMouseDown}
      >
        <div className="label">{this.props.label}</div>
      </div>
    );
  }
};
