'use strict';
import React from 'react';
import Module from './module';
import HiddenModule from './hidden-module';
import DOMMath from './dom-math';
import { connect } from 'react-redux';
import {
  createModule,
  toggleExpandModule,
  renameModule,
  moveModule,
  removeModule,
  setSource,
  createClip,
  route,
  unroute
} from '../actions';

export default connect((state) => ({
  modules: state.modules.modules,
  modulesById: state.modules.modulesById,
  song: state.song
}))(class ModuleSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      widestPlaylist: 0,
      draggingId: -1,
      highlighted: {},
      modulesPerRow: 0,
      visibleModules: [...this.props.modules]
    };
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.createModule = this.createModule.bind(this);
    this.onSourceChange = this.onSourceChange.bind(this);
    this.onWiden = this.onWiden.bind(this);
    this.onUnroute = this.onUnroute.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.renameModule = this.renameModule.bind(this);
  }

  componentDidMount() {
    this.createModule('Master');
    window.addEventListener('mouseup', () => {
      this.stopHighlighting();
      this.setState({draggingId: -1});
    });
    window.addEventListener('mousemove', this.onMouseMove);
  }

  createModule(name) {
    const moduleName = typeof name === 'string' ? name : '';
    const action = this.props.dispatch(createModule(moduleName));
    this.props.dispatch(route(action.id, 0));
    this.setState((prevState) => (
      {visibleModules: [...prevState.visibleModules, action.id]}
    ));
  }

  renameModule(id, name) {
    this.props.dispatch(renameModule(id, name));
  }

  determineModulesPerRow(wrappers) {
    let modulesPerRow = 0;
    wrappers = [...wrappers];
    for (let i = 0; i < wrappers.length; i++) {
      const wrapper = wrappers[i];
      const modulesAtSameHeight = DOMMath.elementsAtSameHeight(wrappers, wrapper);
      if (modulesAtSameHeight.length > modulesPerRow) {
        modulesPerRow = modulesAtSameHeight.length;
      }
    }
    this.setState({modulesPerRow});
  }

  getPositionOnRow(wrapper) {
    const modulesAtSameHeight = DOMMath.elementsAtSameHeight(wrapper.parentNode.children, wrapper);
    const modulesLeft = DOMMath.elementsLeftOf(modulesAtSameHeight, wrapper);
    return modulesLeft.length;
  }

  getNumberOfModulesOnSameRow(wrapper) {
    return DOMMath.elementsAtSameHeight(wrapper.parentNode.children, wrapper).length;
  }

  moveVisible(id, n) {
    const index = this.state.visibleModules.indexOf(id);
    this.setState((prevState) => {
      prevState.visibleModules.splice(
        index + n, 0, prevState.visibleModules.splice(index, 1)[0]
      );
      return {visibleModules: prevState.visibleModules};
    });
  }

  moveToBeginningOfRow(wrapper, id) {
    const positionOnRow = this.getPositionOnRow(wrapper);
    const offset = -1 * positionOnRow;
    if (positionOnRow > 0) {
      this.moveVisible(id, offset);
    }
  }

  adjustModulesOnOpen(wrapper, id) {
    const i = this.state.visibleModules.indexOf(id);
    const numberOfModulesOnSameRow = this.getNumberOfModulesOnSameRow(wrapper);
    this.state.visibleModules.forEach(key => {
      const j = this.state.visibleModules.indexOf(key);
      if (j > i && this.props.modulesById[key].isOpen) {
        this.moveVisible(key, -1 * (numberOfModulesOnSameRow - 1));
      }
    });
  }

  adjustModulesOnClose(id) {
    const i = this.state.visibleModules.indexOf(id);
    let n = 0;
    this.state.visibleModules.forEach(key => {
      const j = this.state.visibleModules.indexOf(key);
      if (j > i && this.props.modulesById[key].isOpen) {
        this.moveVisible(key, (i - j) % 5 + n);
        n++;
      }
    });
  }

  sortClosedModules() {
    const closedModules = this.props.modules.filter(el => (
      !this.props.modulesById[el].isOpen
    ));
    this.setState((prevState) => {
      const visibleModules = [];
      prevState.visibleModules.forEach((el, i) => {
        if (this.props.modulesById[el].isOpen) {
          visibleModules.push(el);
        } else {
          const nextClosedModule = closedModules.shift();
          visibleModules.push(nextClosedModule);
        }
      });
      return {visibleModules};
    });
  }

  onOpen(wrapper, id) {
    this.determineModulesPerRow(wrapper.parentNode.children);
    this.props.dispatch(toggleExpandModule(id));
    this.moveToBeginningOfRow(wrapper, id);
    this.adjustModulesOnOpen(wrapper, id);
  }

  onClose(wrapper, id) {
    this.props.dispatch(toggleExpandModule(id));
    this.props.modulesById[id].isOpen = false;
    this.adjustModulesOnClose(id);
    this.sortClosedModules();
  }

  onSourceChange(id, file) {
    this.props.dispatch(setSource(id, file));
  }

  onWiden(width) {
    if (width > this.state.widestPlaylist) {
      this.setState({widestPlaylist: width});
    }
  }

  onUnroute(source, destination) {
    this.props.dispatch(unroute(source, destination));
  }

  highlightAvailableDestinations(source) {
    const highlighted = {};
    this.props.modules.forEach(id => {
      const destination = this.props.modulesById[id];
      highlighted[id] = (
        source !== 0 &&
        id !== source &&
        destination.sources.indexOf(source) === -1 &&
        destination.destinations.indexOf(source) === -1
      );
    });
    this.setState({highlighted});
  }

  stopHighlighting() {
    const highlighted = {};
    for (let key in this.state.highlighted) {
      highlighted[key] = false;
    }
    this.setState({highlighted});
  }

  onMouseDown(id) {
    this.setState({draggingId: id});
  }

  onMouseMove() {
    if (this.state.draggingId !== -1) {
      this.highlightAvailableDestinations(this.state.draggingId);
    }
  }

  onMouseUp(id) {
    const draggingId = this.state.draggingId;
    if (draggingId !== -1 && draggingId !== id) {
      this.props.dispatch(route(draggingId, id));
      this.setState({draggingId: -1});
    }
  }

  render() {
    const modulesList = this.state.visibleModules.map(key => (
      this.props.modulesById[key]
    ));

    const modules = modulesList.map(el => {
      const destinationModules = el.destinations.map(id => (
        this.props.modulesById[id]
      ));
      return (
        <Module
          key={el.id}
          isHighlighted={this.state.highlighted ? this.state.highlighted[el.id] : false}
          module={el}
          onOpen={this.onOpen}
          onClose={this.onClose}
          onSourceChange={this.onSourceChange}
          onWiden={this.onWiden}
          playlistWidth={this.state.widestPlaylist}
          song={this.props.song}
          destinationModules={destinationModules}
          onUnroute={this.onUnroute}
          onRouteMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onRename={this.renameModule}
        />
      );
    });

    return (
      <div className="modules">
        {modules}
        <div className="create" onClick={this.createModule}></div>
        <HiddenModule/>
        <HiddenModule/>
        <HiddenModule/>
        <HiddenModule/>
      </div>
    );
  }
});
