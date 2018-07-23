import React from 'react';

const TextIcon = text => (
  <svg width="22" height="22">
    <text x="50%" y="16" textAnchor="middle" fill="white">{text}</text>
  </svg>
);

const NoIcon = () => TextIcon('');

const EffectIcon = ({type}) => {
  switch (type) {
    case 'COMPRESSOR':
      return TextIcon('C');
    case 'EQ':
      return TextIcon('EQ');
    default:
      return NoIcon();
  }
};

export default EffectIcon;
