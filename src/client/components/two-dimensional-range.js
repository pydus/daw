import React from 'react';
import Range from './range';

export default props => (
  <Range
    onChange={props.onChangeX}
    max={props.xMax}
    min={props.xMin}
    default={props.xDefault}
    value={props.xValue}
    direction="horizontal"
  >
    {x => (
      <Range
        onChange={props.onChangeY}
        max={props.yMax}
        min={props.yMin}
        default={props.yDefault}
        value={props.yValue}
      >
        {y => props.children(x, y)}
      </Range>
    )}
  </Range>
);
