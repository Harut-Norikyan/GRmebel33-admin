import React, { Component } from 'react';
import { MdUpdate } from 'react-icons/md';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import Api from '../../Api';
import AlertService from '../../Services/AlertService';
import ReactPaginate from 'react-paginate';
import { getImageUrl } from '../..';
import { addPageSpinner, removePageSpinner } from "../../store/actions/spinner";
import uuid from 'react-uuid';
import { connect } from "react-redux";
import Select from 'react-select';

class AllProducts extends Component {

  state = {
    products: [],
    defaultProducts: [],
    pageCount: null,
    currentPage: 1,
    allProductsCount: null,
    categories: [],
    categoryValue: 0
  }

  componentDidMount() {
    const { currentPage } = this.state;
    this.getProducts(currentPage);
  }

  getProducts = (currentPage) => {
    const spinnerId = uuid();
    this.props.addPageSpinner(spinnerId);
    Api.getProducts(currentPage).then(response => {
      this.props.removePageSpinner(spinnerId);
      if (response && response.data) {
        const productsData = { ...response.data };
        this.setState({
          products: productsData ? productsData.products : [],
          defaultProducts: productsData ? productsData.products : [],
          pageCount: productsData?.totalPages,
          allProductsCount: productsData?.allProductsCount
        })
        this.getCategories();
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
          categories.push({ label: category.categoryName, value: index + 1 })
        })
        this.setState({ categories });
      }
    }).catch(error => this.getFail(error, spinnerId))
  }

  handlePageClick = (event) => {
    this.getProducts(event.selected + 1)
  }

  removeProduct = (id, product) => {
    const { products } = this.state;
    const spinnerId = uuid();
    AlertService.alertConfirm(`Вы действительно хотите удалить ${product.name} ?`, "Да", "Нет").then(() => {
      this.props.addPageSpinner(spinnerId);
      Api.removeProduct(id, product.images).then(response => {
        this.props.removePageSpinner(spinnerId);
        if (response) {
          AlertService.alert("success", response.data.message);
          var index = products.findIndex(function (o) {
            return o._id === id;
          })
          if (index !== -1) products.splice(index, 1);
          this.setState({ products });
        }
      }).catch(error => this.getFail(error, spinnerId))
    })
  }

  getFail = (error, spinnerId) => {
    error && AlertService.alert("error", error);
    spinnerId && this.props.removePageSpinner(spinnerId);
  }

  render() {

    const { products, pageCount, allProductsCount, categories, categoryValue } = this.state;

    return (
      <div className="container">
        <div>
          <h2 className="title">Товары</h2>
        </div>
        {
          allProductsCount ?
            <small className="d-block my-2">Общее количество товаров <b>{allProductsCount}</b> </small>
            : null
        }
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
              products && products.length ? products.map(product => {
                return <tr key={product._id}>
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
                </tr>
              }) : null
            }
          </tbody>
        </table>
        <Link to="/gr-admin/product">Добавить товар</Link>
        {
          pageCount ?
            <div className="pagination-block mb-5">
              <ReactPaginate
                previousLabel={"Назад"}
                nextLabel={"Вперед"}
                pageCount={pageCount}
                onPageChange={this.handlePageClick}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                containerClassName={'pagination'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link'}
                activeClassName={'active'}
              />
            </div>
            : null
        }
      </div>
    );
  }
}

const mapDispatchToProps = {
  addPageSpinner,
  removePageSpinner
}

export default connect(null, mapDispatchToProps)(AllProducts)
