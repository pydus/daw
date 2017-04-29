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
  removeModule,
  setSource,
  createClip
} from '../actions';

export default connect((state) => ({
  modules: state.modules.modules,
  modulesById: state.modules.modulesById
}))(class ModuleSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {modules: [], name: ''};
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.createModule = this.createModule.bind(this);
    this.onSourceChange = this.onSourceChange.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(createModule('Master'));
  }

  createModule() {
    this.props.dispatch(createModule());
  }

  onOpen(module, id) {
    this.props.dispatch(toggleExpandModule(id));
    const modulesAtSameHeight = DOMMath.elementsAtSameHeight(module.parentNode.children, module);
    const modulesLeft = DOMMath.elementsLeftOf(modulesAtSameHeight, module);

    if (modulesLeft.length > 0) {
      this.props.dispatch(moveModule(id, -1 * modulesLeft.length));
    }
  }

  onClose(module, id) {
    this.props.dispatch(toggleExpandModule(id));
    // TODO Move back moved module
  }

  onSourceChange(id, file) {
    this.props.dispatch(setSource(id, file));
  }

  render() {
    const modulesList = this.props.modules.map(key => (
      this.props.modulesById[key]
    ));

    const modules = modulesList.map(el => (
      <Module
        key={el.id}
        id={el.id}
        name={el.name}
        bufferSource={el.bufferSource}
        isOpen={el.isOpen}
        onOpen={this.onOpen}
        onClose={this.onClose}
        onSourceChange={this.onSourceChange}
      />
    ));

    return (
      <div className="modules">
        {modules}
        <div className="create" onClick={this.createModule}></div>
      </div>
    );
  }
});
