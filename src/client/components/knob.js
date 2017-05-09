'use strict';
import React from 'react';
import Range from './range';

export default class Knob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: Number(props.default)};
    this.default = Number(props.default) || 0;
    this.max = Number(props.max) || 100;
    this.min = Number(props.min) || 0;
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    this.setState({value});
  }

  render() {
    const value = Math.abs(this.min - this.state.value);
    const interval = Math.abs(this.max -this.min);
    const percentage = Math.round(100 * value / interval);

    return(
      <Range
        onChange={this.onChange}
        max={this.max}
        min={this.min}
        default={this.default}
      >
        <div className={`knob progress-${percentage}`}>
          <div className="label">{this.props.label}</div>
        </div>
      </Range>
    );
  }
};
