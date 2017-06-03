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
        <div className="content">EQ</div>
      </div>
    );
  }
};
