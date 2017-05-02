'use strict';
import React from 'react';
import EffectSection from './effect-section';
import Playlist from './playlist';

export default class Module extends React.Component {
  constructor(props) {
    super(props);
    this.state = {willStyleCircle: false};
    this.toggle = this.toggle.bind(this);
    this.onSourceChange = this.onSourceChange.bind(this);
    this.onWiden = this.onWiden.bind(this);
    this.unroute = this.unroute.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  toggle(e) {
    if (e.target.className === 'square' || e.target.tagName === 'H1') {
      const wrapper = this.refs.wrapper;
      if (this.props.module.isOpen) {
        this.props.onClose(wrapper, this.props.module.id);
      } else {
        this.props.onOpen(wrapper, this.props.module.id);
      }
    }
  }

  onSourceChange(e) {
    const file = e.target.files[0];
    if (file) {
      this.props.onSourceChange(this.props.module.id, file);
    }
  }

  onWiden(width) {
    this.props.onWiden(width);
  }

  unroute(source, destination) {
    this.props.onUnroute(source, destination);
  }

  onMouseDown(e) {
    if (e.target === e.currentTarget || e.target.nodeName === 'H1') {
      this.props.onRouteMouseDown(this.props.module.id);
    }
  }

  onMouseUp(e) {
    this.props.onMouseUp(this.props.module.id);
  }

  onMouseEnter(e) {
    this.setState({willStyleCircle: true});
  }

  onMouseLeave(e) {
    this.setState({willStyleCircle: false});
  }

  render() {
    const isMaster = this.props.module.id === 0;
    const isDestination = this.props.module.sources.length > 0;
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
          bufferSource={this.props.module.bufferSource}
          onWiden={this.onWiden}
          width={this.props.playlistWidth}
          song={this.props.song}
          isOpen={this.props.module.isOpen}
        />
        <div className="module" onClick={this.toggle}>
          <div className="volume"></div>
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
            <h1>{this.props.module.name}</h1>
            {!this.props.isHighlighted && (
              <div>
                <EffectSection/>
                <div className="panel">
                  <div>S</div>
                  <div>
                    <div
                      className={isMaster || isDestination ? 'tag' : 'tag none'}
                      style={panelTagStyle}
                    ></div>
                    {!isMaster && !isDestination && (
                      <label>
                        <input type="file" onChange={this.onSourceChange}/>
                      </label>
                    )}
                  </div>
                  <div>M</div>
                </div>
              </div>
            )}
            {this.props.isHighlighted && (
              <div
                className="circle"
                style={this.state.willStyleCircle ? circleStyle : {}}
              ></div>
            )}
          </div>
        </div>
      </div>
    );
  }
};
