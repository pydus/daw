'use strict';
import React from 'react';
import Knob from './knob';
import Range from './range';
import Meter from './meter';
import CompressorDisplay from './compressor-display';
import {defaultCompressor} from '../settings';

export default class Compressor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputGain: props.effect.inputGain.gain.value,
      outputGain: props.effect.outputGain.gain.value
    };
    this.onInputGainChange = this.onInputGainChange.bind(this);
    this.onOutputGainChange = this.onOutputGainChange.bind(this);
    this.onRatioChange = this.onRatioChange.bind(this);
    this.onKneeChange = this.onKneeChange.bind(this);
    this.onAttackChange = this.onAttackChange.bind(this);
    this.onReleaseChange = this.onReleaseChange.bind(this);
    this.onThresholdChange = this.onThresholdChange.bind(this);
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

  onRatioChange(value) {
    this.edit({ratio: value});
  }

  onKneeChange(value) {
    this.edit({knee: value});
  }

  onAttackChange(value) {
    this.edit({attack: value / 1000});
  }

  onReleaseChange(value) {
    this.edit({release: value / 1000});
  }

  onThresholdChange(value) {
    this.edit({threshold: value});
  }

  render() {
    const compressor = this.props.effect.compressor;
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
          <div className="left">
            <Knob
              label="Ratio"
              unit=": 1"
              default={defaultCompressor.ratio}
              value={compressor.ratio.value}
              min="1"
              max="20"
              onChange={this.onRatioChange}
            />
            <Knob
              label="Knee"
              unit=""
              default={defaultCompressor.knee}
              value={compressor.knee.value}
              max="40"
              onChange={this.onKneeChange}
            />
            <Knob
              label="Attack"
              unit="ms"
              default={defaultCompressor.attack}
              value={compressor.attack.value * 1000}
              max="1000"
              onChange={this.onAttackChange}
            />
            <Knob
              label="Release"
              unit="ms"
              default={defaultCompressor.release}
              value={compressor.release.value * 1000}
              max="1000"
              onChange={this.onReleaseChange}
            />
          </div>
          <div className="display-section">
            <CompressorDisplay effect={this.props.effect} onChange={this.onThresholdChange}/>
            <Meter analyser={this.props.effect.analyserOut} width={12} height={181} type="line"/>
            <Meter analyser={this.props.effect.analyserIn} width={12} height={181} type="line"/>
          </div>
        </div>
      </div>
    );
  }
};
