'use strict';
import React from 'react';
import Slot from './slot';
import { connect } from 'react-redux';
import { addEq, addCompressor, openEffect } from '../actions';

const N_SLOTS = 8;

export default connect((state) => ({

}))(class EffectSection extends React.Component {
  constructor(props) {
    super(props);
    this.add = this.add.bind(this);
    this.open = this.open.bind(this);
  }

  add(effect, index) {
    const id = this.props.id;
    switch (effect) {
      case 'EQ':
        this.props.dispatch(addEq(id, index));
        break;
      case 'COMPRESSOR':
        this.props.dispatch(addCompressor(id, index));
        break;
      default:
        return false;
    }
  }

  open(index) {
    this.props.dispatch(openEffect(this.props.id, index));
    this.props.onOpen();
  }

  render() {
    const effects = [];

    for (let i = 0; i < N_SLOTS; i++) {
      effects[i] = this.props.effects[i];
    }

    const slots = effects.map((el, i) => (
      <Slot key={i} index={i} effect={el} onAdd={this.add} onOpen={this.open}/>
    ));

    return (
      <div className="effects">
        {slots}
      </div>
    );
  }
});
