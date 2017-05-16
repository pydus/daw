'use strict';
import './styles/style.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';

export const ctx = new AudioContext();

const store = createStore(
  reducers,
  applyMiddleware(thunkMiddleware)
);

ReactDOM.render(
  <Root store={store}/>,
  document.getElementById('root')
);
