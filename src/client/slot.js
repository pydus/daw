'use strict';
import React from 'react';
import Menu from './menu';

export default class Slot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {menu: false};
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState((prevState, props) => ({
      menu: !prevState.menu
    }));
  }

  render() {
    return (
      <div>
        <div onClick={this.toggleMenu} className="slot"></div>
        {this.state.menu && <Menu/>}
      </div>
    );
  }
}
