'use strict';
import React from 'react';
import {setPosition, savePosition, moveClip} from '../actions';
import {connect} from 'react-redux';
import {
  SECOND_COLOR,
  LIGHT_GRAY,
  SEGMENT_DURATION_STEP_PERCENT,
  MIN_SEGMENT_DURATION,
  MAX_SEGMENT_DURATION
} from '../settings';

export default connect((state) => ({
  song: state.song
}))(class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasDrawn: false,
      clickPosition: -1,
      clickedClip: null,
      nullBuffers: []
    };
    this.onMouseDown = this.onMouseDown.bind(this);
    this.getNewClickedClipPosition = this.getNewClickedClipPosition.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.segmentDuration = 500;
    this.segmentWidth = 1.5;
    this.segmentPadding = 0;
    this.segmentScale = 0.3;
    this.waveforms = [];
    this.pointsPerSecond = 10;
    this.maxNumberOfPoints = 10000;
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.onMouseUp);
  }

  zoom(mousePosition, magnitude) {
    const lastSegmentDuration = this.segmentDuration;
    this.segmentDuration *= 1 + magnitude * SEGMENT_DURATION_STEP_PERCENT / 100;

    if (this.segmentDuration < MIN_SEGMENT_DURATION) {
      this.segmentDuration = MIN_SEGMENT_DURATION;
    } else if (this.segmentDuration > MAX_SEGMENT_DURATION) {
      this.segmentDuration = MAX_SEGMENT_DURATION;
    }

    if (this.segmentDuration !== lastSegmentDuration) {
      this.drawWaveforms();
      this.drawPosition();
    }
  }

  onWheel(e) {
    e.preventDefault();
    const wrapper = this.canvas.parentNode;
    const sign = Math.abs(e.deltaY) / (e.deltaY || 1);
    const mousePosition = this.getMouseSongPosition(e) / this.props.song.beats;
    this.zoom(mousePosition, sign);
    const newMousePosition = this.getMouseSongPosition(e) / this.props.song.beats;
    const dx = mousePosition - newMousePosition;
    wrapper.scrollLeft = wrapper.scrollLeft + dx * wrapper.scrollWidth;
  }

  getMouseSongPosition(e) {
    const canvas = this.canvas;
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
    const index = this.props.module.clips.indexOf(this.state.clickedClip);
    this.props.module.clips[index].offset = newPosition - this.props.module.clips[index].position;
    this.drawWaveforms();
    this.drawPosition();
  }

  onMouseDown(e) {
    const clickPosition = this.getMouseSongPosition(e);
    const clips = this.props.module.clips;
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
      const id = this.props.module.id;
      const index = this.props.module.clips.indexOf(this.state.clickedClip);
      const newPosition = this.getNewClickedClipPosition(position);
      this.props.dispatch(moveClip(id, index, newPosition));
    }
    this.setState({clickPosition: -1, clickedClip: null});
    window.removeEventListener('mousemove', this.onMouseMove);
    this.drawWaveforms();
    this.drawPosition();
  }

  resize(width) {
    const canvas = this.canvas;
    const positionCanvas = this.positionCanvas;
    canvas.width = width;
    canvas.style.width = width + 'px';
    positionCanvas.width = width;
    positionCanvas.style.width = width + 'px';
  }

  getTotalDuration() {
    let totalDuration = 0;
    this.props.module.clips.forEach(clip => {
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
    const canvas = this.canvas;
    const positionCanvas = this.positionCanvas;
    const ctx = canvas.getContext('2d');
    const posCtx = positionCanvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    posCtx.strokeStyle = color;
    posCtx.lineWidth = width;
  }

  drawLine(fromX, fromY, toX, toY, context) {
    const canvas = this.canvas;
    const ctx = context || canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  }

  drawSegment(n, value, offset) {
    const canvas = this.canvas;
    const width = this.segmentWidth;
    const scale = this.segmentScale;
    this.setLine(width - this.segmentPadding, SECOND_COLOR);
    this.drawLine(
      width * n + offset, canvas.height / 2 - value * scale * canvas.height,
      width * n + offset, canvas.height / 2 + value * scale * canvas.height
    );
  }

  createWaveform(buffer, position) {
    const stereo = buffer.numberOfChannels === 2;
    const left = buffer.getChannelData(0);
    const right = stereo ? buffer.getChannelData(1) : null;
    let numberOfPoints = Math.ceil(buffer.duration * this.pointsPerSecond);
    if (numberOfPoints > this.maxNumberOfPoints) {
      numberOfPoints = this.maxNumberOfPoints;
    }
    let maxPointsPerSegment =
      (numberOfPoints > buffer.length) ?
      1 : Math.floor(buffer.length / numberOfPoints);
    const canvas = this.canvas;
    const offset = canvas.width * position / this.props.song.beats;

    let peak = 0, s = 0, waveform = [];
    for (let i = 0, j = 0; i < buffer.length; i++, j++) {
      const leftValue = Math.abs(left[i]);
      const rightValue = right ? Math.abs(right[i]) : 0;
      const highest = Math.max(leftValue, rightValue);
      peak = highest > peak ? highest : peak;
      if (j >= maxPointsPerSegment) {
        this.drawSegment(s++, peak, offset);
        waveform.push(peak);
        j = 0;
        peak = 0;
      }
    }
    this.waveforms.push(waveform);
  }

  drawSegments(index, position, numberOfSegments) {
    const waveform = this.waveforms[index];
    const step = waveform.length / numberOfSegments;
    const offset = this.canvas.width * position / this.props.song.beats;
    let n = 0;
    let firstOfChunk = {n: 0, index: 0};
    let value = 0;
    let lastIndex = 0;
    for (let i = 0; i < waveform.length; i += step) {
      const index = Math.round(i);
      const nextIndex = Math.round(i + step);
      let value = waveform[index];
      while (lastIndex < index - 1) {
        if (waveform[++lastIndex] > value) {
          value = waveform[lastIndex];
        }
      }
      if (index !== nextIndex && index === firstOfChunk.index) {
        const halfway = (firstOfChunk.n + n) / 2;
        this.drawSegment(halfway, value, offset);
      } else if (index !== nextIndex) {
        this.drawSegment(n, value, offset);
      } else if (index !== firstOfChunk.index) {
        firstOfChunk = {n, index};
      }
      n++;
    }
  }

  drawWaveform(clip) {
    const {buffer} = clip;
    const position = clip.position + (clip.offset || 0);
    const numberOfSegments = Math.ceil(1000 * buffer.duration / this.segmentDuration);
    const index = this.props.module.clips.indexOf(clip);
    if (!this.waveforms[index]) {
      this.createWaveform(buffer, position);
    } else {
      this.drawSegments(index, position, numberOfSegments);
    }
  }

  drawWaveforms() {
    this.resizeAsNeeded();
    this.props.module.clips.forEach(clip => {
      if (clip.buffer) {
        if (!this.state.clickedClip) {
          clip.offset = 0;
        }
        this.drawWaveform(clip);
      }
    });
  }

  drawPosition() {
    const positionCanvas = this.positionCanvas;
    const posCtx = positionCanvas.getContext('2d');
    const beat = this.props.song.position;
    this.setLine(2, LIGHT_GRAY);
    const x = Math.round(positionCanvas.width * beat / this.props.song.beats);
    this.drawLine(x, 0, x, positionCanvas.height, posCtx);
  }

  componentWillReceiveProps(nextProps) {
    let newClips = nextProps.module.clips.length !== this.props.module.clips.length;

    for (let i = 0; i < nextProps.module.clips.length; i++) {
      if (!nextProps.module.clips[i].buffer) {
        this.setState((prevState) => {
          prevState.nullBuffers.push(i);
          return {nullBuffers: prevState.nullBuffers};
        });
      }

      if (
        this.props.module.clips[i] &&
        nextProps.module.clips[i].position !== this.props.module.clips[i].position ||
        nextProps.module.clips[i].buffer && this.state.nullBuffers.indexOf(i) !== -1
      ) {
        this.setState((prevState) => {
          const index = prevState.nullBuffers.indexOf(i);
          prevState.nullBuffers.splice(index, 1);
          return {nullBuffers: prevState.nullBuffers};
        });
        newClips = true;
        break;
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
      nextProps.module.isOpen && (
        nextProps.song.position !== this.props.song.position ||
        nextProps.module.isOpen && !this.props.module.isOpen ||
        !this.state.hasDrawn
      )
    ) {
      this.setState({willDrawPosition: true});
    }
  }

  componentDidUpdate() {
    const canvas = this.canvas;
    const positionCanvas = this.positionCanvas;
    const ctx = canvas.getContext('2d');
    const posCtx = positionCanvas.getContext('2d');

    if (this.props.module.clips.length < 1) {
      return false;
    }

    for (let i = 0; i < this.props.module.clips.length; i++) {
      if (this.props.module.clips[i].buffer) {
        break;
      } else if (i === this.props.module.clips.length - 1) {
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
      <div className="playlist" onWheel={this.onWheel}>
        <div className="wrapper">
          <canvas
            ref={canvas => this.canvas = canvas}
            width="1024"
            height="720"
          />
          <canvas
            ref={positionCanvas => this.positionCanvas = positionCanvas}
            onMouseDown={this.onMouseDown}
            width="1024"
            height="720"
          />
        </div>
      </div>
    );
  }
});
