import React, { Component } from 'react'
import MultiCarousel from "react-multi-carousel";
import Api from '../../Api';
import { connect } from "react-redux";
import { addPageSpinner, removePageSpinner } from "../../store/actions/spinner";
import uuid from 'react-uuid';
import Auxiliary from '../Components/Auxiliary';
import NukaCarousel from 'nuka-carousel';
import { getImageUrl } from '../..';
import { Link } from 'react-router-dom';
import AlertService from '../../Services/AlertService';
import WishListSettings from '../../Services/WishListSettings';
import { addProductToWishList, removeProductFromWishList } from "../../store/actions/products";
import { Helmet } from 'react-helmet';

class Product extends Component {

  state = {
    productId: this.props.match.params.id || null,
    product: null,
    similarProducts: [],
    showLargePhoto: false,
    largeImgPath: null,
  }

  componentDidMount() {
    const { productId } = this.state;
    this.getProductById(productId);
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.setState({ productId: this.props.match.params.id }, () => {
        this.getProductById(this.state.productId);
      });
    }
  }

  shuffle = (a) => {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }

  enlargephoto = (image) => {
    this.setState({ showLargePhoto: true, largeImgPath: image });
  }

  hideLargePhoto = () => {
    this.setState({ showLargePhoto: false, largeImgPath: null });
  }

  getProductById = (productId) => {
    const spinnerId = uuid();
    this.props.addPageSpinner(spinnerId);
    productId && Api.getProductById(productId).then(response => {
      if (response) {
        this.props.removePageSpinner(spinnerId);
        response.data?.product && this.setState({ product: response.data?.product });
        if (JSON.parse(response.data?.product?.categoriesId)) {
          const categodyId = JSON.parse(response.data?.product?.categoriesId)[0].value;
          this.props.addPageSpinner(spinnerId);
          Api.getProductByCategoryId(categodyId).then(response => {
            this.props.removePageSpinner(spinnerId);
            if (response.data?.products) {
              const products = [...response.data?.products];
              const similarProducts = this.shuffle([...products]).splice(0, 10);
              products && this.setState({ similarProducts }, () => {
                if (localStorage.getItem("products") && products) {
                  this.changeWishalistStatus(JSON.parse(localStorage.getItem("products")), products);
                }
              })
            }
          }).catch(error => this.getFail(error, spinnerId));
        }
      }
    }).catch(error => this.getFail(error, spinnerId));
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

  changeCurrentProductWishListStatus = (id, status) => {
    const products = [...this.state.similarProducts];
    if (!id || !products) return;
    products.forEach(product => {
      if (product._id == id) {
        product.isWishlist = !product.isWishlist
      }
    })
    this.setState({ similarProducts: products })
  }

  getFail = (error, spinnerId) => {
    error && AlertService.alert("error", error);
    spinnerId && this.props.removePageSpinner(spinnerId);
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
    this.setState({ similarProducts: products })
  }

  render() {
    const { product, similarProducts, showLargePhoto, largeImgPath } = this.state;

    const responsive = {
      desktop: {
        breakpoint: { max: 3000, min: 1224 },
        items: 5,
        slidesToSlide: 5,
      },
      tablet: {
        breakpoint: { max: 1224, min: 968 },
        items: 4,
        slidesToSlide: 4,
      },
      smallTablet: {
        breakpoint: { max: 968, min: 725 },
        items: 3,
        slidesToSlide: 3,
      },
      mobile: {
        breakpoint: { max: 725, min: 575 },
        items: 3,
        slidesToSlide: 3
      },
      smallMobile: {
        breakpoint: { max: 575, min: 320 },
        items: 2,
        slidesToSlide: 2
      },
      verySmallMobile: {
        breakpoint: { max: 320, min: 0 },
        items: 1,
        slidesToSlide: 1
      }
    };
    return (
      product ? <Auxiliary>
        {
          product ?
            <Helmet>
              <title>{product.name}</title>
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
        <section className="section product">
          <div className="container">
            <div className="row">

              <div className="col-lg-7 col-md-6 col-12">
                <div className="product-gallery-wrapper">
                  <NukaCarousel
                    renderCenterLeftControls={({ previousSlide }) => (
                      <i className="fas fa-chevron-left product-slider-arrows ml-2" onClick={previousSlide} />
                    )}
                    renderCenterRightControls={({ nextSlide }) => (
                      <i className="fas fa-chevron-right product-slider-arrows mr-2" onClick={nextSlide} />
                    )}
                    wrapAround={true}
                  >
                    {
                      product && JSON.parse(product.images) ?
                        JSON.parse(product.images).map(imagePath => {
                          return <div key={product._id} >
                            <div
                              className="product-slider"
                              style={{ backgroundImage: `url(${`${getImageUrl}/${imagePath}`})` }}
                              onClick={() => this.enlargephoto(`${`${getImageUrl}/${imagePath}`}`)}
                            ></div>
                          </div>
                        })
                        : null
                    }
                  </NukaCarousel>
                </div>
              </div>
              <div className="col-lg-5 col-md-6 col-12">
                <div className="product-info-wrapper">
                  <h1 className="product-name">{product.name}</h1>
                  {
                    product.newPrice ?
                      <Auxiliary>
                        <div className="price-wrapper d-flex">
                          <p>Новая цена<span>:</span></p>
                          <div className="new-price">
                            {
                              product.minPrice ? <span>от </span> : null
                            }
                            <span>{`${product.newPrice} руб.`}</span>
                          </div>
                        </div>
                        <div className="price-wrapper d-flex">
                          <p>Цена<span>:</span></p>
                          <div className="old-price">
                            {
                              product.minPrice ? <span className="m-0">от </span> : null
                            }
                            <span>{`${product.price} руб.`}</span>
                          </div>
                        </div>
                        <div className="price-wrapper d-flex">
                          <p>Скидка<span>:</span></p>
                          <div className="new-price">
                            <span className="product-discount">{`-${Math.floor(100 - (product.newPrice * 100) / product.price)}%`}</span>
                          </div>
                        </div>
                      </Auxiliary>
                      :
                      <div className="price-wrapper d-flex">
                        <p>Цена<span>:</span></p>
                        <div className="new-price">
                          <span>
                            {
                              product.minPrice ? <span className="m-0">от </span> : null
                            }
                            {`${product.price} руб.`}
                          </span>
                        </div>
                      </div>
                  }
                  <hr />
                  <p className="product-description five-lines-of-text">{product.description}</p>
                </div>
              </div>
            </div>
          </div>
          {/*  */}

        </section><section className="section section-background new-collections">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section-title">
                  <h1>похожие продукты</h1>
                  <small>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente blanditiis veniam odio debitis ea veritatis quod nulla quisquam labore quo!</small>
                </div>
              </div>
              <div className="col-12">
                <div className="item-slider-wrapper">
                  <div className=" item-slider">
                    {
                      similarProducts.length ?
                        <MultiCarousel
                          responsive={responsive}
                          arrows={true}
                        >
                          {similarProducts.map(product => {
                            return <div key={product._id} className="card-item">
                              <div className="card product-wrpper">
                                <div className="item-image" style={{ backgroundImage: `url(${getImageUrl}/${JSON.parse(product.images)[0]})` }}>
                                  <div className="product-settings">
                                    <i className="fas fa-search-plus" onClick={() => this.enlargephoto(`${getImageUrl}/${JSON.parse(product.images)[0]}`)}></i>
                                    <i
                                      className={`fas fa-heart ${product.isWishlist ? "active-heart" : ""}`}
                                      onClick={(event) => this.addOrRemoveProductFromWishList(event, product._id)}
                                    />
                                  </div>
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
                            </div>
                          })}
                        </MultiCarousel>
                        : null
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Auxiliary> : null
    )
  }
}

const mapDispatchToProps = {
  addPageSpinner,
  removePageSpinner,
  addProductToWishList,
  removeProductFromWishList
}

export default connect(null, mapDispatchToProps)(Product);