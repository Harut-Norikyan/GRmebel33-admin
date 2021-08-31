import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Auxiliary from '../../User/Components/Auxiliary';
import CloseSvg from '../../User/Images/Svg/CloseSvg';
import ThreeLinesSvg from '../../User/Images/Svg/ThreeLinesSvg';

class LeftSiteBar extends Component {

  state = {
    user: null || JSON.parse(localStorage.getItem("user")),
    isShowLeftMenu: false
  }

  ucFirst = (str) => {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
  }

  redirectToHome = () => {
    this.setState({ isShowLeftMenu: false })
    this.props.history.push("/gr-admin/home");
  }

  showOrHideLeftMenu = (bool) => {
    this.setState({ isShowLeftMenu: bool })
  }

  logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.props.history.push("/gr-admin");
  }

  render() {
    const { user, isShowLeftMenu } = this.state;
    return (
      user &&
      <Auxiliary>
        <div className="three-lines-svg" onClick={() => this.showOrHideLeftMenu(true)}>
          <ThreeLinesSvg />
        </div>
        {
          isShowLeftMenu ?
            <div className="left-layer" onClick={() => this.showOrHideLeftMenu(false)} />
            : null
        }
        <div className={`container-left ${isShowLeftMenu ? "show-left-menu" : ""}`}>
          {
            isShowLeftMenu ?
              <div className="close-svg" onClick={() => this.showOrHideLeftMenu(false)}>
                <CloseSvg />
              </div>
              : null
          }
          <div className="img-block" onClick={() => this.redirectToHome()}>
            <p>{user.firstName.slice(0, 1).toUpperCase()}</p>
            <p>{user.lastName.slice(0, 1).toUpperCase()}</p>
          </div>
          <span className="name">
            <p>{this.ucFirst(user.firstName)} {this.ucFirst(user.lastName)}</p>
          </span>
          <div className="line" />
          {/* <Link to="/gr-admin/home" onClick={() => this.showOrHideLeftMenu(false)}>Главная</Link>
          <div className="line" /> */}
          <Link to="/" onClick={() => this.showOrHideLeftMenu(false)}>GR mebel</Link>
          <div className="line" />
          <Link to="/gr-admin/product" onClick={() => this.showOrHideLeftMenu(false)}>Добавить товар</Link>
          <div className="line" />
          <Link to="/gr-admin/all-products" onClick={() => this.showOrHideLeftMenu(false)}>Товары</Link>
          <div className="line" />
          <Link to="/gr-admin/categories" onClick={() => this.showOrHideLeftMenu(false)}>Категории</Link>
          <div className="line" />
          <Link to="/gr-admin/colors" onClick={() => this.showOrHideLeftMenu(false)}>Цвета</Link>
          <div className="line" />
          <Link to="/gr-admin/about-us" onClick={() => this.showOrHideLeftMenu(false)}>О нас</Link>
          <div className="line" />
          <Link to="/gr-admin/change-prices" onClick={() => this.showOrHideLeftMenu(false)}>Изменить цены</Link>
          <div className="line" />
          <button type="button" className="logout-button" onClick={this.logOut}>Выход</button>
        </div>
      </Auxiliary>
    );
  }
}

export default withRouter(LeftSiteBar);