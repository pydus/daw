import React, {Component} from 'react';

const withRect = Component => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.bar = null;
      this.getRect = this.getRect.bind(this);
    }

    getRect() {
      return this.bar.getBoundingClientRect();
    }

    render() {
      return (
        <div ref={bar => this.bar = bar}>
          <Component getRect={this.getRect} {...this.props}/>
        </div>
      );
    }
  };
};

export default withRect;
