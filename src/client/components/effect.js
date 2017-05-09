'use strict';
import React from 'react';
import Menu from './menu';
import Knob from './knob';
import CompressorDisplay from './compressor-display';

export default class Effect extends React.Component {
  constructor(props) {
    super(props);
    this.compressor = this.compressor.bind(this);
    this.eq = this.eq.bind(this);
  }

  compressor() {
    return (
      <div>
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
    return <div>EQ</div>;
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
