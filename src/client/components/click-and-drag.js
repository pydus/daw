import React, {Component} from 'react';
import GlobalMouse from './global-mouse';
import withRect from './with-rect';

export default withRect(class ClickAndDrag extends Component {
  constructor(props) {
    super(props);
    this.state = {isDragging: false};
    this.direction = this.props.direction || 'y';
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  getRatio(e) {
    const rect = this.props.getRect();
    if (this.direction === 'x') {
      return (e.clientX - rect.left) / rect.width;
    }
    return (rect.bottom - e.clientY) / rect.height;
  }

  notifyListeners(ratio) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(ratio);
    }
  }

  updateRatio(e) {
    const ratio = this.getRatio(e);
    this.notifyListeners(ratio);
  }

  onMouseDown(e) {
    this.updateRatio(e);
    this.setState({isDragging: true});
  }

  onMouseMove(e) {
    if (this.state.isDragging) {
      this.updateRatio(e);
    }
  }

  onMouseUp() {
    this.setState({isDragging: false});
  }

  render() {
    return (
      <GlobalMouse up={this.onMouseUp} move={this.onMouseMove}>
        <div onMouseDown={this.onMouseDown}>
          {this.props.children}
        </div>
      </GlobalMouse>
    );
  }
});
