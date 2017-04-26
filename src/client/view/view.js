'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Signup from './signup';
import Login from './login';
import ModuleSection from './module-section';

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
