'use strict';
import React from 'react';

export default class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: '', password: ''};
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.submit();
    }
  }

  submit() {
    this.props.onSubmit(this.state.username, this.state.password);
    this.setState({username: '', password: ''});
  }

  render() {
    return (
      <div className="user-form">
        <input placeholder="Username"
          value={this.state.username}
          onChange={this.handleUsernameChange}
          onKeyPress={this.handleKeyPress}
        />
        <input placeholder="Password"
          value={this.state.password}
          onChange={this.handlePasswordChange}
          onKeyPress={this.handleKeyPress}
        />
        <button onClick={this.submit}>Sign Up</button>
      </div>
    );
  }
}
