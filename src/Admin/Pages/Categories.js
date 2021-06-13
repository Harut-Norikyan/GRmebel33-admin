import React, { Component } from 'react';
import Api from '../../Api';
import AlertService from '../../Services/AlertService';
import { RiDeleteBin2Fill } from "react-icons/ri";
import { MdUpdate } from "react-icons/md";
import { BiReset } from "react-icons/bi";
import settingsIcon from "../Images/settings (2).png";
import cameraGrey from "../Images/camera-grey.png";
import ReactPaginate from 'react-paginate';
import { addPageSpinner, removePageSpinner } from "../../store/actions/spinner";
import uuid from 'react-uuid';
import { connect } from "react-redux";
import { getImageUrl } from '../..';
import 'react-notifications/lib/notifications.css';

class Categories extends Component {
  state = {
    categoryId: null,
    categoryName: '',
    categories: [],
    isinvalidSubmit: false,
    pageCount: null,
    currentPage: 1,
    image: '',
    imageForDraw: '',
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
        categoryName: data.category.categoryName,
        imageForDraw: data.category?.images ? JSON.parse(data.category?.images)[0] : ''
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
    const spinnerId = uuid();
    this.props.addPageSpinner(spinnerId)
    Api.getCategories(currentPage || 1).then(response => {
      this.props.removePageSpinner(spinnerId);
      const data = { ...response.data };
      data && this.setState({ categories: data.categories, pageCount: data.totalPages });
    }).catch(error => this.getFail(error, spinnerId));
  }

  cancelUpdate = () => {
    this.setState({
      categoryId: null,
      categoryName: '',
      image: '',
      imageForDraw: ''
    })
  }

  handlePageClick = (event) => {
    this.getCategories(event.selected + 1)
  }

  removePhoto = () => {
    this.setState({ image: '' });
  }

  onChangeFile = (event) => {
    this.setState({
      image: event.target.files[0],
    })
  }

  onSubmit = (event) => {
    event.preventDefault();
    var { categoryName, categoryId, isinvalidSubmit, image, imageForDraw } = this.state;
    if (!categoryName || !(image || imageForDraw)) {
      isinvalidSubmit = true;
      this.setState({ isinvalidSubmit });
    } else {
      isinvalidSubmit = false;
      this.setState({ isinvalidSubmit });
    }
    if (!isinvalidSubmit) {
      // var images = [image];
      if (!categoryId) {
        Api.addCategory({ categoryName, image }).then(response => {
          console.log(response);
          const data = { ...response.data };
          data && AlertService.alert("success", data.message);
          this.setState({ categoryName: '', image: '', imageForDraw: '' });
          this.getCategories();
        });
      } else {
        Api.updateCategory({ categoryName, categoryId, image, imgPath: imageForDraw }).then(response => {
          const data = { ...response.data };
          data && AlertService.alert("success", data.message);
          this.setState({ categoryName: '', categoryId: null, image: '', imageForDraw: '' });
          this.getCategories();
        })
      }
    }
  }

  getFail = (error, spinnerId) => {
    error && AlertService.alert("error", error);
    spinnerId && this.props.removePageSpinner(spinnerId);
  }

  render() {
    const { categories, isinvalidSubmit, categoryName, categoryId, pageCount, image, imageForDraw } = this.state;
    return (
      <div className='content'>
        <h2 className="title">{categoryId ? "Обновить категорию" : "Добавить категорию"}</h2>
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
            <hr />
            <label htmlFor="categoryName">Фотография для категории<span className="red"> *</span> </label>
            <div className="category-upload-block">
              <div className={`upload-img ${isinvalidSubmit && !image ? "error" : ""}`}>
                <input type="file" id="upload" hidden name="img" multiple onChange={this.onChangeFile} />
                <label className="labelForUpload" htmlFor="upload">
                  <img src={cameraGrey} alt="#" />
                </label>
              </div>
              {
                image ?
                  <div className='image-block'>
                    <div data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img className="settings" src={settingsIcon} alt="#" />
                    </div>
                    <div className="dropdown-menu dropdown-menu-right">
                      <button
                        className="dropdown-item"
                        type="button"
                        onClick={this.removePhoto}
                      >
                        Удалить фото
                    </button>
                    </div>
                    <img className="category-img" src={URL.createObjectURL(image)} alt="#" />
                  </div>
                  : null
              }
              {
                imageForDraw && !image ?
                  <div className='image-block'>
                    <img className="category-img" src={`${getImageUrl}/${imageForDraw}`} alt="#" />
                  </div>
                  : null
              }
            </div>
            <div className="category-butttons-block">
              <button type="submit" className="btn btn-outline-primary admin-button">
                {
                  categoryId ? "Обновить категорию" : "Добавить категорию"
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
          <hr className="my-2" />
        </form>
        <table id="customers">
          <thead>
            <tr>
              <th>Название категории</th>
              <th>Картинка</th>
              <th>Обновить</th>
              <th>Удалить</th>
            </tr>
          </thead>
          <tbody>
            {
              categories ? categories.map(category => {
                return <tr key={category._id}>
                  <td>{category.categoryName}</td>
                  <td>
                    {
                      <img className="td-img" src={`${getImageUrl}/${JSON.parse(category.images)[0]}`} alt="#" />
                    }
                  </td>
                  <td className="center blue icon" onClick={() => this.getCategoryById(category._id)}><MdUpdate /></td>
                  <td className="center red icon" onClick={() => this.removeCategoryById(category)}><RiDeleteBin2Fill /></td>
                </tr>
              }) : null
            }
          </tbody>
        </table>
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

const mapDispatchToProps = {
  addPageSpinner,
  removePageSpinner
}

export default connect(null, mapDispatchToProps)(Categories)
