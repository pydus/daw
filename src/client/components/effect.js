'use strict';
import React from 'react';
import Menu from './menu';

const Knob = (props) => {
  return (
    <div className={`knob progress-${props.value}`}>
      <div className="label">{props.label}</div>
    </div>
  );
};

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
            <Knob label="Ratio" value="50"/>
            <Knob label="Knee" value="0"/>
            <Knob label="Attack" value="8"/>
            <Knob label="Release" value="60"/>
          </div>
          <div className="display-section">
            <div className="meter"></div>
            <div className="display"></div>
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
