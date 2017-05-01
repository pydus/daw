'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { setPosition } from '../actions';

export default connect((state) => ({
  song: state.song
}))(class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {rect: null, position: 0};
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
    const position = this.props.song.beats * (e.clientX - rect.left) / rect.width;
    this.setState({rect: rect, position});
    this.props.dispatch(setPosition(position));
  }

  onMouseMove(e) {
    if (this.state.rect) {
      const position = this.props.song.beats *
        (e.clientX - this.state.rect.left) / this.state.rect.width;
      this.setState({position});
      this.props.dispatch(setPosition(position));
    }
  }

  onMouseUp(e) {
    this.setState({rect: null});
    this.props.dispatch(setPosition(this.state.position));
  }

  render() {
    const width = this.props.song.position / this.props.song.beats * 100 + '%';

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
