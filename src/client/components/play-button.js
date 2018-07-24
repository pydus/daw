import React from 'react';
import {connect} from 'react-redux';
import {setPlaying} from '../actions';

export default connect((state) => ({
  song: state.song
}))(class PlayButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isHoldingKey: false};
    this.togglePlay = this.togglePlay.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  componentDidMount() {
    if (this.props.controlKey) {
      window.addEventListener('keydown', this.onKeyDown);
      window.addEventListener('keyup', this.onKeyUp);
    }
  }

  onKeyDown(e) {
    if (e.key === this.props.controlKey && !this.state.isHoldingKey) {
      e.preventDefault();
      this.togglePlay();
      this.setState({isHoldingKey: true});
    }
  }

  onKeyUp(e) {
    if (e.key === this.props.controlKey) {
      this.setState({isHoldingKey: false});
    }
  }

  togglePlay() {
    this.props.dispatch(setPlaying(!this.props.song.isPlaying));
  }

  render() {
    return (
      <svg viewBox="0 0 200 200" className="play" onClick={this.togglePlay}>
        {!this.props.song.isPlaying && <polygon points="0,0 0,200 173.2,100" fill="#fff"></polygon>}
        {this.props.song.isPlaying && <polygon points="0,0 0,200 200,200 200,0" fill="#fff"></polygon>}
      </svg>
    );
  }
});
