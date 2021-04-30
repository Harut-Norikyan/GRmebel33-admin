import React, { Component } from 'react';
import Api from '../Api';
import AlertService from '../Services/AlertService';
import { RiDeleteBin2Fill } from "react-icons/ri";
import { MdUpdate } from "react-icons/md";
import { BiReset } from "react-icons/bi";
import ReactPaginate from 'react-paginate';

class Categories extends Component {
  state = {
    categoryId: null,
    categoryName: '',
    categories: [],
    isinvalidSubmit: false,
    pageCount: null,
    currentPage: 1,
  }

  componentDidMount() {
    const { currentPage } = this.state;
    this.getCategories(currentPage);
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  getCategoryById = (id) => {
    Api.getCategoryById(id).then(response => {
      const data = { ...response.data };
      response.data && response.data.category && this.setState({
        categoryId: data.category._id,
        categoryName: data.category.categoryName
      })
    })
  }

  removeCategoryById = (category) => {
    const { categories } = this.state;
    AlertService.alertConfirm(`Вы действительно хотите удалить ${category.categoryName} ?`, "Да", "Нет").then(() => {
      Api.removeCategoryById(category._id).then(response => {
        const data = { ...response.data };
        data && AlertService.alert("success", data.message);
        const newCategories = categories.filter(function (obj) {
          return obj._id !== category._id;
        });
        this.setState({ categories: newCategories, categoryName: '', categoryId: null })
      })
    })
  }

  getCategories = (currentPage) => {
    Api.getCategories(currentPage).then(response => {
      const data = { ...response.data };
      this.setState({ categories: data.categories, pageCount: data.totalPages });
    });
  }

  cancelUpdate = () => {
    this.setState({
      categoryId: null,
      categoryName: ''
    })
  }

  handlePageClick = (event) => {
    this.getCategories(event.selected + 1)
  }

  onSubmit = (event) => {
    event.preventDefault();
    var { categoryName, categoryId, isinvalidSubmit } = this.state;
    if (!categoryName) {
      isinvalidSubmit = true;
      this.setState({ isinvalidSubmit });
    } else {
      isinvalidSubmit = false;
      this.setState({ isinvalidSubmit });
    }
    if (!isinvalidSubmit) {
      if (!categoryId) {
        Api.addCategory(categoryName).then(response => {
          const data = { ...response.data };
          data && AlertService.alert("success", data.message);
          this.setState({ categoryName: '' });
          this.getCategories();
        });
      } else {
        Api.updateCategory(categoryName, categoryId).then(response => {
          const data = { ...response.data };
          data && AlertService.alert("success", data.message);
          this.setState({ categoryName: '', categoryId: null });
          this.getCategories();
        })
      }
    }
  }

  render() {
    const { categories, isinvalidSubmit, categoryName, categoryId, pageCount } = this.state;
    return (
      <div className='content'>
        <h2>Категории</h2>
        <form onSubmit={this.onSubmit}>
          <div className="add-category-block">
            <label htmlFor="categoryName">Название категории <span className="red">*</span> </label>
            <input
              id="categoryName"
              type="text"
              name="categoryName"
              value={this.state.categoryName}
              onChange={this.onChange}
              placeholder="Название категории"
              className={` ${isinvalidSubmit && !categoryName ? "error" : ""}`}
            />
            <div className="category-butttons-block">
              <button type="submit" className="btn btn-outline-primary">
                {
                  categoryId ? "Обнавить категорию" : "Добавить категорию"
                }
              </button>
              {
                categoryId ?
                  <div className="reset" title="Отменить обнавление данной категории" onClick={this.cancelUpdate}>
                    <BiReset />
                  </div>
                  : null
              }
            </div>
          </div>
          <table id="customers">
            <thead>
              <tr>
                <th>Category name</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {
                categories ? categories.map(category => {
                  return <tr key={category._id}>
                    <td>{category.categoryName}</td>
                    <td className="center blue icon" onClick={() => this.getCategoryById(category._id)}><MdUpdate /></td>
                    <td className="center red icon" onClick={() => this.removeCategoryById(category)}><RiDeleteBin2Fill /></td>
                  </tr>
                }) : null
              }
            </tbody>
          </table>
        </form>
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
      </div>
    );
  }
}

export default Categories;