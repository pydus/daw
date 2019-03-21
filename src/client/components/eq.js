'use strict';
import React from 'react';
import EqPanel from './eq-panel';
import Grid from './grid';
import Curve from './curve';
import ModuleBar from './module-bar';
import TwoDimensionalRange from './two-dimensional-range';
import {getLogFrequencyRatio} from '../audio-tools';

export default class Eq extends React.Component {
  constructor(props) {
    super(props);
    this.onInputGainChange = this.onInputGainChange.bind(this);
    this.onOutputGainChange = this.onOutputGainChange.bind(this);
    this.onFrequencyChange = this.onFrequencyChange.bind(this);
    this.onGainChange = this.onGainChange.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.getLogFrequencyRatio = this.getLogFrequencyRatio.bind(this);
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

  getLogFrequencyRatio(frequency) {
    return getLogFrequencyRatio(frequency, this.minFrequency, this.maxFrequency);
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
    const leftMargin = 28;
    const rightMargin = 13000;
    const topMargin = 15;
    const bottomMargin = -15;
    const controls = eq.filters.map((filter, i) => {
      const topGuard = filter.gain.value > topMargin ? 'low' : '';
      const rightGuard = filter.frequency.value > rightMargin ? 'left' : '';
      const leftGuard = filter.frequency.value < leftMargin ? 'right' : '';
      const bottomGuard = filter.gain.value < bottomMargin ? 'high' : '';
      return (
        <TwoDimensionalRange
          key={i}
          onChangeX={value => this.onFrequencyChange(value, i)}
          xMax={this.maxFrequency}
          xMin={this.minFrequency}
          xDefault={eq.initialFrequencies[i]}
          xValue={filter.frequency.value}
          onChangeY={value => this.onGainChange(value, i)}
          yMax={this.maxValue}
          yMin={-this.maxValue}
          yDefault={0}
          yValue={filter.gain.value}
        >
          {(frequencyValue, gainValue) => (
            <div
              className="control"
              onWheel={e => this.onWheel(e, i)}
              style={{
                left: `${100 * this.getLogFrequencyRatio(frequencyValue)}%`,
                top: `${this.usesGain(filter) ? 50 - 50 * gainValue / this.maxValue : 50}%`
              }}
            >
              <div className={`text ${topGuard} ${rightGuard} ${leftGuard}`}>
                {`${gainValue.toFixed(2)} dB`}
              </div>
              <div className={`text ${bottomGuard} ${rightGuard} ${leftGuard}`}>
                {`${frequencyValue.toFixed(2)} Hz`}
              </div>
            </div>
          )}
        </TwoDimensionalRange>
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
