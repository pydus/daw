'use strict';
import React from 'react';
import Module from './module';
import DOMMath from './dom-math';

export default class ModuleSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {modules: [], name: ''};
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.createModule = this.createModule.bind(this);
    this.module = this.module.bind(this);
    this.count = 0;
  }

  componentDidMount() {
    const modules = [
      'Master',
      'Guitar',
      'A Test Module',
      'Vocals'
    ];

    this.count = modules.length - 1;

    this.setState({modules: modules.map((el, i) =>
      <Module key={i} id={i} name={el} onOpen={this.onOpen} onClose={this.onClose}/>
    )});
  }

  module(name) {
    this.count++;
    return <Module key={this.count} id={this.count}
      name={name} onOpen={this.onOpen} onClose={this.onClose}/>;
  }

  createModule() {
    const newModule = this.module(this.state.name);
    this.setState((prevState, props) => ({
      modules: prevState.modules.concat(newModule)
    }));
  }

  onOpen(module, component) {
    const modules = this.state.modules;
    const modulesAtSameHeight = DOMMath.elementsAtSameHeight(module.parentNode.children, module);
    const modulesLeft = DOMMath.elementsLeftOf(modulesAtSameHeight, module);

    if (modulesLeft.length > 0) {
      this.setState((prevState, props) => {
        let index = -1;
        prevState.modules.forEach((el, i) => {
          if (el.props.id === component.props.id) {
            index = i;
          }
        });
        prevState.modules.splice(index - modulesLeft.length, 0, prevState.modules.splice(index, 1)[0]);
        return {modules: prevState.modules};
      });
    }
  }

  onClose(module, component) {
    this.setState((prevState, props) => {
      // TODO Move back moved module
      return {modules: prevState.modules};
    });
  }

  render() {
    return (
      <div className="modules">
        {this.state.modules}
        <div className="create" onClick={this.createModule}></div>
      </div>
    );
  }
};
