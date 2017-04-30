'use strict';
import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Signup from './signup';
import Login from './login';
import ModuleSection from './module-section';
import { Provider } from 'react-redux';
import Header from './header';

const App = () => {
  return (
    <main>
      <Header/>
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

const root = ({ store }) => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={App}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/login" component={Login}/>
          <Route path="*" component={NoMatch}/>
        </Switch>
      </Router>
    </Provider>
  );
};

export default root;
