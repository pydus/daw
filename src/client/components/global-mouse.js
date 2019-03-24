import React, {Component} from 'react';

export default class GlobalMouse extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.up) {
      window.addEventListener('mouseup', this.props.up);
    }

    if (this.props.down) {
      window.addEventListener('mousedown', this.props.down);
    }

    if (this.props.move) {
      window.addEventListener('mousemove', this.props.move);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.props.up);
    window.removeEventListener('mousedown', this.props.down);
    window.removeEventListener('mousemove', this.props.move);
  }

  render() {
    return <div>{this.props.children}</div>;
  }
};
