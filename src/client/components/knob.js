'use strict';
import React from 'react';
import Range from './range';
import UnitLabel from './unit-label';

export default class Knob extends React.Component {
  constructor(props) {
    super(props);
    const value = typeof props.value !== 'undefined' ? props.value : props.default;
    this.default = Number(props.default) || 0;
    this.max = Number(props.max) || 100;
    this.min = Number(props.min) || 0;
    this.onChange = this.onChange.bind(this);
  }

  getPercentage(value) {
    const val = Math.abs(this.min - value);
    const interval = Math.abs(this.max -this.min);
    const percentage = Math.round(100 * val / interval);
    return percentage;
  }

  onChange(value) {
    this.props.onChange(value);
  }

  render() {
    return(
      <Range
        onChange={this.onChange}
        max={this.max}
        min={this.min}
        default={this.default}
        value={this.props.value}
      >
        {(value, percentage) => (
          <div className={`knob progress-${this.getPercentage(value)}`}>
            <UnitLabel value={value} unit={this.props.unit}/>
            <div className="label">{this.props.label}</div>
          </div>
        )}
      </Range>
    );
  }
};
