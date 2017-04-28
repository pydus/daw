'use strict';
import React from 'react';
import EffectSection from './effect-section';
import Playlist from './playlist';

export default class Module extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
  }

  toggle(e) {
    if (e.target.className === 'square' || e.target.tagName === 'H1') {
      const module = e.target.className === 'square' ?
        e.target.parentNode : e.target.parentNode.parentNode;

      if (this.props.isOpen) {
        this.props.onClose(module.parentNode, this);
      } else {
        this.props.onOpen(module.parentNode, this);
      }
    }
  }

  onFileChange(e) {
    const file = e.target.files[0];
    console.log(URL.createObjectURL(file));
  }

  render() {
    return (
      <div className={'wrapper ' + (this.props.isOpen ? 'open' : '')}>
        <audio></audio>
        <Playlist/>
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
                  <input type="file" onChange={this.onFileChange}/>
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
