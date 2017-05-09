'use strict';
import React from 'react';
import Menu from './menu';

export default class Effect extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="content">
          <div className="left">
            <div className="knob progress-50">
              <div className="label">Ratio</div>
            </div>
            <div className="knob progress-0">
              <div className="label">Knee</div>
            </div>
            <div className="knob progress-8">
              <div className="label">Attack</div>
            </div>
            <div className="knob progress-60">
              <div className="label">Release</div>
            </div>
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
};
