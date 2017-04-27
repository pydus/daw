'use strict';
import React from 'react';
import Module from './module';
import DOMMath from './dom-math';
import { connect } from 'react-redux';
import {
  createModule,
  toggleExpandModule,
  renameModule,
  moveModule,
  removeModule
} from '../actions';

export default connect((state) => ({
  modules: state.modules
}))(class ModuleSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {modules: [], name: ''};
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.createModule = this.createModule.bind(this);
  }

  createModule() {
    this.props.dispatch(createModule());
  }

  onOpen(module, component) {
    this.props.dispatch(toggleExpandModule(component.props.id));
    const modulesAtSameHeight = DOMMath.elementsAtSameHeight(module.parentNode.children, module);
    const modulesLeft = DOMMath.elementsLeftOf(modulesAtSameHeight, module);

    if (modulesLeft.length > 0) {
      this.props.dispatch(moveModule(component.props.id, -1 * modulesLeft.length));
    }
  }

  onClose(module, component) {
    this.props.dispatch(toggleExpandModule(component.props.id));
    // TODO Move back moved module
  }

  render() {
    const modulesList = this.props.modules.modules.map(key => (
      this.props.modules.modulesById[key]
    ));

    const modules = modulesList.map(el => (
      <Module key={el.id} id={el.id} name={el.name}
        isOpen={el.isOpen} onOpen={this.onOpen} onClose={this.onClose}/>
    ));

    return (
      <div className="modules">
        {modules}
        <div className="create" onClick={this.createModule}></div>
      </div>
    );
  }
});
