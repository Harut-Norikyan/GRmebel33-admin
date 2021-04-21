import React, { Component } from 'react';
import Api from '../Api';
import AlertService from '../Services/AlertService';
import { RiDeleteBin2Fill } from "react-icons/ri";
import { MdUpdate } from "react-icons/md";


class Categories extends Component {
  state = {
    categoryId: null,
    categoryName: '',
    categories: []
  }

  componentDidMount() {
    this.getCategories()
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  onSubmit = (event) => {
    event.preventDefault();
    const { categoryName, categoryId } = this.state;
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

  getCategories = () => {
    Api.getCategories().then(response => {
      const data = { ...response.data };
      this.setState({ categories: data.categories });
    });
  }

  render() {
    const { categories } = this.state;
    return (
      <div className='content'>
        <h2>Категории</h2>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            name="categoryName"
            value={this.state.categoryName}
            onChange={this.onChange}
          />
          <button>
            Добавить категорию
          </button>
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
      </div>
    );
  }
}

export default Categories;