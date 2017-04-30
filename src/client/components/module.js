'use strict';
import React from 'react';
import EffectSection from './effect-section';
import Playlist from './playlist';

export default class Module extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.onSourceChange = this.onSourceChange.bind(this);
    this.onWiden = this.onWiden.bind(this);
  }

  toggle(e) {
    if (e.target.className === 'square' || e.target.tagName === 'H1') {
      const module = e.target.className === 'square' ?
        e.target.parentNode : e.target.parentNode.parentNode;

      if (this.props.module.isOpen) {
        this.props.onClose(module.parentNode, this.props.module.id);
      } else {
        this.props.onOpen(module.parentNode, this.props.module.id);
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

  render() {
    return (
      <div className={'wrapper ' + (this.props.module.isOpen ? 'open' : '')}>
        <Playlist
          bufferSource={this.props.module.bufferSource}
          onWiden={this.onWiden}
          width={this.props.playlistWidth}
        />
        <div className="module" onClick={this.toggle}>
          <div className="volume"></div>
          <div className="square">
            <h1>{this.props.module.name}</h1>
            <EffectSection/>
            <div className="panel">
              <div>S</div>
              <div>
                -
                <label>
                  <input type="file" onChange={this.onSourceChange}/>
                </label>
              </div>
              <div>M</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
