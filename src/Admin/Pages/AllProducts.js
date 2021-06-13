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

class AllProducts extends Component {

  state = {
    products: [],
    pageCount: null,
    currentPage: 1,
    allProductsCount: null
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
        this.setState({
          products: response.data.products,
          pageCount: response.data.totalPages,
          allProductsCount: response.data.allProductsCount
        })
      }
    }).catch(error => this.getFail(error, spinnerId))
  }

  getFail = (error, spinnerId) => {
    error && AlertService.alert("error", error);
    spinnerId && this.props.removePageSpinner(spinnerId);
  }

  handlePageClick = (event) => {
    this.getProducts(event.selected + 1)
  }

  removeProduct = (id, product) => {
    const { products } = this.state;
    AlertService.alertConfirm(`Вы действительно хотите удалить ${product.name} ?`, "Да", "Нет").then(() => {
      Api.removeProduct(id, product.images).then(response => {
        if (response) {
          AlertService.alert("success", response.data.message);
          var index = products.findIndex(function (o) {
            return o._id === id;
          })
          if (index !== -1) products.splice(index, 1);
          this.setState({ products });
        }
      })
    })
  }

  render() {

    const { products, pageCount, allProductsCount } = this.state;

    return (
      <div className="container">
        <h2 className="title">Продукты</h2>
        {
          allProductsCount ?
            <small className="d-block my-2">Общее количество продуктов <b>{allProductsCount}</b> </small>
            : null
        }
        <table id="customers">
          <thead>
            <tr>
              <th>Название продукта</th>
              <th>Картинка</th>
              <th>Описание продукта</th>
              <th>Обновить</th>
              <th>Удалить</th>
            </tr>
          </thead>
          <tbody>
            {
              products ? products.map(product => {
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
        <Link to="/gr-admin/product">Добавить продукт</Link>
        {
          pageCount ?
            <div className="pagination-block">
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
