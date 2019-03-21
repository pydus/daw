import React from 'react';
import Range from './range';

export default props => (
  <Range
    display="block"
    onChange={props.onChange}
    min={props.min}
    max={props.max}
    default={props.default}
    value={props.value}
  >
    {value => (
      <div className={`volume-wrapper ${props.side}`}>
        <div
          className="volume"
          style={{height: `${value * props.default / props.max * 100}%`}}
        ></div>
      </div>
    )}
  </Range>
);
