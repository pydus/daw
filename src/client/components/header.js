'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { setPosition } from '../actions';

export default connect((state) => ({
  song: state.song
}))(class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {rect: null, positionRatio: 0};
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove)
  }

  onMouseDown(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    this.setState({
      rect: rect,
      positionRatio: (e.clientX - rect.left) / rect.width
    });
  }

  onMouseMove(e) {
    if (this.state.rect) {
      this.setState(
        {positionRatio: (e.clientX - this.state.rect.left) / this.state.rect.width}
      );
    }
  }

  onMouseUp(e) {
    this.setState({rect: null});
    const position = this.props.song.beats * this.state.positionRatio;
    this.props.dispatch(setPosition(position));
  }

  render() {
    let width;

    if (this.state.rect) {
      width = this.state.positionRatio * 100 + '%';
    } else {
      width = this.props.song.position / this.props.song.beats * 100 + '%';
    }

    return (
      <header>
        <div className="song-position">
          <div className="bar" onMouseDown={this.onMouseDown}>
            <div className="position" style={{width}}></div>
          </div>
        </div>
      </header>
    );
  }
});
