'use strict';
import React from 'react';

export default class Menu extends React.Component {
  render() {
    const items = [

    ];

    return (
      <div className="menu">
        <ul>
          <li>Equalizer</li>
          <li>Compressor</li>
          <li>Reverb</li>
        </ul>
      </div>
    );
  }
}
