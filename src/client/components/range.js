'use strict';
import React from 'react';

export default class Range extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: Number(props.default), lastCursor: 0};
    this.default = Number(props.default) || 0;
    // percentage to add to the value per pixel moved by the cursor
    this.step = props.step || 0.35;
    this.max = typeof props.max !== undefined ? Number(props.max) : 100;
    this.min = Number(props.min) || 0;
    this.reset = this.reset.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  reset() {
    this.setState({value: this.default});
    this.props.onChange(this.default);
  }

  onMouseMove(e) {
    const dy = this.state.lastCursor - e.clientY;
    this.setState((prevState) => {
      const interval = Math.abs(this.min) + Math.abs(this.max);
      const stepValue = this.step * interval / 100;
      let value = prevState.value + stepValue * dy;
      value = (value > this.max) ? this.max : value;
      value = (value < this.min) ? this.min : value;
      this.props.onChange(value);
      return {value, lastCursor: e.clientY};
    });
  }

  onMouseUp(e) {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown(e) {
    if (e.altKey) {
      this.reset();
    } else {
      this.setState({lastCursor: e.clientY});
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);
    }
  }

  render() {
    return (
      <div
        onMouseDown={this.onMouseDown}
        onDoubleClick={this.reset}
        style={{display: this.props.display || 'inline-block'}}
      >
        {this.props.children}
      </div>
    );
  }
};
