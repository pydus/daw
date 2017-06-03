'use strict';
import React from 'react';
import Compressor from './compressor';
import Eq from './eq';
import {connect} from 'react-redux';
import {editEffect} from '../actions';

export default connect(() => ({

}))(class Effect extends React.Component {
  constructor(props) {
    super(props);
    this.edit = this.edit.bind(this);
  }

  edit(settings) {
    const id = this.props.id;
    const index = this.props.index;
    this.props.dispatch(editEffect(id, index, settings));
  }

  render() {
    switch (this.props.effect.type) {
      case 'COMPRESSOR':
        return <Compressor effect={this.props.effect} onEdit={this.edit}/>;
      case 'EQ':
        return <Eq effect={this.props.effect} onEdit={this.edit}/>;
      default:
        return <div></div>;
    }
  }
});
