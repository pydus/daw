'use strict';
import React from 'react';
import EqPanel from './eq-panel';
import Grid from './grid';
import Curve from './curve';
import ModuleBar from './module-bar';
import EqControl from './eq-control';

export default class Eq extends React.Component {
  constructor(props) {
    super(props);
    this.onInputGainChange = this.onInputGainChange.bind(this);
    this.onOutputGainChange = this.onOutputGainChange.bind(this);
    this.onFrequencyChange = this.onFrequencyChange.bind(this);
    this.onGainChange = this.onGainChange.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.minFrequency = 20;
    this.maxFrequency = 20000;
    this.maxValue = 20;
    this.QStepPercentage = 12;
  }

  usesGain(filter) {
    return ['highshelf', 'lowshelf', 'peaking'].indexOf(filter.type) !== -1;
  }

  getBandwidth(filter) {
    return 2 / Math.log(2) * Math.asinh(1 / (2 * filter.Q.value));
  }

  edit(settings) {
    this.props.onEdit(settings);
  }

  onInputGainChange(value) {
    this.edit({inputGain: value});
  }

  onOutputGainChange(value) {
    this.edit({outputGain: value});
  }

  onFrequencyChange(frequency, index) {
    this.edit({frequency, index});
  }

  onGainChange(gain, index) {
    if (this.usesGain(this.props.effect.filters[index])) {
      this.edit({gain, index});
    }
  }

  onWheel(e, index) {
    e.preventDefault();
    const sign = Math.abs(e.deltaY) / (e.deltaY || 1);
    const Q = this.props.effect.filters[index].Q.value * (1 + sign * this.QStepPercentage / 100);
    this.edit({Q, index});
  }

  render() {
    const eq = this.props.effect;
    const controls = eq.filters.map((filter, i) => {
      return (
        <EqControl
          key={i}
          filter={filter}
          maxFrequency={this.maxFrequency}
          minFrequency={this.minFrequency}
          defaultFrequency={eq.initialFrequencies[i]}
          frequencyValue={filter.frequency.value}
          maxGain={this.maxValue}
          minGain={-this.maxValue}
          defaultGain={0}
          gainValue={filter.gain.value}
          onFrequencyChange={value => this.onFrequencyChange(value, i)}
          onGainChange={value => this.onGainChange(value, i)}
          usesGain={this.usesGain(filter)}
        />
      );
    });
    return (
      <div>
        <ModuleBar
          side="left"
          onChange={this.onInputGainChange}
          min="0"
          max="2"
          default="1"
          value={this.props.effect.inputGain.gain.value}
        />
        <ModuleBar
          side="right"
          onChange={this.onOutputGainChange}
          min="0"
          max="2"
          default="1"
          value={this.props.effect.outputGain.gain.value}
        />
        <div className="content">
          <EqPanel
            filters={eq.filters}
            initialFrequencies={eq.initialFrequencies}
            onFrequencyChange={this.onFrequencyChange}
            onGainChange={this.onGainChange}
            maxFrequency={this.maxFrequency}
            minFrequency={this.minFrequency}
            maxValue={this.maxValue}
          />
          <div className="eq-display">
            <Grid
              width="396"
              height="183"
              maxValue={this.maxValue}
              minFrequency={this.minFrequency}
              maxFrequency={this.maxFrequency}
            />
            <Curve
              width="396"
              height="183"
              filters={this.props.effect.filters}
              minFrequency={this.minFrequency}
              maxFrequency={this.maxFrequency}
              maxValue={this.maxValue}
            />
            {controls}
          </div>
        </div>
      </div>
    );
  }
};
