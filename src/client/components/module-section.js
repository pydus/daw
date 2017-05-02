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
      offsets: {}
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
  }

  componentDidMount() {
    this.props.dispatch(createModule('Master'));
    window.addEventListener('mouseup', () => {
      this.stopHighlighting();
      this.setState({draggingId: -1});
    });
    window.addEventListener('mousemove', this.onMouseMove);
  }

  createModule() {
    const action = this.props.dispatch(createModule());
    this.props.dispatch(route(action.id, 0));
  }

  onOpen(module, id) {
    this.props.dispatch(toggleExpandModule(id));
    const modulesAtSameHeight = DOMMath.elementsAtSameHeight(module.parentNode.children, module);
    const modulesLeft = DOMMath.elementsLeftOf(modulesAtSameHeight, module);
    const offset = -1 * modulesLeft.length;
    if (modulesLeft.length > 0) {
      this.props.dispatch(moveModule(id, offset));
      this.setState((prevState) => {
        prevState.offsets[id] = offset;
        return {offsets: prevState.offsets};
      });
    }
  }

  onClose(module, id) {
    this.props.dispatch(toggleExpandModule(id));
    const offset = this.state.offsets[id];
    if (offset && offset !== 0) {
      this.props.dispatch(moveModule(id, -1 * offset));
      this.setState((prevState) => {
        prevState.offsets[id] = 0;
        return {offsets: prevState.offsets};
      });
    }
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
    const modulesList = this.props.modules.map(key => (
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
