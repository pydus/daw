'use strict';
import React from 'react';
import Knob from './knob';
import Range from './range';
import Meter from './meter';
import CompressorDisplay from './compressor-display';
import {defaultCompressor} from '../settings';

export default class Eq extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputGain: props.effect.inputGain.gain.value,
      outputGain: props.effect.outputGain.gain.value
    };
    this.onInputGainChange = this.onInputGainChange.bind(this);
    this.onOutputGainChange = this.onOutputGainChange.bind(this);
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
    const eq = this.props.effect.eq;
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
          </div>
        </div>
      </div>
    );
  }
};
