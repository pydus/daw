import React from 'react';
import TwoDimensionalRange from './two-dimensional-range';
import {getLogFrequencyRatio} from '../audio-tools';

export default props => {
  const {filter} = props;

  const leftMargin = 28;
  const rightMargin = 13000;
  const topMargin = 15;
  const bottomMargin = -15;

  const topGuard = filter.gain.value > topMargin ? 'low' : '';
  const rightGuard = filter.frequency.value > rightMargin ? 'left' : '';
  const leftGuard = filter.frequency.value < leftMargin ? 'right' : '';
  const bottomGuard = filter.gain.value < bottomMargin ? 'high' : '';
  const usesGain = typeof props.usesGain === 'undefined' ? true : props.usesGain;

  return (
    <TwoDimensionalRange
      onChangeX={props.onFrequencyChange}
      xMax={props.maxFrequency}
      xMin={props.minFrequency}
      xDefault={props.defaultFrequency}
      xValue={props.frequencyValue}
      onChangeY={props.onGainChange}
      yMax={props.maxGain}
      yMin={props.minGain}
      yDefault={props.defaultGain}
      yValue={props.gainValue}
    >
      {(frequencyValue, gainValue) => (
        <div
          className="control"
          onWheel={e => this.onWheel(e, i)}
          style={{
            left: `${100 * getLogFrequencyRatio(frequencyValue, props.minFrequency, props.maxFrequency)}%`,
            top: `${usesGain ? 50 - 50 * gainValue / props.maxGain : 50}%`
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
};
