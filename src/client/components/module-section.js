'use strict';
import React from 'react';
import Module from './module';
import Effect from './effect';
import HiddenModule from './hidden-module';
import DOMMath from './dom-math';
import {connect} from 'react-redux';
import {MAX_ROUTES} from '../settings';
import {
  createModule,
  toggleExpandModule,
  moveModule,
  removeModule,
  cut,
  route,
  setBeats
} from '../actions';

export default connect((state) => ({
  modules: state.modules.modules,
  modulesById: state.modules.modulesById,
  song: state.song
}))(class ModuleSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draggingId: -1,
      highlighted: {},
      modulesPerRow: 0,
      visibleModules: [...this.props.modules],
      segmentDuration: 500,
      scrollLeft: 0
    };
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.createModule = this.createModule.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onOpenEffect = this.onOpenEffect.bind(this);
    this.onViewChange = this.onViewChange.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.song.position === this.props.song.position ||
      nextProps.song.position === nextProps.song.savedPosition;
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
        this.moveVisible(key, (i - j) % this.state.modulesPerRow + n);
        n++;
      }
    });
  }

  sortClosedModules() {
    const closedModules = this.props.modules.filter(id => (
      !this.props.modulesById[id].isOpen && this.props.modulesById[id].openEffect === -1
    ));
    this.setState((prevState) => {
      const visibleModules = [];
      prevState.visibleModules.forEach(id => {
        if (this.props.modulesById[id].isOpen || this.props.modulesById[id].openEffect !== -1) {
          visibleModules.push(id);
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
    if (this.props.modulesById[id].openEffect === -1) {
      this.sortClosedModules();
    }
  }

  isActive(id) {
    return this.props.modulesById[id].isOpen ||
      this.props.modulesById[id].openEffect !== -1;
  }

  adjustModulesOnOpenEffect(id, additionalOffset, close) {
    let i = this.state.visibleModules.indexOf(id) + additionalOffset;
    i = (i < 0) ? 0 : i;

    const ns = [];

    this.state.visibleModules.forEach((key, j) => {
      if (j <= i) return false;
      if (this.isActive(key)) {
        let n = 2 * (close ? 1 : -1);
        n = (j + n <= i) ? 0 : n;
        if (close) {
          if (j + n >= this.state.visibleModules.length - 1) {
            for (let k = j + 1; k < this.state.visibleModules.length; k++) {
              if (this.isActive(this.state.visibleModules[k])) {
                n -= k - j + 1;
              }
            }
          }
          ns.push({id: key, n});
        } else {
          this.moveVisible(key, n);
        }
      }
    });

    for (let j = ns.length - 1; j >= 0; j--) {
      if (
        !this.props.modulesById[id].isOpen ||
        !this.props.modulesById[ns[j].id].isOpen
      ) {
        this.moveVisible(ns[j].id, ns[j].n);
      }
    }
  }

  onOpenEffect(wrapper, id) {
    this.determineModulesPerRow(wrapper.parentNode.children);
    const positionOnRow = this.getPositionOnRow(wrapper);
    let additionalOffset = 0;
    if (this.props.modulesById[id].openEffect === -1) {
      if (this.state.modulesPerRow - positionOnRow < 3) {
        const n = (this.state.modulesPerRow - positionOnRow) === 1 ? -2 : -1;
        this.moveVisible(id, n);
        additionalOffset = n;
      }
      this.adjustModulesOnOpenEffect(id, additionalOffset, false);
    } else {
      this.props.modulesById[id].openEffect = -1;
      this.adjustModulesOnOpenEffect(id, additionalOffset, true);
      this.sortClosedModules();
    }
  }

  highlightAvailableDestinations(source) {
    const highlighted = {};
    if (this.props.modulesById[source].destinations.length < MAX_ROUTES) {
      this.props.modules.forEach(id => {
        const destination = this.props.modulesById[id];
        highlighted[id] = (
          source !== 0 &&
          id !== source &&
          destination.sources.indexOf(source) === -1 &&
          destination.destinations.indexOf(source) === -1
        );
      });
    }
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

  onViewChange(view) {
    this.setState(view);
  }

  render() {
    const modulesList = this.state.visibleModules.map(key => (
      this.props.modulesById[key]
    ));

    const {segmentDuration, scrollLeft} = this.state;

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
          destinationModules={destinationModules}
          onRouteMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onOpenEffect={this.onOpenEffect}
          song={this.props.song}
          view={{segmentDuration, scrollLeft}}
          onViewChange={this.onViewChange}
          dispatch={this.props.dispatch}
        />
      );
    });

    const modulesAndEffects = [];

    for (let i = 0; i < modulesList.length; i++) {
      modulesAndEffects.push(modules[i]);
      const openEffect = modulesList[i].openEffect;
      if (openEffect !== -1) {
        modulesAndEffects.push(
          <div className="effect" key={-1 * i - 1}>
            <Effect
              key={openEffect}
              id={modulesList[i].id}
              index={openEffect}
              effect={modulesList[i].effects[openEffect]}
            />
          </div>
        );
      }
    }

    return (
      <div className={`modules ${this.props.song.isPlaying ? 'playing' : ''}`}>
        {modulesAndEffects}
        <div className="create" onClick={this.createModule}></div>
        <HiddenModule/>
        <HiddenModule/>
        <HiddenModule/>
        <HiddenModule/>
        <HiddenModule/>
        <HiddenModule/>
        <HiddenModule/>
      </div>
    );
  }
});
