import React, { Component } from 'react'
import { connect } from 'react-redux';
import uuid from 'react-uuid';
import Api from '../../Api';
import AlertService from '../../Services/AlertService';
import { addPageSpinner, removePageSpinner } from "../../store/actions/spinner";
import Select from 'react-select';
import { getImageUrl } from '../..';
import { Link } from 'react-router-dom';
import { MdUpdate } from 'react-icons/md';
import { RiDeleteBin2Fill } from 'react-icons/ri';


class AllProductsByCategory extends Component {

  state = {
    products: [],
    defaultProducts: [],
    categoryValue: 0,
    categories: [],
    pageCount: 0,
    pageNumber: 1,
    categoryId: null,
    productsCount: 10
  }

  componentDidMount() {
    this.getAllProducts();
  }

  getAllProducts = () => {
    const spinnerId = uuid();
    this.props.addPageSpinner(spinnerId);
    Api.getAllProducts().then(response => {
      this.props.removePageSpinner(spinnerId);
      if (response && response.data?.products) {
        this.setState({ defaultProducts: response.data.products }, () => {
          this.getCategories();
        })
      }

    }).catch(error => this.getFail(error, spinnerId))
  }

  getCategories = () => {
    const spinnerId = uuid();
    this.props.addPageSpinner(spinnerId);
    Api.getCategories().then(response => {
      this.props.removePageSpinner(spinnerId);
      if (response && response.data?.categories) {
        const categories = [{ label: "Все категории", value: 0 }];
        response.data?.categories.forEach((category, index) => {
          categories.push({ label: category.categoryName, value: index + 1, categoryId: category._id })
        })
        this.setState({ categories }, () => {
          this.filterProducts();
        });
      }
    }).catch(error => this.getFail(error, spinnerId))
  }

  onSelectOptionChange = (event) => {
    this.setState({ categoryValue: event.value, categoryId: event.categoryId, productsCount: 10 }, () => {
      this.filterProducts();
    });
  }

  filterProducts = () => {
    const { categoryValue, defaultProducts, categoryId } = this.state;
    console.log(defaultProducts.length);
    if (categoryValue === 0) {
      //first page
      this.setState({ products: defaultProducts, pageCount: Math.ceil(defaultProducts.length / 10) });
    } else {
      const products = [];
      defaultProducts.forEach(defaultProduct => {
        if (defaultProduct.categoriesId && JSON.parse(defaultProduct.categoriesId)) {
          JSON.parse(defaultProduct.categoriesId).forEach(defaultProductCategory => {
            if (defaultProductCategory.value === categoryId) {
              products.push(defaultProduct)
            }
          })
        }
      })
      this.setState({ products })
      console.log(products);
    }
  }

  getFail = (error, spinnerId) => {
    error && AlertService.alert("error", error);
    spinnerId && this.props.removePageSpinner(spinnerId);
  }

  goToTop = () => {
    window.scrollTo(0, 0);
  }


  render() {

    const { categories, categoryValue, pageCount, products, pageNumber, categoryId, productsCount } = this.state;
    return (
      <div className="container">
        <div className="mb-3">
          <div className="mini-container">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="title">Товары по категориям</h2>
              <Link to="/gr-admin/product">Добавить товар</Link>
            </div>

            {
              categories && categories.length ?
                <div>
                  <Select
                    options={categories}
                    value={(() => {
                      var selectedValues = categories.find(action => action.value === categoryValue);
                      if (selectedValues) {
                        selectedValues.label = selectedValues.label;
                        selectedValues.value = selectedValues.value;
                        selectedValues.categoryId = selectedValues.categoryId
                      }
                      return selectedValues;
                    })()}
                    onChange={this.onSelectOptionChange}
                  />
                </div>
                : null
            }
          </ div>
          <div className="mt-2">
            <span ><b>Всего:</b>{` ${products.length}`}</span>
          </div>
        </div>
        <table id="customers">
          <thead>
            <tr>
              <th>Название товара</th>
              <th>Картинка</th>
              <th>Описание товара</th>
              <th>Обновить</th>
              <th>Удалить</th>
            </tr>
          </thead>
          <tbody>
            {
              products && products.length ? products.map((product, index) => {
                return (productsCount > index) ? <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>
                    {
                      <img className="td-img" src={`${getImageUrl}/${JSON.parse(product.images)[0]}`} alt="#" />
                    }
                  </td>
                  <td><p className="td-desc">{product.description}</p></td>
                  <td className="center blue icon">
                    <Link to={`/gr-admin/product/${product._id}`}>
                      <MdUpdate />
                    </Link>
                  </td>
                  <td className="center red icon" onClick={() => this.removeProduct(product._id, product)}><RiDeleteBin2Fill /></td>
                </tr> : null
              }) : null
            }
          </tbody>
        </table>
        {
          products.length > productsCount ?
            <div className="mini-container">
              <div className="row mt-3">
                <div className="col-12">
                  <button type="button" className="w-100 admin-more-products" onClick={() => this.setState({ productsCount: productsCount + 10 })}>Показать ещё</button>
                </div>
              </div>
            </div>
            : null
        }
        <div
          className="admin-bottom-ruler admin-slide-up-button"
          onClick={this.goToTop}
        >
          <i className="fas fa-chevron-up"></i>
        </div>
      </div >
    )
  }
}

const mapDispatchToProps = {
  addPageSpinner,
  removePageSpinner
}

export default connect(null, mapDispatchToProps)(AllProductsByCategory)
