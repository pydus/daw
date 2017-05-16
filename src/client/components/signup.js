'use strict';
import React from 'react';
import UserForm from './user-form';

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(username, password) { }

  render() {
    return (
      <div>
        <UserForm onSubmit={this.handleSubmit} />
      </div>
    );
  }
}
