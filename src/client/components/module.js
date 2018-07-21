'use strict';
import React from 'react';
import EffectSection from './effect-section';
import Playlist from './playlist';
import Range from './range';
import Meter from './meter';
import Panel from './panel';
import {
  setVolume,
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
    this.onViewChange = this.onViewChange.bind(this);
  }

  toggle(e) {
    const className = e.target.className;
    if (
      className === 'square' ||
      className === 'meter' ||
      e.target.tagName === 'H1' ||
      e.target.tagName === 'CANVAS'
    ) {
      if (this.props.module.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }
  }

  onVolumeChange(value) {
    this.setState({volumePercentage: value * 100});
    this.props.dispatch(setVolume(this.props.module.id, value));
  }

  close() {
    if (this.props.module.isOpen) {
      this.props.onClose(this.wrapper, this.props.module.id);
    }
  }

  open() {
    if (!this.props.module.isOpen) {
      this.props.onOpen(this.wrapper, this.props.module.id);
    }
  }

  openEffect() {
    this.props.onOpenEffect(this.wrapper, this.props.module.id);
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

  onViewChange(view) {
    this.props.onViewChange(view);
  }

  render() {
    const circleStyle = {background: this.props.module.color};
    const tags = this.props.destinationModules.map(el => (
      <div
        key={el.id}
        className="tag"
        onClick={() => this.unroute(this.props.module.id, el.id)}
        style={{background: el.color}}
      ></div>
    ));

    return (
      <div
        className={'wrapper ' + (this.props.module.isOpen ? 'open' : '')}
        ref={wrapper => this.wrapper = wrapper}
      >
        <Playlist
          module={this.props.module}
          segmentDuration={this.props.view.segmentDuration}
          scrollLeft={this.props.view.scrollLeft}
          onViewChange={this.onViewChange}
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
            {!this.state.isNaming &&
              <h1 title={this.props.module.name}>
                {this.props.module.name}
              </h1>
            }
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
                    <Meter
                      analyser={this.props.module.leftAnalyser}
                      width={91.5}
                      height={183}
                    />
                    <Meter
                      analyser={this.props.module.rightAnalyser}
                      width={91.5}
                      height={183}
                      direction="right"
                    />
                  </div>
                }
                <EffectSection
                  id={this.props.module.id}
                  effects={this.props.module.effects}
                  onOpen={this.openEffect}
                />
                <Panel
                  module={this.props.module}
                  dispatch={this.props.dispatch}
                />
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
