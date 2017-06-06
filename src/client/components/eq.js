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
    this.onFrequencyChange = this.onFrequencyChange.bind(this);
    this.onGainChange = this.onGainChange.bind(this);
    this.minFrequency = 20;
    this.maxFrequency = 20000;
    this.maxValue = 20;
  }

  usesGain(filter) {
    return ['highshelf', 'lowshelf', 'peaking'].indexOf(filter.type) !== -1;
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

  onFrequencyChange(frequency, index) {
    this.edit({frequency, index});
  }

  onGainChange(gain, index) {
    if (this.usesGain(this.props.effect.filters[index])) {
      this.edit({gain, index});
    }
  }

  render() {
    const eq = this.props.effect;
    const interval = this.maxFrequency - this.minFrequency;
    const percentage = freq => (
      100 * Math.log10(freq / this.minFrequency) / Math.log10(this.maxFrequency / this.minFrequency)
    );
    const controls = eq.filters.map((filter, i) => (
      <Range
        key={i}
        onChange={value => this.onFrequencyChange(value, i)}
        max={this.maxFrequency}
        min={this.minFrequency}
        default={eq.initialFrequencies[i]}
        value={filter.frequency.value}
        direction="horizontal"
      >
        <Range
          onChange={value => this.onGainChange(value, i)}
          max={this.maxValue}
          min={-this.maxValue}
          default={0}
          value={filter.gain.value}
        >
          <div
            className="control"
            style={{
              left: `${percentage(filter.frequency.value)}%`,
              top: `${this.usesGain(filter) ? 50 - 50 * filter.gain.value / this.maxValue : 50}%`
            }}
          >
            <div className={`text ${filter.gain.value > 15 ? 'low' : ''} ${filter.frequency.value > 13000 ? 'left' : ''} ${filter.frequency.value < 27.5 ? 'right' : ''}`}>
              {`${filter.gain.value.toFixed(2)} dB`}
            </div>
            <div className={`text ${filter.gain.value < -15 ? 'high' : ''} ${filter.frequency.value > 13000 ? 'left' : ''} ${filter.frequency.value < 27.5 ? 'right' : ''}`}>
              {`${filter.frequency.value.toFixed(2)} Hz`}
            </div>
          </div>
        </Range>
      </Range>
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
