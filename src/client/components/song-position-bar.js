import React, {Component} from 'react';
import GlobalMouse from './global-mouse';
import {setPosition, savePosition} from '../actions';

export default class SongPositionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {isSettingPosition: false};
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.bar = null;
  }

  getRect() {
    return this.bar.getBoundingClientRect();
  }

  getMousePositionInSong(e) {
    const rect = this.getRect();
    return this.props.song.beats *
      (e.clientX - rect.left) / rect.width;
  }

  onMouseDown(e) {
    const position = this.getMousePositionInSong(e);
    this.setState({isSettingPosition: true});
    this.props.dispatch(setPosition(position));
    this.props.dispatch(savePosition(position));
  }

  onMouseMove(e) {
    if (this.state.isSettingPosition) {
      const position = this.getMousePositionInSong(e);
      this.props.dispatch(setPosition(position));
      this.props.dispatch(savePosition(position));
    }
  }

  onMouseUp() {
    this.setState({isSettingPosition: false});
  }

  render() {
    const width = this.props.song.position / this.props.song.beats * 100 + '%';

    return (
      <GlobalMouse up={this.onMouseUp} move={this.onMouseMove}>
        <div className="bar" ref={bar => this.bar = bar} onMouseDown={this.onMouseDown}>
          <div className="position" style={{width}}></div>
        </div>
      </GlobalMouse>
    );
  }
};
