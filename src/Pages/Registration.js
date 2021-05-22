import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import AlertService from '../Services/AlertService';
import { registration } from "../store/actions/users"

class Registration extends Component {

  state = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: ''
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  submit = (event) => {
    event.preventDefault();
    const { firstName, lastName, email, password } = this.state;
    this.props.registration(firstName, lastName, email, password);
  }

  render() {
    if (this.props.user) {
      AlertService.alert("success", "Пользователь успешно добавлен");
      return <Redirect to="/gr-admin/home" />
    }
    return (
      <div className="auth">
        <form onSubmit={this.submit}>
          <div className="segment">
            <h1>Регистрация</h1>
          </div>
          <label>
            <input
              className="authInput"
              type="text"
              name="firstName"
              placeholder="Имя"
              onChange={this.onChange}
            />
          </label>
          <label>
            <input
              className="authInput"
              type="text"
              name="lastName"
              placeholder="Фамилия"
              onChange={this.onChange}
            />
          </label>
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
          <label>
            <input
              className="authInput"
              type="password"
              name="repeatPassword"
              placeholder="Повторите пароль"
              onChange={this.onChange}
            />
          </label>
          <button className="red authButton" type="submit">Зарегистрироваться</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.users.user
})

const mapDispatchToProps = {
  registration,
}

export default connect(mapStateToProps, mapDispatchToProps)(Registration)
