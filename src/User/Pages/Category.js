import React, { Component } from 'react';
import { connect } from "react-redux";
import uuid from 'react-uuid';
import { getImageUrl } from '../..';
import Api from '../../Api';
import AlertService from '../../Services/AlertService';
import { addPageSpinner, removePageSpinner } from "../../store/actions/spinner";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Auxiliary from '../Components/Auxiliary';
import { Link, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { addProductToWishList, removeProductFromWishList } from "../../store/actions/products";
import WishListSettings from '../../Services/WishListSettings';
import { compose } from 'redux';


const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);
class Category extends Component {

  state = {
    categoryId: this.props.match?.params?.id || null,
    allProducts: [],
    products: [],
    showLargePhoto: false,
    largeImgPath: null,
    min: 0,
    minValue: 0,
    max: 100000,
    maxValue: 100000,
    step: 100,
    isShowFilter: false,
    showProductsCount: 4,
  }

  componentDidMount() {
    const { categoryId } = this.state;
    this.getProductByCategoryId(categoryId);
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.setState({ categoryId: this.props.match.params.id }, () => {
        this.getProductByCategoryId(this.state.categoryId);
      });
    }
  }

  enlargephoto = (event, image) => {
    event.stopPropagation();
    this.setState({ showLargePhoto: true, largeImgPath: image });
  }

  hideLargePhoto = () => {
    this.setState({ showLargePhoto: false, largeImgPath: "" });
  }

  onAfterRangeChange = event => {
    const { allProducts } = this.state;
    const filteredProducts = [];
    allProducts && allProducts.forEach(product => {
      if ((!product.newPrice && product.price >= event[0] && product.price <= event[1]) && event[0] < 100000) {
        filteredProducts.push(product);
      }
      if ((product.newPrice && product.newPrice >= event[0] && product.newPrice <= event[1]) && event[0] < 100000) {
        filteredProducts.push(product);
      }
      if (event[1] === 100000 && (product.price || product.newPrice) > event[0]) {
        filteredProducts.push(product);
      }
    })
    this.setState({ products: filteredProducts, minValue: event[0], maxValue: event[1] });
  }

  isShowHideFilter = () => {
    const { allProducts, min, max } = this.state;
    this.setState({ isShowFilter: !this.state.isShowFilter, products: allProducts, minValue: min, maxValue: max });
  }

  getProductByCategoryId = (categoryId) => {
    const spinnerId = uuid();
    this.props.addPageSpinner(spinnerId);
    categoryId && Api.getProductByCategoryId(categoryId).then(response => {
      if (response) {
        this.props.removePageSpinner(spinnerId);
        const products = [...response.data?.products];
        products && this.setState({ allProducts: [...products], products: [...products] }, () => {
          if (localStorage.getItem("products") && products) {
            this.changeWishalistStatus(JSON.parse(localStorage.getItem("products")), products);
          }
        })
      }
    }).catch(error => this.getFail(error, spinnerId));
  }

  changeWishalistStatus(productsIds, products) {
    if (!productsIds || !products) return;
    productsIds.forEach(productId => {
      products.forEach(product => {
        if (productId === product._id) {
          product.isWishlist = true;
        }
      })
    })
    this.setState({ allProducts: products, products })
  }

  addOrRemoveProductFromWishList = (event, id) => {
    event.stopPropagation();
    WishListSettings.addOrRemoveProductFromWishList(id).then(response => {
      if (response) {
        if (localStorage.getItem("products")) {
          const products = localStorage.getItem("products");
          this.props.addProductToWishList(JSON.parse(products).length);
          this.changeCurrentProductWishListStatus(id);
        } else {
          this.props.addProductToWishList(1);
          this.changeCurrentProductWishListStatus(id);
        }
      } else {
        const products = localStorage.getItem("products");
        this.props.removeProductFromWishList(JSON.parse(products).length);
        this.changeCurrentProductWishListStatus(id);
      }
    });
  }

  redirectToProductPage = (id) => {
    this.props.history.push(`/product/${id}`)
  }

  changeCurrentProductWishListStatus = (id) => {
    const products = [...this.state.allProducts];
    if (!id || !products) return;
    products.forEach(product => {
      if (product._id == id) {
        product.isWishlist = !product.isWishlist
      }
    })
    this.setState({ allProducts: products })
  }

  getFail = (message, spinnerId) => {
    AlertService.alert("error", message);
    this.props.removePageSpinner(spinnerId);
  }

  render() {
    const {
      products,
      showLargePhoto,
      largeImgPath,
      min,
      max,
      step,
      minValue,
      maxValue,
      isShowFilter,
      showProductsCount,
      allProducts
    } = this.state;

    var categoryName = localStorage.getItem("categoryName") || null;

    return (

      <Auxiliary>
        {
          categoryName ?
            <Helmet>
              <title>{categoryName}</title>
            </Helmet>
            : null
        }
        {
          (showLargePhoto && largeImgPath) ?
            <div onClick={this.hideLargePhoto}>
              <div className="large-image-layer" />
              <div className="large-photo" style={{ backgroundImage: `url(${largeImgPath})` }} />
            </div>
            : null
        }
        <section className="section filter-section category">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                {
                  categoryName ?
                    <div className="section-title">
                      <h1>{categoryName}</h1>
                      <small>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente blanditiis veniam odio debitis ea veritatis quod nulla quisquam labore quo!</small>
                    </div>
                    : null
                }
              </div>
              <div className="col-lg-3 col-12">
                <div className="filter-wrapper">
                  {
                    isShowFilter ?
                      <form>
                        <div className="col-12 mt-2">
                          <div className="sliderArea">
                            <Range
                              marks={{
                                0: min,
                                1: max
                              }}
                              step={step}
                              min={min}
                              max={max}
                              defaultValue={[min, max]}
                              tipProps={{ visible: true }}
                              onAfterChange={(event) => this.onAfterRangeChange(event)}
                            />
                          </div>
                        </div>
                        <div className="filter-content ">
                          <strong>цена</strong>
                          <div className="form-row">
                            <span className="my-2">{`${minValue} - ${maxValue}${maxValue == max ? "+" : ""} ${'\u00A0'} руб.`}</span>
                          </div>
                        </div>
                      </form>
                      : null
                  }
                  {
                    allProducts.length ?
                      <Auxiliary>
                        <input
                          type="reset"
                          value={!isShowFilter ? "Применить фильтр" : "Очистить фильтр"}
                          className="btn-primary btn w-100 my-3"
                          onClick={this.isShowHideFilter}
                        />
                        {/* <hr /> */}
                      </Auxiliary>
                      : null
                  }
                </div>
              </div>
              <div className="col-lg-9 col-12">
                <div className="product-list item-slider">
                  {
                    products.length ? products.map((product, index) => {
                      return (showProductsCount > index) ? <div key={product._id} className="card-item">
                        <div className="card product-wrpper">
                          <div
                            className="item-image"
                            style={{ backgroundImage: `url(${getImageUrl}/${JSON.parse(product.images)[0]})` }}
                            onClick={() => this.redirectToProductPage(product._id)}
                          >
                            <div className="product-settings">
                              <i className="fas fa-search-plus" onClick={(event) => this.enlargephoto(event, `${getImageUrl}/${JSON.parse(product.images)[0]}`)}></i>
                              <i
                                className={`fas fa-heart ${product.isWishlist ? "active-heart" : ""}`}
                                onClick={(event) => this.addOrRemoveProductFromWishList(event, product._id)}
                              />
                            </div>
                            {
                              product.newPrice ?
                                <p className="product-discount">{`-${Math.floor(100 - (product.newPrice * 100) / product.price)}%`}</p>
                                : null
                            }
                          </div>
                          <div className="card-body text-center">
                            <h5 className="card-text my-2">{product.name}</h5>
                            <div className="rating"><div></div></div>
                            <div className="product-price-wrapper">
                              {
                                product.newPrice ?
                                  <Auxiliary>
                                    <p className="item-price new-price">
                                      {
                                        product.minPrice ? <span className="m-0">от </span> : null
                                      }
                                      {`${product.newPrice} руб.`}</p>
                                    <p className="item-price old-price">
                                      {
                                        product.minPrice ? <span className="m-0">от </span> : null
                                      }
                                      {`${product.price} руб.`}</p>
                                  </Auxiliary>
                                  :
                                  <Auxiliary>
                                    <p className="item-price new-price">
                                      {
                                        product.minPrice ? <span className="m-0">от </span> : null
                                      }
                                      {`${product.price} руб.`}</p>
                                    <p className="item-price new-price m-0">{'\u00A0'}</p>
                                  </Auxiliary>
                              }
                            </div>
                            <hr className="my-2" />
                            <p>{product.description}</p>
                            <Link to={`/product/${product._id}`} className="btn btn-primary my-2">Перейти</Link>
                          </div>
                        </div>
                      </div> : null
                    })
                      : null
                  }
                </div>
                {
                  products && (products.length > showProductsCount)
                    ? <div className="col-12">
                      <button
                        type="button"
                        className="btn btn-primary mx-0 my-3 w-100"
                        onClick={() => this.setState({ showProductsCount: showProductsCount + 4 })}
                      >
                        посмотреть больше
                    </button>
                    </div> : null
                }
              </div>
            </div>
          </div>
        </section>
      </Auxiliary>
    )
  }
}

const mapDispatchToProps = {
  addPageSpinner,
  removePageSpinner,
  addProductToWishList,
  removeProductFromWishList
}

export default compose(
  withRouter,
  connect(null, mapDispatchToProps)
)(Category);

