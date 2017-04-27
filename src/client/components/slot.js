'use strict';
import React from 'react';
import Menu from './menu';

export default class Slot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {menu: false};
    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  toggleMenu() {
    this.setState((prevState, props) => ({
      menu: !prevState.menu
    }));
  }

  handleMouseLeave() {
    this.setState({menu: false});
  }

  onSelect(effectName) {
    this.setState({menu: false});
  }

  render() {
    return (
      <div onMouseLeave={this.handleMouseLeave}>
        <div onClick={this.toggleMenu} className="slot"></div>
        {this.state.menu && <Menu onSelect={this.onSelect}/>}
      </div>
    );
  }
}
