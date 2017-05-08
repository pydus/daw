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
        <div className="panel">
          <div>S</div>
          <div>M</div>
        </div>
      </div>
    );
  }
};
