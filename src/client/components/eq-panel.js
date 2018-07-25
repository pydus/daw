import React, {Component} from 'react';
import Knob from './knob';

export default class EqPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const initialFrequencies = this.props.initialFrequencies;
    const elements = this.props.filters.map((filter, i) => (
      <div key={i}>
        <Knob
          unit="Hz"
          onChange={value => this.props.onFrequencyChange(value, i)}
          default={initialFrequencies[i]}
          value={filter.frequency.value}
          max={this.props.maxFrequency}
          min={this.props.minFrequency}
        />
        <Knob
          unit="dB"
          onChange={value => this.props.onGainChange(value, i)}
          default={0}
          value={filter.gain.value}
          max={this.props.maxValue}
          min={-this.props.maxValue}
        />
      </div>
    ));

    return (
      <div className="eq-panel">
        {elements}
      </div>
    );
  }
};
