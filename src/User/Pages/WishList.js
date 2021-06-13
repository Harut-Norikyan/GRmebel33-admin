import React, { Component } from 'react'
import { Redirect } from 'react-router';
import Api from '../../Api';
import { connect } from "react-redux";
import { addPageSpinner, removePageSpinner } from "../../store/actions/spinner";
import uuid from 'react-uuid';
import AlertService from '../../Services/AlertService';
import { getImageUrl } from '../..';
import Auxiliary from '../Components/Auxiliary';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import WishListSettings from '../../Services/WishListSettings';
import { addProductToWishList, removeProductFromWishList } from "../../store/actions/products";

class WishList extends Component {

  state = {
    categoryName: "Избранные",
    productIds: [],
    showProductsCount: 8,
    products: [],
    showLargePhoto: false,
    largeImgPath: null
  }

  componentDidMount() {
    this.getProductIdsWithStorage();
  }

  getProductIdsWithStorage = () => {
    const productsIds =
      localStorage.getItem("products") ?
        JSON.parse(localStorage.getItem("products")) : null;
    productsIds && productsIds.length && this.getProductsByIds(productsIds);
  }

  enlargephoto = (image) => {
    this.setState({ showLargePhoto: true, largeImgPath: image });
  }

  hideLargePhoto = () => {
    this.setState({ showLargePhoto: false, largeImgPath: "" });
  }

  getProductsByIds = (productIds) => {
    const spinnerId = uuid();
    this.props.addPageSpinner(spinnerId);
    Api.getProductsByIds(productIds).then(response => {
      this.props.removePageSpinner(spinnerId);
      if (response.data?.products) {
        const products = [...response.data?.products];
        products && this.setState({ products: response.data?.products }, () => {
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
          product.isWishlist = true
        }
      })
    })
    this.setState({ products });
  }

  removeProductFromWishList = (event, id) => {
    event.stopPropagation();
    WishListSettings.addOrRemoveProductFromWishList(id).then(() => {
      const products = localStorage.getItem("products");
      this.props.removeProductFromWishList(JSON.parse(products).length);
      this.changeCurrentProductWishListStatus(id);
    });
  }

  changeCurrentProductWishListStatus = (id) => {
    var products = [...this.state.products];
    if (!id || !products) return;
    products = products.filter(product => product._id !== id);
    this.setState({ products });
  }

  getFail = (error, spinnerId) => {
    error && AlertService.alert("error", error);
    spinnerId && this.props.removePageSpinner(spinnerId)
  }

  render() {
    const { products, categoryName, showProductsCount, largeImgPath, showLargePhoto } = this.state;

    if (!localStorage.getItem("products") || !JSON.parse(localStorage.getItem("products")).length) {
      return <Redirect to="/" />
    };

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
        <div className="container">
          <section className="section filter-section">
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
                <div className="col-12">
                  <div className="product-list item-slider justify-content-center">
                    {
                      products.length ? products.map((product, index) => {
                        return (showProductsCount > index) ? <div key={product._id} className="card-item">
                          <div className="card product-wrpper">
                            <div className="item-image" style={{ backgroundImage: `url(${getImageUrl}/${JSON.parse(product.images)[0]})` }}>
                              <div className="product-settings">
                                <i className="fas fa-search-plus" onClick={() => this.enlargephoto(`${getImageUrl}/${JSON.parse(product.images)[0]}`)}></i>
                                <i
                                  className={`fas fa-heart ${product.isWishlist ? "active-heart" : ""}`}
                                  onClick={(event) => this.removeProductFromWishList(event, product._id)}
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
                                        {`${product.newPrice} руб.`}
                                      </p>
                                      <p className="item-price old-price">
                                        {
                                          product.minPrice ? <span className="m-0">от </span> : null
                                        }
                                        {`${product.price} руб.`}
                                      </p>
                                    </Auxiliary>
                                    :
                                    <Auxiliary>
                                      <p className="item-price new-price">
                                        {
                                          product.minPrice ? <span className="m-0">от </span> : null
                                        }
                                        {`${product.price} руб.`}
                                      </p>
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
                          onClick={() => this.setState({ showProductsCount: showProductsCount + 8 })}
                        >
                          посмотреть больше
                    </button>
                      </div> : null
                  }
                </div>
              </div>
            </div>
          </section>
        </div>
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

export default connect(null, mapDispatchToProps)(WishList)
