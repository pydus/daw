'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Signup from './signup';
import Login from './login';

const EffectSection = () => {
  return(
    <div className="effects">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

class Module extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isOpen: false};
    this.toggle = this.toggle.bind(this);
  }

  toggle(e) {
    if (e.target.className === 'square' || e.target.tagName === 'H1') {
      this.setState((prevState, props) => {
        return {isOpen: prevState.isOpen ? false : true};
      });
    }
  }

  render() {
    return(
      <div className={'wrapper ' + (this.state.isOpen ? 'open' : '')}>
        <div className="playlist"></div>
        <div className="module" onClick={this.toggle}>
          <div className="volume"></div>
          <div className="square">
            <h1>{this.props.name}</h1>
            <EffectSection/>
          </div>
        </div>
      </div>
    );
  }
};

const ModuleSection = () => {
  return (
    <div className="modules">
      <Module name="Master"/>
      <Module name="A Test Module"/>
      <Module name="Guitar"/>
      <Module name="Vocals"/>
      <Module name="Effects"/>
      <div className="create"></div>
    </div>
  );
};

const SongPosition = () => {
  return (
    <div className="song-position">
      <div className="bar">
        <div className="position"></div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <main>
      <SongPosition/>
      <ModuleSection/>
    </main>
  );
};

const NoMatch = () => {
  return (
    <div>
      <h1>404 Nope, this isn't it</h1>
      <p>You're looking for something, but this isn't it.</p>
    </div>
  );
};

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={App}/>
      <Route path="/signup" component={Signup}/>
      <Route path="/login" component={Login}/>
      <Route path="*" component={NoMatch}/>
    </Switch>
  </Router>,
  document.getElementById('root')
);
