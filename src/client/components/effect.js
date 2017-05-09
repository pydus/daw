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
        <div className="knob progress-50">
          <div className="label">Release</div>
        </div>
        <div className="panel">
          <div>S</div>
          <div>M</div>
        </div>
      </div>
    );
  }
};
