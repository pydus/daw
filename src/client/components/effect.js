'use strict';
import React from 'react';
import Menu from './menu';
import Knob from './knob';
import Range from './range';
import Meter from './meter';
import CompressorDisplay from './compressor-display';
import { connect } from 'react-redux';
import { editCompressor } from '../actions';
import { defaultCompressor } from '../settings';

export default connect((state) => ({

}))(class Effect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {inputGain: 1, outputGain: 1};
    this.compressor = this.compressor.bind(this);
    this.eq = this.eq.bind(this);
    this.edit = this.edit.bind(this);
    this.onInputGainChange = this.onInputGainChange.bind(this);
    this.onOutputGainChange = this.onOutputGainChange.bind(this);
    this.onRatioChange = this.onRatioChange.bind(this);
    this.onKneeChange = this.onKneeChange.bind(this);
    this.onAttackChange = this.onAttackChange.bind(this);
    this.onReleaseChange = this.onReleaseChange.bind(this);
    this.onThresholdChange = this.onThresholdChange.bind(this);
  }

  edit(settings) {
    const id = this.props.id;
    const index = this.props.index;

    switch (this.props.effect.type) {
      case 'EQ':
        break;
      case 'COMPRESSOR':
        this.props.dispatch(editCompressor(id, index, settings));
        break;
      default:
        return false;
    }
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

  compressor() {
    return (
      <div>
        <Range
          display="block"
          onChange={this.onInputGainChange}
          min="0"
          max="2"
          default="1"
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
            <Knob label="Ratio" default={defaultCompressor.ratio} min="1" max="20" onChange={this.onRatioChange}/>
            <Knob label="Knee" default={defaultCompressor.knee} max="40" onChange={this.onKneeChange}/>
            <Knob label="Attack" default={defaultCompressor.attack} max="1000" onChange={this.onAttackChange}/>
            <Knob label="Release" default={defaultCompressor.release} max="1000" onChange={this.onReleaseChange}/>
          </div>
          <div className="display-section">
            <Meter analyser={this.props.effect.analyserIn}/>
            <CompressorDisplay onChange={this.onThresholdChange}/>
            <Meter analyser={this.props.effect.analyserOut}/>
          </div>
        </div>
      </div>
    );
  }

  eq() {
    return (
      <div>
        <div className="content">EQ</div>
      </div>
    );
  }

  render() {
    switch (this.props.effect.type) {
      case 'COMPRESSOR':
        return this.compressor();
      case 'EQ':
        return this.eq();
      default:
        return <div></div>;
    }
  }
});
