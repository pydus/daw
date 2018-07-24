'use strict';
import React from 'react';
import {connect} from 'react-redux';
import {setPosition, savePosition, cut} from '../actions';
import PlayButton from './play-button';

export default connect((state) => ({
  song: state.song
}))(class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {rect: null, position: 0};
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('keydown', this.onKeyDown);
  }

  onKeyDown(e) {
    if (e.key === 'Delete') {
      this.props.dispatch(cut(this.props.song.position));
    }
  }

  onMouseDown(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = this.props.song.beats * (e.clientX - rect.left) / rect.width;
    this.setState({rect: rect, position});
    this.props.dispatch(setPosition(position));
    this.props.dispatch(savePosition(position));
  }

  onMouseMove(e) {
    if (this.state.rect) {
      const position = this.props.song.beats *
        (e.clientX - this.state.rect.left) / this.state.rect.width;
      this.setState({position});
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
      <header>
        <div className="main">
          <div className="right">
            <div className="button">RENDER</div>
          </div>
          <div className="center">
            <PlayButton controlKey=" "/>
          </div>
        </div>
        <div className="song-position">
          <div className="bar" onMouseDown={this.onMouseDown}>
            <div className="position" style={{width}}></div>
          </div>
        </div>
      </header>
    );
  }
});
