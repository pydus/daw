'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import UserForm from './user-form';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(username, password) {

  }

  render() {
    return (
      <div>
        <h1>Log in</h1>
        <UserForm onSubmit={this.handleSubmit} />
      </div>
    );
  }
}
