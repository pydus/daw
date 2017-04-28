'use strict';
import React from 'react';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if (e.target.nodeName === 'LI') {
      if (typeof this.props.onSelect === 'function') {
        this.props.onSelect(e.target.innerHTML);
      }
    }
  }

  render() {
    const items = [
      'Equalizer',
      'Compressor',
      'Multiband Compressor',
      'Reverb'
    ].map(el => <li key={el}>{el}</li>);

    return (
      <div className="menu">
        <ul onClick={this.handleClick}>
          {items}
        </ul>
      </div>
    );
  }
}
