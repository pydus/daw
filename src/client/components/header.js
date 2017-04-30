'use strict';
import React from 'react';
import { connect } from 'react-redux';

const Header = connect((state) => ({
  song: state.song
}))((props) => {
  const width = props.song.position;
  return (
    <header>
      <div className="song-position">
        <div className="bar">
          <div className="position"></div>
        </div>
      </div>
    </header>
  );
});

export default Header;
