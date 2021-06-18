import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import logoWhite1 from "../Images/logo-white-1.png"
import { searchProduct } from "../../store/actions/products";
import { compose } from 'redux';
import PromiseService from '../../Services/Promise';
import Auxiliary from './Auxiliary';
import AlertService from '../../Services/AlertService';
import leftArrow from "../Images/left-arrow (1).png";


class Header extends Component {

  state = {
    isShowTopSubHeader: false,
    IsShowSubHeader: false,
    text: "",
    sticky: ""
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }


  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value, isinvalidSubmit: false })
  }

  handleScroll = () => {
    const { sticky } = this.state;
    const top = Math.max(document.getElementsByTagName('html')[0].scrollTop, document.body.scrollTop);
    if (top > 10 && !sticky) {
      this.setState({
        sticky: true,
      });
    } else if (top <= 10 && sticky) {
      this.setState({
        sticky: false,
      });
    }
  };

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

  isShowHideTopSubHeader = () => {
    const { isShowTopSubHeader } = this.state;
    this.setState({
      isShowTopSubHeader: !isShowTopSubHeader
    })
  }

  goBack = () => {
    window.history.back();
  }

  render() {
    const { isShowSubHeader, isinvalidSubmit, text, isShowTopSubHeader, sticky } = this.state;
    const { categories, wishListProductsCount } = this.props;

    var wishListProductsCountWithStorage = [];
    if (localStorage.getItem("products")) {
      wishListProductsCountWithStorage = JSON.parse(localStorage.getItem("products"))
    }

    return (
      <header className={`show-sub-header ${!isShowTopSubHeader ? "show-sub-header" : "hide-sub-header"}`}>
        <nav
          className={`
          navbar
          navbar-expand-lg
          navbar-light
          dark-background
          justify-content-between
          d-flex
          top-nav show-subheader 
          ${sticky ? "sticky" : ""}
          `}
        >
          <div className="d-flex align-items-center">
            {
              this.props.location.pathname.includes("category") ||
                this.props.location.pathname.includes("categories") ||
                this.props.location.pathname.includes("wish-list") ||
                this.props.location.pathname.includes("product") ?
                <div className="go-back" onClick={this.goBack}><img src={leftArrow} alt="/" /></div>
                : null
            }
            <Link className="navbar-brand my-1" to="/"><img src={logoWhite1} alt="#" /></Link>
          </div>
          <div className="contact-information my-1">
            <div className="contact-phone">
              <i className="fas fa-phone-square-alt"></i>
              <a className="header-footer-phone-number" href="tel:+79018888879">+7 901 888 88 79</a>
            </div>

            {
              wishListProductsCountWithStorage.length || wishListProductsCount ?
                <Auxiliary>
                  {/* <span className="heart-line">|</span> */}
                  <Link
                    to={(wishListProductsCountWithStorage.length || wishListProductsCount) ? "/wish-list" : "#"}
                    className="wish-list ml-3"
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

          <div className="show-more" onClick={this.isShowHideTopSubHeader}>
            <i className={`fas fa-chevron-down ${!isShowTopSubHeader ? "fa-chevron-down" : "fa-chevron-up"}`}></i>
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
            <nav id="menu-navbar" className="navbar navbar-expand-lg navbar-light bg-light menu-navbar">
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

