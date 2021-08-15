import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import NukaCarousel from 'nuka-carousel';
import MultiCarousel from "react-multi-carousel";
import Auxiliary from '../Components/Auxiliary';
import { connect } from "react-redux";
import { addPageSpinner, removePageSpinner } from "../../store/actions/spinner";
import { addProductToWishList, removeProductFromWishList } from "../../store/actions/products";
import { Link, withRouter } from 'react-router-dom';
import { getImageUrl } from '../..';
import { compose } from 'redux';
import Api from '../../Api';
import uuid from 'react-uuid';
import AlertService from '../../Services/AlertService';
import WishListSettings from '../../Services/WishListSettings';
import PromiseService from '../../Services/Promise';
import partner1 from "../Images/partner-1.jpg";
import partner2 from "../Images/partner-2.jpg";
import partner4 from "../Images/partner-4.jpg";
import partner5 from "../Images/partner-5.jpg";
import discount from "../Images/discount.png";
import feedback from "../Images/feedback.png";
import measurer from "../Images/measurer.png";
import delivery from "../Images/delivery.png";
import shield from "../Images/shield.png";
import taxFree from "../Images/tax-free.png";



const TITLE = 'Главная';

class Home extends Component {

  state = {
    largeImgPath: '',
    showLargePhoto: false,
    allProducts: [],
  }

  componentDidMount() {
    this.getAllProducts();
  }

  getAllProducts = () => {
    const spinnerId = uuid();
    this.props.addPageSpinner(spinnerId);
    Api.getAllProducts().then(response => {
      this.props.removePageSpinner(spinnerId);
      const products = [...response.data?.products];
      products && products.forEach(product => {
        product.isWishlist = false
      })
      products && this.setState({ allProducts: products }, () => {
        if (localStorage.getItem("products") && products) {
          this.changeWishalistStatus(JSON.parse(localStorage.getItem("products")), products);
        }
      });
    }).catch(error => this.getFail(error, spinnerId))
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
    this.setState({ allProducts: products })
  }

  enlargephoto = (event, image) => {
    event.stopPropagation();
    this.setState({ showLargePhoto: true, largeImgPath: image });
  }

  hideLargePhoto = () => {
    this.setState({ showLargePhoto: false, largeImgPath: "" });
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

  redirectToProductPage = (id) => {
    this.props.history.push(`/product/${id}`)
  }

  sendCategoryName = (categoryName, id) => {
    PromiseService.storageSetItem("categoryName", categoryName).then(() => {
      this.props.history.push(`/category/${id}`)
    })
  }

  getFail = (error, spinnerId) => {
    error && AlertService.alert("error", error);
    spinnerId && this.props.removePageSpinner(spinnerId);
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

  changeCurrentProductWishListStatus = (id) => {
    const products = [...this.state.allProducts];
    if (!id || !products) return;
    products.forEach(product => {
      if (product._id == id) {
        product.isWishlist = !product.isWishlist
      }
    })
    this.setState({ products })
  }

  render() {
    const { showLargePhoto, largeImgPath, allProducts } = this.state;
    const { categories } = this.props;

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
        items: 1,
        slidesToSlide: 1
      },
      verySmallMobile: {
        breakpoint: { max: 320, min: 0 },
        items: 1,
        slidesToSlide: 1
      }
    };


    let shuffeledProducts = [];
    shuffeledProducts = [...allProducts].splice(0, 3);

    let shuffeledCategoties = [];
    shuffeledCategoties = [...categories].reverse().splice(0, 3);

    let productsWithOutDiscount = [];
    let productsWithDiscount = [];

    allProducts && allProducts.forEach(product => {
      if (!product.newPrice) productsWithOutDiscount.push(product);
      else { productsWithDiscount.push(product) }
    });
    if (productsWithOutDiscount) productsWithOutDiscount = [...productsWithOutDiscount].splice(0, 10)
    if (productsWithDiscount) productsWithDiscount = ([...productsWithDiscount]).reverse().splice(0, 10);

    return (
      <Auxiliary>
        <Helmet>
          <title>{TITLE}</title>
        </Helmet>
        {
          (showLargePhoto && largeImgPath) ?
            <div onClick={this.hideLargePhoto}>
              <div className="large-image-layer" />
              <div className="large-photo" style={{ backgroundImage: `url(${largeImgPath})` }} />
            </div>
            : null
        }
        <NukaCarousel
          renderCenterLeftControls={({ previousSlide }) => (
            <span
              className="carousel-control-prev-icon ml-5 arrow"
              onClick={event => event.stopPropagation(), previousSlide}
            />
          )}
          renderCenterRightControls={({ nextSlide }) => (
            <span
              className="carousel-control-next-icon mr-5 arrow"
              onClick={event => event.stopPropagation(), nextSlide}
            />
          )}
          defaultControlsConfig={{
            pagingDotsStyle: {
              fill: "#ffffff"
            }
          }}
          wrapAround={true}
        // autoplay={true}
        >
          {
            shuffeledProducts ?
              shuffeledProducts.map(product => {
                return <div
                  key={product._id}
                  className="first-slider"
                  style={{ backgroundImage: `url(${getImageUrl}/${JSON.parse(product.images)[0]})` }}
                  onClick={() => this.redirectToProductPage(product._id)}
                />

              })
              : null
          }
        </NukaCarousel>
        {/* Categories */}
        <section className="section category">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section-title">
                  <h1>категории</h1>
                  {/* <small className="sub-title">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente blanditiis veniam odio debitis ea veritatis quod nulla quisquam labore quo!</small> */}
                </div>
              </div>
              <div className="col-12">
                <div className="row">
                  {
                    shuffeledCategoties.length >= 3 ?
                      shuffeledCategoties.map(category => {
                        return <Link
                          key={category._id}
                          // to={`/category/${category._id}`}
                          to="#"
                          className="col-xl-4 col-lg-4 col-md-4 col-12"
                          onClick={() => this.sendCategoryName(category.categoryName, category._id)}
                        >
                          <div className="card-category">
                            <div className="card category-card">
                              <div className="card-image" style={{ backgroundImage: `url(${getImageUrl}/${JSON.parse(category.images)[0]})` }}></div>
                              <div className="card-body">
                                <h5 className="card-title">{category.categoryName}</h5>
                              </div>
                            </div>
                          </div>
                        </Link>
                      })
                      : null
                  }
                  <div className="col-12">
                    <div className="w-100 text-center my-3">
                      <Link to="/categories" className="btn btn-primary">Все категории</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* First 10 products */}
        <section className="section section-background new-collections">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section-title">
                  <h1>ПОСЛЕДНИЕ</h1>
                  {/* <small className="sub-title">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente blanditiis veniam odio debitis ea veritatis quod nulla quisquam labore quo!</small> */}
                </div>
              </div>
              <div className="col-12">
                <div className="item-slider-wrapper">
                  <div className=" item-slider">
                    {
                      productsWithOutDiscount.length ?
                        <MultiCarousel
                          responsive={responsive}
                          arrows={true}
                        >
                          {productsWithOutDiscount.map(product => {
                            return <div key={product._id} className="card-item">
                              <div className="card product-wrpper">
                                <div
                                  className="item-image"
                                  style={{ backgroundImage: `url(${getImageUrl}/${JSON.parse(product.images)[0]})` }}
                                  onClick={() => this.redirectToProductPage(product._id)}
                                >
                                  <div className="product-settings">
                                    <i className="fas fa-search-plus" onClick={(event) => this.enlargephoto(event, `${getImageUrl}/${JSON.parse(product.images)[0]}`)}></i>
                                    <i
                                      className={`fas fa-heart ${product.isWishlist ? "active-heart" : "unactive-heart"}`}
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
                                  <p title={product.description}>{product.description}</p>
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

        {/* Discount products */}
        <section className="section section-background new-collections">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section-title">
                  <h1>АКЦИИ</h1>
                  {/* <small className="sub-title">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente blanditiis veniam odio debitis ea veritatis quod nulla quisquam labore quo!</small> */}
                </div>
              </div>
              <div className="col-12">
                <div className="item-slider-wrapper">
                  <div className=" item-slider">
                    {
                      productsWithDiscount.length ?
                        <MultiCarousel
                          responsive={responsive}
                          arrows={true}
                        >
                          {productsWithDiscount.map(product => {
                            return <div key={product._id} className="card-item">
                              <div className="card product-wrpper">
                                <div
                                  className="item-image"
                                  style={{ backgroundImage: `url(${getImageUrl}/${JSON.parse(product.images)[0]})` }}
                                  onClick={() => this.redirectToProductPage(product._id)}
                                >
                                  <div className="product-settings">
                                    <i className="fas fa-search-plus" onClick={(event) => this.enlargephoto(event, `${getImageUrl}/${JSON.parse(product.images)[0]}`)}></i>
                                    <i
                                      className={`fas fa-heart ${product.isWishlist ? "active-heart" : "unactive-heart"}`}
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
                                  <p title={product.description}>{product.description}</p>
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
        {/* Pay,About us */}
        <section className="section  services">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section-title">
                  <h1>Купить мебель от производителя</h1>
                  {/* <small className="sub-title">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente blanditiis veniam odio debitis ea veritatis quod nulla quisquam labore quo!</small> */}
                </div>
              </div>
              <div className="col-12">
                <div className="service-flex">
                  <div className="our-service">
                    <img src={discount} alt="/" />
                    {/* <Factory /> */}
                    <small>Скидки</small>
                  </div>
                  <div className="our-service">
                    {/* <CreditCart /> */}
                    <img src={shield} alt="/" />
                    <small>Гарантия качества</small>
                  </div>
                  <div className="our-service">
                    {/* <FreeDelivery /> */}
                    <img src={delivery} alt="/" />
                    <small>Доставка</small>
                  </div>
                  <div className="our-service">
                    {/* <PrePayment /> */}
                    <img src={taxFree} alt="/" />
                    <small>Без предоплат</small>
                  </div>
                  <div className="our-service">
                    {/* <Pencil /> */}
                    <img src={measurer} alt="/" />
                    <small>Выезд замерщика</small>
                  </div>
                  <div className="our-service">
                    {/* <Support /> */}
                    <img src={feedback} alt="/" />
                    <small>Обратная связь</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Partners  */}
        <section className="section section-background answers-block my-0">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section-title">
                  <h1>Партнеры</h1>
                  <small className="sub-title">производители лучших мебельных материалов и комплектующих</small>
                </div>
              </div>
              <ul className="partners-block">
                <li className="partner-item">
                  <div className="partner-icon" style={{ backgroundImage: `url(${partner1})` }} />
                  <p>Лучшая австрийская фурнитура</p>
                </li>
                <li className="partner-item">
                  <div className="partner-icon" style={{ backgroundImage: `url(${partner2})` }} />
                  <p>Надежная немецкая фурнитура</p>
                </li>
                <li className="partner-item">
                  <div className="partner-icon" style={{ backgroundImage: `url(${partner4})` }} />
                  <p>Европейский производитель ЛДСП EGGER</p>
                </li>
                <li className="partner-item">
                  <div className="partner-icon" style={{ backgroundImage: `url(${partner5})` }} />
                  <p>Качественная российская фурнитура</p>
                </li>
              </ul>
            </div>
          </div>

        </section>
        {/* <hr className="m-0" /> */}

        <hr className="m-0" />
        {/* Answers */}
        <section className="section answers-block pt-2 pb-5">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="row mt-5">
                  <div className="col-12">
                    <div className="section-title justify-content-center">
                      <h2>Появились вопросы?</h2>
                      <p className="answers-desc">
                        Позвоните нам, и мы поможем полезными советами по выбору именно той мебели, которая лучше всего украсить ваш интерьер.
                      </p>
                      <br />
                      <div className="contact-info-block">
                        <i className="fas fa-phone-square-alt"></i>
                        <div className="contact-info-item">
                          <small>Ежедневно с 09:00 до 21:00</small>
                          <b className="d-block">+7 901 888 88 79</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


      </Auxiliary>
    );
  }
}

const mapStateToProps = state => ({
  categories: state.categories.categories,
})

const mapDispatchToProps = {
  addPageSpinner,
  removePageSpinner,
  addProductToWishList,
  removeProductFromWishList
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Home);

