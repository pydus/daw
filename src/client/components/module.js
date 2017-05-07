'use strict';
import React from 'react';
import EffectSection from './effect-section';
import Playlist from './playlist';

export default class Module extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      willStyleCircle: false,
      name: '',
      isNaming: this.props.module.id !== 0
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
  }

  toggle(e) {
    if (e.target.className === 'square' || e.target.tagName === 'H1') {
      const wrapper = this.refs.wrapper;
      if (this.props.module.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }
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
      this.props.onSourceChange(this.props.module.id, file);
    }
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

  handleInputChange(e) {
    this.setState({name: e.target.value});
  }

  rename() {
    this.props.onRename(this.props.module.id, this.state.name);
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
          clips={this.props.module.clips}
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
            {!this.state.isNaming && <h1>{this.props.module.name}</h1>}
            {this.state.isNaming && (
              <input
                autoFocus
                maxLength="30"
                onChange={this.handleInputChange}
                onKeyDown={this.handleKeyDown}
                onBlur={this.rename}
              />
            )}
            {!this.props.isHighlighted && (
              <div>
                <EffectSection
                  id={this.props.module.id}
                  effects={this.props.module.effects}
                  onOpen={this.openEffect}
                />
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
