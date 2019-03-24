import React, {Component} from 'react';
import ClickAndDrag from './click-and-drag';
import {setPosition, savePosition} from '../actions';

export default class SongPositionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {isSettingPosition: false};
    this.setSongPosition = this.setSongPosition.bind(this);
    this.setSongPositionByRatio = this.setSongPositionByRatio.bind(this);
  }

  setSongPosition(beat) {
    this.props.dispatch(setPosition(beat));
    this.props.dispatch(savePosition(beat));
  }

  setSongPositionByRatio(ratio) {
    const beat = this.props.song.beats * ratio;
    this.setSongPosition(beat);
  }

  render() {
    const width = this.props.song.position / this.props.song.beats * 100 + '%';

    return (
      <ClickAndDrag direction='x' onChange={this.setSongPositionByRatio}>
        <div className="bar" onMouseDown={this.onMouseDown}>
          <div className="position" style={{width}}></div>
        </div>
      </ClickAndDrag>
    );
  }
};
