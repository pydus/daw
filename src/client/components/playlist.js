'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { setPosition, savePosition, moveClip } from '../actions';
import { SECOND_COLOR, LIGHT_GRAY } from '../settings';

export default connect((state) => ({
  song: state.song
}))(class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasDrawn: false,
      clickPosition: -1,
      clickedClip: null
    };
    this.onMouseDown = this.onMouseDown.bind(this);
    this.getNewClickedClipPosition = this.getNewClickedClipPosition.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.segmentDuration = 1000;
    this.segmentWidth = 5;
    this.segmentPadding = 1;
    this.segmentScale = 1;
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.onMouseUp);
  }

  getMouseSongPosition(e) {
    const canvas = this.refs.canvas;
    const rect = canvas.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / canvas.width;
    const position = ratio * this.props.song.beats;
    return position;
  }

  getNewClickedClipPosition(mousePosition) {
    const clipOffset = this.state.clickPosition - this.state.clickedClip.position;
    const newPosition = mousePosition - clipOffset;
    return newPosition;
  }

  onMouseMove(e) {
    const position = this.getMouseSongPosition(e);
    const newPosition = this.getNewClickedClipPosition(position);
    const index = this.props.clips.indexOf(this.state.clickedClip);
    this.props.clips[index].offset = newPosition - this.props.clips[index].position;
    this.drawWaveforms();
    this.drawPosition();
  }

  onMouseDown(e) {
    const clickPosition = this.getMouseSongPosition(e);
    const clips = this.props.clips;
    const bps = this.props.song.tempo / 60;
    let clickedClip = null;
    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      if (!clip.buffer) continue;
      const beatsInClip = clip.buffer.duration * bps;
      const highestBeat = clip.position + beatsInClip;
      if (clickPosition >= clip.position && clickPosition <= highestBeat) {
        clickedClip = clip;
        break;
      }
    }
    if (clickedClip) {
      window.addEventListener('mousemove', this.onMouseMove);
    }
    this.setState({clickPosition, clickedClip});
  }

  onMouseUp(e) {
    if (this.state.clickPosition === -1) return;
    const position = this.getMouseSongPosition(e);
    if (this.state.clickPosition === position) {
      this.props.dispatch(setPosition(position));
      this.props.dispatch(savePosition(position));
    } else if (this.state.clickedClip) {
      const id = this.props.id;
      const index = this.props.clips.indexOf(this.state.clickedClip);
      const newPosition = this.getNewClickedClipPosition(position);
      this.props.dispatch(moveClip(id, index, newPosition));
    }
    this.setState({clickPosition: -1, clickedClip: -1});
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  resize(width) {
    const canvas = this.refs.canvas;
    const positionCanvas = this.refs.positionCanvas;
    canvas.width = width;
    canvas.style.width = width + 'px';
    positionCanvas.width = width;
    positionCanvas.style.width = width + 'px';
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
    const segmentDurationInSeconds = this.segmentDuration / 1000;
    const totalNumberOfSegments = secondsInSong / segmentDurationInSeconds;
    const canvasWidth = Math.round(this.segmentWidth * totalNumberOfSegments);
    if (canvasWidth > 0) {
      this.resize(canvasWidth);
    }
  }

  setLine(width, color) {
    const canvas = this.refs.canvas;
    const positionCanvas = this.refs.positionCanvas;
    const ctx = canvas.getContext('2d');
    const posCtx = positionCanvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    posCtx.strokeStyle = color;
    posCtx.lineWidth = width;
  }

  drawLine(fromX, fromY, toX, toY, context) {
    const canvas = this.refs.canvas;
    const ctx = context || canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  }

  drawSegment(n, value, offset) {
    const canvas = this.refs.canvas;
    const width = this.segmentWidth;
    const scale = this.segmentScale;
    this.setLine(width - this.segmentPadding, SECOND_COLOR);
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
        this.drawWaveform(clip.buffer, clip.position + (clip.offset || 0));
      }
    });
  }

  drawPosition() {
    const positionCanvas = this.refs.positionCanvas;
    const posCtx = positionCanvas.getContext('2d');
    const beat = this.props.song.position;
    this.setLine(2, LIGHT_GRAY);
    const x = Math.round(positionCanvas.width * beat / this.props.song.beats);
    this.drawLine(x, 0, x, positionCanvas.height, posCtx);
  }

  componentWillReceiveProps(nextProps) {
    const canvas = this.refs.canvas;
    let newClips = nextProps.clips.length !== this.props.clips.length;

    if (!newClips) {
      for (let i = 0; i < nextProps.clips.length; i++) {
        // TODO check if any of the buffers have changed
        if (
          nextProps.clips[i].position !== this.props.clips[i].position ||
          nextProps.clips[i].buffer !== this.props.clips[i].buffer ||
          this.props.clips[i].offset
        ) {
          this.props.clips[i].offset = 0;
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
    const positionCanvas = this.refs.positionCanvas;
    const ctx = canvas.getContext('2d');
    const posCtx = positionCanvas.getContext('2d');

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

    if (this.state.willDrawWaveform) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawWaveforms();
      this.setState({willDrawWaveform: false});
    }

    if (this.state.willDrawPosition || this.state.willDrawWaveform) {
      posCtx.clearRect(0, 0, positionCanvas.width, positionCanvas.height);
      this.drawPosition();
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
          <canvas
            ref="canvas"
            width="1024"
            height="720"
          />
          <canvas
            ref="positionCanvas"
            onMouseDown={this.onMouseDown}
            width="1024"
            height="720"
          />
        </div>
      </div>
    );
  }
});
