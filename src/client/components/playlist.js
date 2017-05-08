'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { setPosition, savePosition } from '../actions';

export default connect((state) => ({
  song: state.song
}))(class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasDrawn: false, imageData: null};
    this.onClick = this.onClick.bind(this);
    this.segmentDuration = 1000;
    this.segmentWidth = 5;
    this.segmentPadding = 1;
    this.segmentScale = 1;
  }

  onClick(e) {
    const canvas = this.refs.canvas;
    const rect = canvas.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / canvas.width;
    const position = ratio * this.props.song.beats;
    this.props.dispatch(setPosition(position));
    this.props.dispatch(savePosition(position));
  }

  resize(width) {
    const canvas = this.refs.canvas;
    canvas.width = width;
    canvas.style.width = width + 'px';
  }

  getTotalDuration() {
    let totalDuration = 0;
    this.props.clips.forEach(clip => {
      totalDuration += clip.buffer ? clip.buffer.duration : 0;
    });
    return totalDuration;
  }

  resizeAsNeeded() {
    const secondsInSong = this.props.song.beats * 60 / this.props.song.tempo;
    const width = secondsInSong * this.segmentWidth * 1000 / this.segmentDuration;

    if (width > 0) {
      this.resize(width);
    }
  }

  setLine(width, color) {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
  }

  drawLine(fromX, fromY, toX, toY) {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  }

  drawSegment(n, value, offset) {
    const canvas = this.refs.canvas;
    const width = this.segmentWidth;
    const scale = this.segmentScale;
    this.setLine(width - this.segmentPadding, '#12e6ba');
    this.drawLine(
      width * n + offset, canvas.height / 2 - value * scale * canvas.height,
      width * n + offset, canvas.height / 2 + value * scale * canvas.height
    );
  }

  drawSegments(buffer, position, numberOfSegments) {
    const segmentSectionWidth = numberOfSegments * this.segmentWidth;
    const stereo = buffer.numberOfChannels === 2;
    const left = buffer.getChannelData(0);
    const right = stereo ? buffer.getChannelData(1) : null;
    const maxPointsPerSegment =
      (numberOfSegments > buffer.length) ?
      1 : Math.floor(buffer.length / numberOfSegments);
    const pointsPerSegment = 100;
    const step = Math.ceil(maxPointsPerSegment / pointsPerSegment);
    const canvas = this.refs.canvas;
    const offset = canvas.width * position / this.props.song.beats

    let sum = 0, s = 0;

    for (let i = 0, j = 0; i < buffer.length; i += step, j += step) {
      if (stereo) {
        sum += (Math.abs(left[i]) + Math.abs(right[i])) / 2;
      } else {
        sum += Math.abs(left[i]);
      }
      if (j >= maxPointsPerSegment) {
        const value = sum * step / maxPointsPerSegment;
        this.drawSegment(s, value, offset);
        s++;
        j = 0;
        sum = 0;
      }
    }
  }

  drawWaveform(buffer, position) {
    const numberOfSegments = Math.ceil(1000 * buffer.duration / this.segmentDuration);
    this.drawSegments(buffer, position, numberOfSegments);
  }

  drawWaveforms() {
    this.resizeAsNeeded();
    this.props.clips.forEach(clip => {
      if (clip.buffer) {
        this.drawWaveform(clip.buffer, clip.position);
      }
    });
  }

  drawPosition(beat) {
    const canvas = this.refs.canvas;
    this.setLine(2, '#465a7b');
    const x = Math.round(canvas.width * beat / this.props.song.beats);
    this.drawLine(x, 0, x, canvas.height);
  }

  componentWillReceiveProps(nextProps) {
    const canvas = this.refs.canvas;
    let newClips = nextProps.clips.length !== this.props.clips.length;

    if (!newClips) {
      for (let i = 0; i < nextProps.clips.length; i++) {
        // TODO check if any of the buffers have changed
        if (
          nextProps.clips[i].position !== this.props.clips[i].position ||
          nextProps.clips[i].buffer !== this.props.clips[i].buffer
        ) {
          newClips = true;
          break;
        }
      }
    }

    if (
      nextProps.song.beats !== this.props.song.beats ||
      !this.state.hasDrawn ||
      newClips
    ) {
      this.setState({willDrawWaveform: true});
    }

    if (
      nextProps.isOpen && (
        nextProps.song.position !== this.props.song.position ||
        nextProps.isOpen && !this.props.isOpen ||
        !this.state.hasDrawn
      )
    ) {
      this.setState({willDrawPosition: true});
    }
  }

  componentDidUpdate() {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');

    if (this.props.clips.length < 1) {
      return false;
    }

    for (let i = 0; i < this.props.clips.length; i++) {
      if (this.props.clips[i].buffer) {
        break;
      } else if (i === this.props.clips.length - 1) {
        return false;
      }
    }

    if (this.state.willDrawWaveform || this.state.willDrawPosition) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (this.state.willDrawWaveform) {
        this.drawWaveforms();
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        this.setState({willDrawWaveform: false, imageData});
      } else if (this.state.imageData) {
        ctx.putImageData(this.state.imageData, 0, 0);
      }

      this.drawPosition(this.props.song.position);
      this.setState({willDrawPosition: false});
    }

    if (!this.state.hasDrawn) {
      this.setState({hasDrawn: true});
    }
  }

  render() {
    return (
      <div className="playlist">
        <div className="wrapper">
          <canvas ref="canvas" onClick={this.onClick} width="1024" height="720"/>
        </div>
      </div>
    );
  }
});
