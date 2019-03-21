'use strict';
import React from 'react';
import Range from './range';
import EqPanel from './eq-panel';
import Grid from './grid';
import Curve from './curve';

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
    return (
      Math.log10(frequency / this.minFrequency) /
      Math.log10(this.maxFrequency / this.minFrequency)
    );
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
        <Range
          key={i}
          onChange={value => this.onFrequencyChange(value, i)}
          max={this.maxFrequency}
          min={this.minFrequency}
          default={eq.initialFrequencies[i]}
          value={filter.frequency.value}
          direction="horizontal"
        >
          {frequencyValue => (
            <Range
              onChange={value => this.onGainChange(value, i)}
              max={this.maxValue}
              min={-this.maxValue}
              default={0}
              value={filter.gain.value}
            >
              {gainValue => (
                <div
                  className="control"
                  onWheel={e => this.onWheel(e, i)}
                  style={{
                    left: `${100 * this.getLogFrequencyRatio(filter.frequency.value)}%`,
                    top: `${this.usesGain(filter) ? 50 - 50 * filter.gain.value / this.maxValue : 50}%`
                  }}
                >
                  <div className={`text ${topGuard} ${rightGuard} ${leftGuard}`}>
                    {`${filter.gain.value.toFixed(2)} dB`}
                  </div>
                  <div className={`text ${bottomGuard} ${rightGuard} ${leftGuard}`}>
                    {`${filter.frequency.value.toFixed(2)} Hz`}
                  </div>
                </div>
              )}
            </Range>
          )}
        </Range>
      );
    });
    return (
      <div>
        <Range
          display="block"
          onChange={this.onInputGainChange}
          min="0"
          max="2"
          default="1"
          value={this.props.effect.inputGain.gain.value}
        >
          {value => (
            <div className="volume-wrapper">
              <div
                className="volume"
                style={{height: `${value / 2 * 100}%`}}
              ></div>
            </div>
          )}
        </Range>
        <Range
          display="block"
          onChange={this.onOutputGainChange}
          min="0"
          max="2"
          default="1"
          value={this.props.effect.outputGain.gain.value}
        >
          {value => (
            <div className="volume-wrapper right">
              <div
                className="volume"
                style={{height: `${value / 2 * 100}%`}}
              ></div>
            </div>
          )}
        </Range>
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
            <Grid width="396" height="183" getLogFrequencyRatio={this.getLogFrequencyRatio}/>
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
