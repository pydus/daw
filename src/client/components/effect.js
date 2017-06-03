'use strict';
import React from 'react';
import Compressor from './compressor';
import {connect} from 'react-redux';
import {editCompressor} from '../actions';

export default connect(() => ({

}))(class Effect extends React.Component {
  constructor(props) {
    super(props);
    this.eq = this.eq.bind(this);
    this.edit = this.edit.bind(this);
  }

  edit(settings) {
    const id = this.props.id;
    const index = this.props.index;

    switch (this.props.effect.type) {
      case 'EQ':
        break;
      case 'COMPRESSOR':
        this.props.dispatch(editCompressor(id, index, settings));
        break;
      default:
        return false;
    }
  }

  eq() {
    return (
      <div>
        <div className="content">EQ</div>
      </div>
    );
  }

  render() {
    switch (this.props.effect.type) {
      case 'COMPRESSOR':
        return <Compressor effect={this.props.effect} onEdit={this.edit}/>;
      case 'EQ':
        return this.eq();
      default:
        return <div></div>;
    }
  }
});
