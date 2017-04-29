'use strict';
import React from 'react';
import EffectSection from './effect-section';
import Playlist from './playlist';

export default class Module extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.onSourceChange = this.onSourceChange.bind(this);
  }

  toggle(e) {
    if (e.target.className === 'square' || e.target.tagName === 'H1') {
      const module = e.target.className === 'square' ?
        e.target.parentNode : e.target.parentNode.parentNode;

      if (this.props.isOpen) {
        this.props.onClose(module.parentNode, this.props.id);
      } else {
        this.props.onOpen(module.parentNode, this.props.id);
      }
    }
  }

  onSourceChange(e) {
    const file = e.target.files[0];
    //const url = URL.createObjectURL(file);
    this.props.onSourceChange(this.props.id, file);
    // TODO change audio element src to file url
  }

  render() {
    return (
      <div className={'wrapper ' + (this.props.isOpen ? 'open' : '')}>
        <audio></audio>
        <Playlist bufferSource={this.props.bufferSource}/>
        <div className="module" onClick={this.toggle}>
          <div className="volume"></div>
          <div className="square">
            <h1>{this.props.name}</h1>
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
