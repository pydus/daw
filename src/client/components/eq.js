'use strict';
import React from 'react';
import Range from './range';

export default class Eq extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputGain: props.effect.inputGain.gain.value,
      outputGain: props.effect.outputGain.gain.value
    };
    this.onInputGainChange = this.onInputGainChange.bind(this);
    this.onOutputGainChange = this.onOutputGainChange.bind(this);
    this.minFreq = 20;
    this.maxFreq = 20000;
    this.maxValue = 20;
  }

  edit(settings) {
    this.props.onEdit(settings);
  }

  onInputGainChange(value) {
    this.setState({inputGain: value});
    this.edit({inputGain: value});
  }

  onOutputGainChange(value) {
    this.setState({outputGain: value});
    this.edit({outputGain: value});
  }

  render() {
    const eq = this.props.effect;
    const interval = this.maxFreq - this.minFreq;
    const percentage = freq => (
      100 * Math.log10(freq / this.minFreq) / Math.log10(this.maxFreq / this.minFreq)
    );
    const controls = eq.filters.map((filter, i) => (
      <div
        key={i}
        className="control"
        style={{
          left: `${percentage(filter.frequency.value)}%`,
          top: `${50 - 50 * filter.gain.value / this.maxValue}%`
        }}
      ></div>
    ));
    return (
      <div>
        <Range
          display="block"
          onChange={this.onInputGainChange}
          min="0"
          max="2"
          default="1"
          value={this.state.inputGain}
        >
          <div className="volume-wrapper">
            <div
              className="volume"
              style={{height: `${this.state.inputGain / 2 * 100}%`}}
            ></div>
          </div>
        </Range>
        <Range
          display="block"
          onChange={this.onOutputGainChange}
          min="0"
          max="2"
          default="1"
          value={this.state.outputGain}
        >
          <div className="volume-wrapper right">
            <div
              className="volume"
              style={{height: `${this.state.outputGain / 2 * 100}%`}}
            ></div>
          </div>
        </Range>
        <div className="content">
          <div className="eq-display">
            {controls}
          </div>
        </div>
      </div>
    );
  }
};
