'use strict';
import React from 'react';
import Menu from './menu';
import effects from '../effects';

export default class Slot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {menu: false};
    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  add(effect) {
    const index = this.props.index;
    this.props.onAdd(effect, index);
  }

  toggleMenu() {
    this.setState((prevState, props) => ({
      menu: !prevState.menu
    }));
  }

  handleMouseLeave() {
    this.setState({menu: false});
  }

  onSelect(effect) {
    this.setState({menu: false});
    this.add(effect);
  }

  render() {
    const slotStyle = this.props.effect ? {background: 'red'} : {};
    return (
      <div onMouseLeave={this.handleMouseLeave}>
        <div onClick={this.toggleMenu} className="slot" style={slotStyle}></div>
        {this.state.menu && <Menu onSelect={this.onSelect}/>}
      </div>
    );
  }
}
