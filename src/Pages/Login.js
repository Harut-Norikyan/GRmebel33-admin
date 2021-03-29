import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { login } from "../store/actions/users";

class Login extends Component {
  state = {
    email: '',
    password: '',
    errorMessage: ''
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  submit = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    this.props.login(email, password);
  }

  render() {
    if (localStorage.getItem("token")) {
      return <Redirect to="/home" />
    }
    return (
      <div>
        <form onSubmit={this.submit}>
          <div className="segment">
            <h1>Вход</h1>
          </div>
          <label>
            <input
              className="authInput"
              type="email"
              name="email"
              placeholder="Электронная почта"
              onChange={this.onChange}
            />
          </label>
          <label>
            <input
              className="authInput"
              type="password"
              name="password"
              placeholder="Пароль"
              onChange={this.onChange}
            />
          </label>
          <button
            className="authButton red"
            type="submit"
          >Войти</button>
          {
            this.props.errorMessage && <small className="errorText">Неверная электронная почта или пароль.</small>
          }
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.users.user,
  errorMessage: state.users.errorMessage,
})

const mapDispatchToProps = {
  login,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
