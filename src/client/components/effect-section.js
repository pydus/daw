'use strict';
import React from 'react';
import Slot from './slot';
import { connect } from 'react-redux';
import { addEq } from '../actions';

const N_SLOTS = 8;

export default connect((state) => ({

}))(class EffectSection extends React.Component {
  constructor(props) {
    super(props);
    this.add = this.add.bind(this);
  }

  add(effect, index) {
    const id = this.props.id;
    switch (effect) {
      case 'EQ':
        this.props.dispatch(addEq(id, index));
      case 'COMPRESSOR':
      default:
        return false;
    }
  }

  render() {
    const effects = [];

    for (let i = 0; i < N_SLOTS; i++) {
      effects[i] = this.props.effects[i];
    }

    const slots = effects.map((el, i) => <Slot key={i} index={i} effect={el} onAdd={this.add}/>);

    return (
      <div className="effects">
        {slots}
      </div>
    );
  }
});
