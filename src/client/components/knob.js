'use strict';
import React from 'react';
import Range from './range';

export default class Knob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: Number(props.default), percentage: 0};
    this.default = Number(props.default) || 0;
    this.max = Number(props.max) || 100;
    this.min = Number(props.min) || 0;
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.calculatePercentage(this.state.value);
  }

  calculatePercentage(value) {
    const val = Math.abs(this.min - value);
    const interval = Math.abs(this.max -this.min);
    const percentage = Math.round(100 * val / interval);
    this.setState({percentage});
  }

  onChange(value) {
    this.props.onChange(value);
    this.setState({value});
    this.calculatePercentage(value);
  }

  render() {

    return(
      <Range
        onChange={this.onChange}
        max={this.max}
        min={this.min}
        default={this.default}
      >
        <div className={`knob progress-${this.state.percentage}`}>
          <div className="label">{this.props.label}</div>
        </div>
      </Range>
    );
  }
};
