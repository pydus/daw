'use strict';
import './styles/style.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import { createStore } from 'redux';
import reducers from './reducers';

const store = createStore(reducers);

ReactDOM.render(
  <Root store={store}/>,
  document.getElementById('root')
);
