import React, {Component} from 'react';
import {
  muteModule,
  soloModule,
  addClip,
} from '../actions';

const ClipIcon = () => (
  <svg viewBox="0 0 120 120">
    <line x1="0" x2="0" y1="55" y2="65" strokeWidth="5" strokeLinecap="round"/>
    <line x1="15" x2="15" y1="25" y2="95" strokeWidth="5" strokeLinecap="round"/>
    <line x1="30" x2="30" y1="35" y2="85" strokeWidth="5" strokeLinecap="round"/>
    <line x1="45" x2="45" y1="25" y2="95" strokeWidth="5" strokeLinecap="round"/>
    <line x1="60" x2="60" y1="40" y2="80" strokeWidth="5" strokeLinecap="round"/>
    <line x1="75" x2="75" y1="25" y2="95" strokeWidth="5" strokeLinecap="round"/>
    <line x1="90" x2="90" y1="35" y2="85" strokeWidth="5" strokeLinecap="round"/>
    <line x1="105" x2="105" y1="25" y2="95" strokeWidth="5" strokeLinecap="round"/>
    <line x1="120" x2="120" y1="55" y2="65" strokeWidth="5" strokeLinecap="round"/>
  </svg>
);

export default class Panel extends Component {
  constructor(props) {
    super(props);
    this.onSourceChange = this.onSourceChange.bind(this);
    this.solo = this.solo.bind(this);
    this.mute = this.mute.bind(this);
  }

  onSourceChange(e) {
    const file = e.target.files[0];
    if (file) {
      this.props.dispatch(addClip(this.props.module.id, file));
    }
  }

  solo() {
    this.props.dispatch(soloModule(this.props.module.id));
  }

  mute() {
    this.props.dispatch(muteModule(this.props.module.id));
  }

  render() {
    const isMaster = this.props.module.id === 0;
    const isDestination = this.props.module.sources.length > 0;
    const panelTagStyle = isDestination ? {background: this.props.module.color} : {};

    return (
      <div className="panel">
        <div
          title="Solo"
          onClick={this.solo}
          className={this.props.module.isSoloed ? 'pressed' : ''}
        >
        S
        </div>
        <div>
          {this.props.module.clips.length === 0 &&
            <div
              className={isMaster || isDestination ? 'tag' : 'tag none'}
              style={panelTagStyle}
            ></div>
          }
          {this.props.module.clips.length > 0 && <ClipIcon/>}
          {!isMaster && !isDestination &&
            <label>
              <input type="file" accept="audio/*" onChange={this.onSourceChange}/>
            </label>
          }
        </div>
        <div
          title="Mute"
          onClick={this.mute}
          className={this.props.module.isMuted ? 'pressed' : ''}
        >
        M
        </div>
      </div>
    );
  }
};
