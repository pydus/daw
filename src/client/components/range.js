'use strict';
import React from 'react';

export default class Range extends React.Component {
  constructor(props) {
    super(props);
    const value = typeof props.value !== 'undefined' ? props.value : props.default;
    this.state = {value: Number(value), lastCursor: 0};
    this.default = Number(props.default) || 0;
    // percentage by which to increase the value per pixel moved by the cursor
    this.step = props.step || 0.35;
    this.max = typeof props.max !== undefined ? Number(props.max) : 100;
    this.min = Number(props.min) || 0;
    this.direction = props.direction || 'vertical';
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
    const horizontal = this.direction === 'horizontal';
    const cursor = horizontal ? e.clientX : e.clientY;
    const delta = (horizontal ? -1 : 1) * (this.state.lastCursor - cursor);
    this.setState((prevState) => {
      const interval = this.max - this.min;
      const stepValue = this.step * (horizontal ? prevState.value / 40 : interval / 100);
      let value = prevState.value + stepValue * delta;
      value = (value > this.max) ? this.max : value;
      value = (value < this.min) ? this.min : value;
      this.props.onChange(value);
      return {value, lastCursor: cursor};
    });
  }

  onMouseUp() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown(e) {
    if (e.altKey) {
      this.reset();
    } else {
      const cursor = this.direction === 'horizontal' ? e.clientX : e.clientY;
      this.setState({lastCursor: cursor});
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
