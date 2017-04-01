'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Signup from './signup';
import Login from './login';

const Module = (props) => {
  return(
    <div className="module">
      <div className="volume"></div>
      <div className="square">
        <h1>{props.name}</h1>
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
      </div>
    </div>
  );
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
