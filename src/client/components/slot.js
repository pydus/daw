'use strict';
import React from 'react';
import Menu from './menu';
import EffectIcon from './effect-icon';

export default class Slot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {menu: false};
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  add(effect) {
    const index = this.props.index;
    this.props.onAdd(effect, index);
  }

  toggleMenu() {
    this.setState((prevState) => ({
      menu: !prevState.menu
    }));
  }

  handleClick() {
    if (this.props.effect) {
      this.props.onOpen(this.props.index);
    } else {
      this.toggleMenu();
    }
  }

  handleMouseLeave() {
    this.setState({menu: false});
  }

  onSelect(effect) {
    this.setState({menu: false});
    this.add(effect);
  }

  render() {
    return (
      <div onMouseLeave={this.handleMouseLeave}>
        <div onClick={this.handleClick} className="slot">
          {this.props.effect && <EffectIcon type={this.props.effect.type}/>}
        </div>
        {this.state.menu && <Menu onSelect={this.onSelect}/>}
      </div>
    );
  }
};
