'use strict';
import React from 'react';
import {connect} from 'react-redux';
import {cut} from '../actions';
import PlayButton from './play-button';
import SongPositionBar from './song-position-bar';

export default connect((state) => ({
  song: state.song
}))(class Header extends React.Component {
  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  onKeyDown(e) {
    if (e.key === 'Delete') {
      this.props.dispatch(cut(this.props.song.position));
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  render() {
    const {tempo} = this.props.song;

    return (
      <header>
        <div className="main">
          <div className="left">
            <div className="tempo">{tempo}</div>
          </div>
          <div className="right">
            <div className="button">RENDER</div>
          </div>
          <div className="center">
            <PlayButton controlKey=" "/>
          </div>
        </div>
        <div className="song-position">
          <SongPositionBar song={this.props.song} dispatch={this.props.dispatch}/>
        </div>
      </header>
    );
  }
});
