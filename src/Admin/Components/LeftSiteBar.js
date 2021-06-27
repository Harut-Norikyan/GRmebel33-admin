import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

class LeftSiteBar extends Component {

  state = {
    user: null || JSON.parse(localStorage.getItem("user")),
  }

  ucFirst = (str) => {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
  }

  redirectToHome = () => {
    this.props.history.push("/gr-admin/home");
  }

  logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.props.history.push("/gr-admin");
  }

  render() {
    const { user } = this.state;
    return (
      user &&
      <div className="container-left">
        <div className="img-block" onClick={() => this.redirectToHome()}>
          <p>{user.firstName.slice(0, 1).toUpperCase()}</p>
          <p>{user.lastName.slice(0, 1).toUpperCase()}</p>
        </div>
        <span className="name">
          <p>{this.ucFirst(user.firstName)} {this.ucFirst(user.lastName)}</p>
        </span>
        <div className="line" />
        <Link to="/gr-admin/home">Главная</Link>
        <div className="line" />
        <Link to="/gr-admin/product">Добавить продукт</Link>
        <div className="line" />
        <Link to="/gr-admin/all-products">Продукты</Link>
        <div className="line" />
        <Link to="/gr-admin/categories">Категории</Link>
        <div className="line" />
        <Link to="/gr-admin/colors">Цвета</Link>
        <div className="line" />
        <Link to="/gr-admin/about-us">О нас</Link>
        <div className="line" />
        <button type="button" className="logout-button" onClick={this.logOut}>Выход</button>
      </div>
    );
  }
}

export default withRouter(LeftSiteBar);