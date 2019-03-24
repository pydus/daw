import React, {Component} from 'react';
import GlobalMouse from './global-mouse';
import withRect from './with-rect';
import {setPosition, savePosition} from '../actions';

class SongPositionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {isSettingPosition: false};
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  getMousePositionInSong(e) {
    const rect = this.props.getRect();
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
        <div className="bar" onMouseDown={this.onMouseDown}>
          <div className="position" style={{width}}></div>
          <GlobalMouse up={this.onMouseUp} move={this.onMouseMove}/>
        </div>
    );
  }
}

const SongPositionBarWithRect = withRect(SongPositionBar);

export default SongPositionBarWithRect;
