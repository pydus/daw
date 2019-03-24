import React, {Component} from 'react';
import GlobalMouse from './global-mouse';
import {setPosition, savePosition} from '../actions';

export default class SongPositionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {rect: null};
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  onMouseDown(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = this.props.song.beats * (e.clientX - rect.left) / rect.width;
    this.setState({rect: rect});
    this.props.dispatch(setPosition(position));
    this.props.dispatch(savePosition(position));
  }

  onMouseMove(e) {
    if (this.state.rect) {
      const position = this.props.song.beats *
        (e.clientX - this.state.rect.left) / this.state.rect.width;
      this.props.dispatch(setPosition(position));
      this.props.dispatch(savePosition(position));
    }
  }

  onMouseUp() {
    this.setState({rect: null});
  }

  render() {
    const width = this.props.song.position / this.props.song.beats * 100 + '%';

    return (
      <GlobalMouse up={this.onMouseUp} move={this.onMouseMove}>
        <div className="bar" onMouseDown={this.onMouseDown}>
          <div className="position" style={{width}}></div>
        </div>
      </GlobalMouse>
    );
  }
};
