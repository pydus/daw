'use strict';
import React from 'react';
import Range from './range';
import {defaultCompressor} from '../settings';

export default class CompressorDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 0, percentage: 0};
    this.onChange = this.onChange.bind(this);
    this.max = 0;
    this.min = -60;
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
    return (
      <Range
        onChange={this.onChange}
        min={this.min}
        max={this.max}
        default={defaultCompressor.threshold}
      >
        <div className="display">
          <div
            className="indicator"
            style={{bottom: `${this.state.percentage}%`}}
          >
          </div>
        </div>
      </Range>
    );
  }
};
