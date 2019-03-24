import React, {Component} from 'react';

export default class Key extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.down) {
      window.addEventListener('keydown', this.props.down);
    }

    if (this.props.press) {
      window.addEventListener('keypress', this.props.press);
    }

    if (this.props.up) {
      window.addEventListener('keyup', this.props.up);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.props.down);
    window.removeEventListener('keypress', this.props.press);
    window.removeEventListener('keyup', this.props.up);
  }

  render() {
    return <div>{this.props.children}</div>;
  }
};
