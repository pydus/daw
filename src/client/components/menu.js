'use strict';
import React from 'react';
import effects from '../effects';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if (e.target.nodeName === 'LI') {
      if (typeof this.props.onSelect === 'function') {
        this.props.onSelect(e.target.id);
      }
    }
  }

  render() {
    const items = Object.keys(effects).map(key => (
      <li key={key} id={key}>{effects[key]}</li>
    ));

    return (
      <div className="menu">
        <ul onClick={this.handleClick}>
          {items}
        </ul>
      </div>
    );
  }
}
