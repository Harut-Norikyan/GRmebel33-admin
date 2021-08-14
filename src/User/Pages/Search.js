import React, { Component } from 'react';
import { searchProduct } from "../../store/actions/products";
import { connect } from "react-redux";
import { getImageUrl } from '../..';
import { Link, Redirect } from 'react-router-dom';
import Auxiliary from '../Components/Auxiliary';
import { Helmet } from 'react-helmet';

const TITLE = 'GR-mebel';

class Search extends Component {

  state = {
    showProductsCount: 6,
    showLargePhoto: false,
    largeImgPath: null
  }

  enlargephoto = (event, image) => {
    event.stopPropagation();
    this.setState({ showLargePhoto: true, largeImgPath: image });
  }

  hideLargePhoto = () => {
    this.setState({ showLargePhoto: false, largeImgPath: "" });
  }

  redirectToProductPage = (event, id) => {
    this.props.history.push(`/product/${id}`)
  }

  render() {
    const { showProductsCount, showLargePhoto, largeImgPath } = this.state;
    const { findedProducts, requestStatus } = this.props;

    if (!findedProducts.length && (requestStatus === "success" || requestStatus === "fail" || !requestStatus)) {
      return <Redirect to="/" />
    }

    return (
      findedProducts.length ?
        <section className="section answers-block">
          <Helmet>
            <title>{TITLE}</title>
          </Helmet>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section-title">
                  <h1>Результаты поиска</h1>
                </div>
              </div>
              <div>
                {
                  (showLargePhoto && largeImgPath) ?
                    <div onClick={this.hideLargePhoto}>
                      <div className="large-image-layer" />
                      <div className="large-photo" style={{ backgroundImage: `url(${largeImgPath})` }}>
                      </div>
                    </div>
                    : null
                }
                <div className="product-list item-slider">
                  {
                    findedProducts.map((product, index) => {
                      return (showProductsCount > index) ? <div key={product._id} className="card-item">
                        <div className="card product-wrpper">
                          <div
                            className="item-image"
                            style={{ backgroundImage: `url(${getImageUrl}/${JSON.parse(product.images)[0]})` }}
                            onClick={(event) => this.redirectToProductPage(event, product._id)}
                          >
                            <div className="product-settings">
                              <i className="fas fa-search-plus" onClick={(event) => this.enlargephoto(event, `${getImageUrl}/${JSON.parse(product.images)[0]}`)}></i>
                              <i className="fas fa-heart"></i>
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
                            <p title={product.description}>{product.description}</p>
                            <Link to={`/product/${product._id}`} className="btn btn-primary my-2">Перейти</Link>
                          </div>
                        </div>
                      </div> : null
                    })
                  }
                </div>
                {
                  findedProducts && (findedProducts.length > showProductsCount)
                    ? <div className="col-12">
                      <button
                        type="button"
                        className="btn btn-primary mx-0 my-3 w-100"
                        onClick={() => this.setState({ showProductsCount: showProductsCount + 6 })}
                      >
                        посмотреть больше
                      </button>
                    </div> : null
                }
              </div>
            </div>
          </div>
        </section>
        : null
    )
  }
}

const mapStateToProps = state => ({
  findedProducts: state.products.findedProducts,
  requestStatus: state.products.requestStatus,
})

const mapDispatchToProps = {
  searchProduct
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
