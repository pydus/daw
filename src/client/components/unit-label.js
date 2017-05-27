'use strict';
import React from 'react';

export default class UnitLabel extends React.Component {
  constructor(props) {
    super(props);
    this.defaultDirection = 'right';
  }

  render() {
    const direction = this.props.direction || this.defaultDirection;
    return (
      <div className={`unit-label ${direction}`}>
        {this.props.value.toFixed(2)} {this.props.unit}
      </div>
    );
  }
};
