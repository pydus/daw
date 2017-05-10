'use strict';
import React from 'react';
import Menu from './menu';
import Knob from './knob';
import Range from './range';
import CompressorDisplay from './compressor-display';

export default class Effect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {inputGain: 1, outputGain: 1};
    this.compressor = this.compressor.bind(this);
    this.eq = this.eq.bind(this);
    this.onInputGainChange = this.onInputGainChange.bind(this);
    this.onOutputGainChange = this.onOutputGainChange.bind(this);
  }

  onInputGainChange(value) {
    this.setState({inputGain: value});
  }

  onOutputGainChange(value) {
    this.setState({outputGain: value});
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
            <Knob label="Ratio" default="0" max="20"/>
            <Knob label="Knee" default="0"/>
            <Knob label="Attack" default="8" max="1000"/>
            <Knob label="Release" default="200" max="2000"/>
          </div>
          <div className="display-section">
            <div className="meter"></div>
            <CompressorDisplay/>
            <div className="meter"></div>
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
};
