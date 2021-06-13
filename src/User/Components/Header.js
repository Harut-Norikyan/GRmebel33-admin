import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import logoWhite1 from "../Images/logo-white-1.png"
import { searchProduct } from "../../store/actions/products";
import { compose } from 'redux';
import PromiseService from '../../Services/Promise';
import Auxiliary from './Auxiliary';
import AlertService from '../../Services/AlertService';


class Header extends Component {

  state = {
    isShowSubHeader: false,
    text: "",
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value, isinvalidSubmit: false })
  }

  onSubmit = (event) => {
    event.preventDefault();
    let { text } = this.state;
    if (!text) {
      this.setState({ isinvalidSubmit: true });
    } else {
      if (text.length > 20) {
        AlertService.alert("warning", "Ничего не найдено");
        this.setState({ text: "" })
      } else {
        text = text.split(" ");
        this.props.searchProduct(text);
        this.props.history.push("/search")
        this.setState({ text: '' });
      }
    }
  }

  showSubHeader = () => {
    this.setState({ isShowSubHeader: !this.state.isShowSubHeader })
  }

  sendCategoryName = (categoryName, id) => {
    PromiseService.storageSetItem("categoryName", categoryName).then(() => {
      this.props.history.push(`/category/${id}`)
    })
  }

  render() {
    const { isShowSubHeader, isinvalidSubmit, text } = this.state;
    const { categories, wishListProductsCount } = this.props;

    var wishListProductsCountWithStorage = [];
    if (localStorage.getItem("products")) {
      wishListProductsCountWithStorage = JSON.parse(localStorage.getItem("products"))
    }

    return (
      <header>
        <nav className="navbar navbar-expand-lg navbar-light dark-background justify-content-between d-flex">
          <Link className="navbar-brand my-1" to="/"><img src={logoWhite1} alt="#" /></Link>
          <div className="contact-information my-1">
            <div className="contact-phone">
              <i className="fas fa-phone-square-alt"></i>
              <p>+7 901 888 88 79</p>
            </div>
            {
              wishListProductsCountWithStorage.length || wishListProductsCount ?
                <Auxiliary>
                  <span>|</span>
                  <Link
                    to={(wishListProductsCountWithStorage.length || wishListProductsCount) ? "/wish-list" : "#"}
                    className="wish-list"
                  >
                    <i className="fas fa-heart"></i>
                    {
                      (wishListProductsCount || wishListProductsCountWithStorage.length) ?
                        <span>
                          {
                            wishListProductsCount
                              ?
                              wishListProductsCount
                              :
                              wishListProductsCountWithStorage.length
                                ?
                                wishListProductsCountWithStorage.length
                                : null
                          }</span>
                        : null
                    }
                  </Link>
                </Auxiliary>
                : null
            }
          </div>
          <form className="form-inline my-1 d-flex" onSubmit={this.onSubmit}>
            <input
              className={`form-control mx-2 ${isinvalidSubmit && !text ? "error" : ""}`}
              type="search"
              placeholder="Поиск"
              aria-label="Search"
              name="text"
              autoComplete="off"
              value={text}
              onChange={this.onChange}
            />
            <button className="btn btn-success search" type="submit">Поиск</button>
          </form>
        </nav>
        {
          categories ?
            <nav id="menu-navbar" className="navbar navbar-expand-lg navbar-light bg-light">
              <div className="container-fluid">
                <Link to="#">{'\u00A0'}</Link>
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={this.showSubHeader}
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${isShowSubHeader ? "show" : ""}`} id="navbarNavAltMarkup">
                  <ul className="navbar-nav">
                    {
                      categories.map(category => {
                        return <li key={category._id} className="nav-item active" onClick={this.showSubHeader}>
                          <Link
                            to="#"
                            className="nav-link"
                            onClick={() => this.sendCategoryName(category.categoryName, category._id)}
                          >
                            {category.categoryName}
                          </Link>

                        </li>
                      })
                    }
                  </ul>
                </div>
              </div>
            </nav>
            : null
        }
      </header >
    );
  }
}

const mapStateToProps = state => ({
  categories: state.categories.categories,
  findedProducts: state.products.findedProducts,
  wishListProductsCount: state.products.wishListProductsCount
})

const mapDispatchToProps = {
  searchProduct
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Header);

