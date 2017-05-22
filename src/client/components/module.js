'use strict';
import React from 'react';
import EffectSection from './effect-section';
import Playlist from './playlist';
import Range from './range';
import Meter from './meter';
import {
  setVolume,
  muteModule,
  soloModule,
  addClip,
  unroute,
  renameModule
} from '../actions';

export default class Module extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      willStyleCircle: false,
      name: '',
      isNaming: this.props.module.id !== 0,
      volumePercentage: 100
    };
    this.toggle = this.toggle.bind(this);
    this.onSourceChange = this.onSourceChange.bind(this);
    this.unroute = this.unroute.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.rename = this.rename.bind(this);
    this.open = this.open.bind(this);
    this.openEffect = this.openEffect.bind(this);
    this.onVolumeChange = this.onVolumeChange.bind(this);
    this.solo = this.solo.bind(this);
    this.mute = this.mute.bind(this);
  }

  toggle(e) {
    const className = e.target.className;
    if (
      className === 'square' ||
      className === 'meter' ||
      e.target.tagName === 'H1'
    ) {
      if (this.props.module.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }
  }

  solo() {
    this.props.dispatch(soloModule(this.props.module.id));
  }

  mute() {
    this.props.dispatch(muteModule(this.props.module.id));
  }

  onVolumeChange(value) {
    this.setState({volumePercentage: value * 100});
    this.props.dispatch(setVolume(this.props.module.id, value));
  }

  close() {
    if (this.props.module.isOpen) {
      this.props.onClose(this.refs.wrapper, this.props.module.id);
    }
  }

  open() {
    if (!this.props.module.isOpen) {
      this.props.onOpen(this.refs.wrapper, this.props.module.id);
    }
  }

  openEffect() {
    this.props.onOpenEffect(this.refs.wrapper, this.props.module.id);
  }

  onSourceChange(e) {
    const file = e.target.files[0];
    if (file) {
      this.props.dispatch(addClip(this.props.module.id, file));
    }
  }

  unroute(source, destination) {
    this.props.dispatch(unroute(source, destination));
  }

  onMouseDown(e) {
    if (e.target === e.currentTarget || e.target.nodeName === 'H1') {
      this.props.onRouteMouseDown(this.props.module.id);
    }
  }

  onMouseUp() {
    this.props.onMouseUp(this.props.module.id);
  }

  onMouseEnter() {
    this.setState({willStyleCircle: true});
  }

  onMouseLeave() {
    this.setState({willStyleCircle: false});
  }

  handleInputChange(e) {
    this.setState({name: e.target.value});
  }

  rename() {
    this.props.dispatch(renameModule(this.props.module.id, this.state.name));
    this.setState({isNaming: false});
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.rename();
    }
  }

  render() {
    const isMaster = this.props.module.id === 0;
    const isDestination = this.props.module.sources.length > 0;
    const moduleStyle = this.props.song.isPlaying ? {background: 'none'} : {};
    const circleStyle = {background: this.props.module.color};
    const panelTagStyle = isDestination ? {background: this.props.module.color} : {};
    const tags = this.props.destinationModules.map(el => (
      <div
        key={el.id}
        className="tag"
        onClick={() => this.unroute(this.props.module.id, el.id)}
        style={{background: el.color}}
      ></div>
    ));

    return (
      <div className={'wrapper ' + (this.props.module.isOpen ? 'open' : '')} ref="wrapper">
        <Playlist
          module={this.props.module}
          song={this.props.song}
          dispatch={this.props.dispatch}
        />
        <div className="module" onClick={this.toggle}>
          <Range
            display="block"
            onChange={this.onVolumeChange}
            min="0"
            max="1.15"
            default="1"
          >
            <div className="volume-wrapper">
              <div
                className="volume"
                style={{height: `${this.state.volumePercentage * 0.87}%`}}
              >
              </div>
            </div>
          </Range>
          <div className="tags">
            {tags}
          </div>
          <div
            className="square"
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
          >
            {!this.state.isNaming && <h1>{this.props.module.name}</h1>}
            {this.state.isNaming &&
              <input
                autoFocus
                maxLength="30"
                onChange={this.handleInputChange}
                onKeyDown={this.handleKeyDown}
                onBlur={this.rename}
              />
            }
            {!this.props.isHighlighted &&
              <div>
                {this.props.song.isPlaying &&
                  <div>
                    <Meter analyser={this.props.module.leftAnalyser}/>
                    <Meter analyser={this.props.module.rightAnalyser}/>
                  </div>
                }
                <EffectSection
                  id={this.props.module.id}
                  effects={this.props.module.effects}
                  onOpen={this.openEffect}
                />
                <div className="panel">
                  <div
                    onClick={this.solo}
                    className={this.props.module.isSoloed ? 'pressed' : ''}
                  >
                  S
                  </div>
                  <div>
                    <div
                      className={isMaster || isDestination ? 'tag' : 'tag none'}
                      style={panelTagStyle}
                    ></div>
                    {!isMaster && !isDestination &&
                      <label>
                        <input type="file" accept="audio/*" onChange={this.onSourceChange}/>
                      </label>
                    }
                  </div>
                  <div
                    onClick={this.mute}
                    className={this.props.module.isMuted ? 'pressed' : ''}
                  >
                  M
                  </div>
                </div>
              </div>
            }
            {this.props.isHighlighted &&
              <div
                className="circle"
                style={this.state.willStyleCircle ? circleStyle : {}}
              ></div>
            }
          </div>
        </div>
      </div>
    );
  }
};
