import React, { Component } from 'react';
import Select from 'react-select';
import Api from "../Api";
import AlertService from '../Services/AlertService';
import settingsIcon from "../Images/settings (2).png";
import cameraGrey from "../Images/camera-grey.png";
import { withRouter } from 'react-router';

class Product extends Component {

  state = {
    form: {
      name: "",
      description: "",
      price: "",
      minPrice: false,
      newPrice: "",
      discount: false,
      images: [],
      keyWords: '',
      categoriesId: []
    },
    productId: this.props.match.params.id || null,
    categories: [],
    productById: null,
    imagesForDraw: [],
    imagesBlobArray: [],
    isInvalidSubmit: false,
  }

  componentDidMount() {
    const { productId } = this.state;
    if (productId) {
      this.getProductById(productId);
    }
    this.getCategories();
  }

  getProductById = (productId) => {
    Api.getProductById(productId).then(response => {
      if (response.data) {
        const { product } = { ...response.data };
        this.setState(prevState => ({
          ...prevState,
          imagesForDraw: JSON.parse(product.images) || [],
          form: {
            ...prevState.form,
            categoriesId: JSON.parse(product.categoriesId) || [],
            description: product.description || "",
            discount: product.discount || false,
            keyWords: product.keyWords ? JSON.parse(product.keyWords).join() : '',
            name: product.name || "",
            newPrice: product.newPrice || "",
            price: product.price || "",
            minPrice: product.minPrice,
          }
        }))
      }
    })
  }

  getCategories = () => {
    Api.getCategories().then(response => {
      const categories = [];
      if (response.data.categories) {
        response.data.categories.forEach(element => {
          categories.push({
            value: element._id,
            label: element.categoryName
          })
        });
      }
      this.setState({ categories });
    })
  }

  onChange = (event) => {
    this.setState(prevState => ({
      ...prevState,
      form: {
        ...prevState.form,
        [event.target.name]: event.target.value
      }
    }))
  }

  selectChange = selectedOption => {
    const categoriesId = [];
    selectedOption.forEach(elem => {
      categoriesId.push(elem)
    });
    this.setState(prevState => ({
      ...prevState,
      form: {
        ...prevState.form,
        categoriesId
      },
    }));
  }

  onCheckboxChange = (event) => {
    if (event.target.name === "discount") {
      this.setState(prevState => ({
        ...prevState,
        form: {
          ...prevState.form,
          newPrice: '',
          [event.target.name]: event.target.checked
        }
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        form: {
          ...prevState.form,
          [event.target.name]: event.target.checked
        }
      }));
    }
  }

  onChangeFile = (event) => {
    const { images } = this.state.form;
    if (event.target.files) {
      const imagesBlobArray = [...this.state.imagesBlobArray];
      const fileArray = Array.from(event.target.files).map(file => URL.createObjectURL(file));
      fileArray.map(elem => imagesBlobArray.push(elem));
      // Array.from(event.target.files).map(file => URL.revokeObjectURL(file))
      const files = { ...event.target.files };
      for (const i in files) {
        images.push(files[i])
      }
      this.setState(prevState => ({
        ...prevState,
        imagesBlobArray,
        form: {
          ...prevState.form,
          images,
        }
      }));
    }
  }

  renderPhotos = (sourse) => {
    return sourse.map((photo, index) => {
      return (
        <div key={index} className='image-block'>
          <img className="settings" src={settingsIcon} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="#"/>
          <div className="dropdown-menu dropdown-menu-right">
            <button
              className="dropdown-item"
              type="button"
              onClick={() => this.removePhoto(index)}
            >Удалить фото</button>
          </div>
          <img className="product-img" src={photo} />
        </div>
      )
    })
  }

  removePhoto = (index) => {
    const imagesBlobArray = [...this.state.imagesBlobArray];
    const images = [...this.state.form.images];
    imagesBlobArray.splice(index, 1);
    images.splice(index, 1);
    this.setState(prevState => ({
      ...prevState,
      imagesBlobArray,
      form: {
        ...prevState.form,
        images
      }
    }));
  }

  removeAllPhotos = () => {
    const imagesBlobArray = [...this.state.imagesBlobArray];
    const images = [...this.state.form.images];
    imagesBlobArray.length = 0;
    images.length = 0;
    this.setState(prevState => ({
      ...prevState,
      imagesBlobArray,
      form: {
        ...prevState.form,
        images
      }
    }));
  }

  removePhotoWithServer = (path, id, imagesForDraw) => {
    const imagesArrForDraw = [...imagesForDraw];
    var updatedImagesArr = imagesArrForDraw.filter(img => img !== path);
    var imagesArrForSend = [];
    updatedImagesArr.forEach(img => {
      var imgPathArr = img.split("/");
      imagesArrForSend.push(imgPathArr[imgPathArr.length - 1]);
    });
    AlertService.alertConfirm(`Вы действительно хотите удалить данную фотографию ?`, "Да", "Нет").then(() => {
      Api.removeProductImage(path, id, JSON.stringify(imagesArrForSend)).then(response => {
        if (response) {
          AlertService.alert('success', response.data.message);
          this.setState({ imagesForDraw: updatedImagesArr })
        }
      })
    })
  }

  makeTheMain = (index, iamgesForDraw, id) => {
    var onlyImagesName = [];
    const updatedImagesForDrawArr = this.shuffleElements(iamgesForDraw, index);
    updatedImagesForDrawArr.forEach(img => {
      var imagePath = img.split("/");
      onlyImagesName.push(imagePath[imagePath.length - 1]);
    })
    if (index !== 0) {
      Api.makeTheMain(onlyImagesName, id).then(response => {
        if (response) {
          AlertService.alert("success", response.data.message);
          this.setState({ iamgesForDraw: updatedImagesForDrawArr });
        }
      })
    } else {
      AlertService.alert("warning", "Данная фотография и есть главная");
    }
  }

  shuffleElements = (array, index) => {
    var a = array[index];
    array.splice(index, 1);
    array.unshift(a);
    return array;
  }

  onSubmit = (event) => {
    event.preventDefault();
    let { productId, imagesForDraw, isInvalidSubmit } = this.state;
    const form = { ...this.state.form };
    form.categoriesId = form.categoriesId ? JSON.stringify(form.categoriesId) : null;
    form.keyWords = form.keyWords ? JSON.stringify(form.keyWords.split(",")) : null;
    if (!productId) {
      if (
        !form.name ||
        !form.description ||
        !form.price ||
        !form.images ||
        !form.keyWords ||
        !form.categoriesId
      ) {
        isInvalidSubmit = true;
        this.setState({ isInvalidSubmit });
      } else {
        isInvalidSubmit = false;
        this.setState({ isInvalidSubmit });
      }
    }

    if (productId) {
      if (
        (!form.images.length && !imagesForDraw.length) ||
        !form.name ||
        !form.description ||
        !form.price ||
        !form.keyWords ||
        !form.categoriesId
      ) {
        isInvalidSubmit = true;
        this.setState({ isInvalidSubmit });
      } else {
        isInvalidSubmit = false;
        this.setState({ isInvalidSubmit });
      }
    }

    if (!isInvalidSubmit) {
      if (productId) {
        Api.updateProduct(form, productId).then(response => {
          if (response) {
            AlertService.alert("success", response.data.message);
            this.props.history.push(`/gr-admin/all-products`);
          }
        })
      } else {
        Api.addProduct(form).then(response => {
          if (response) {
            AlertService.alert("success", response.data.message);
            this.props.history.push(`/gr-admin/all-products`);
          }
        })
      }
    }
  }

  render() {
    const { categories, productId, imagesForDraw, imagesBlobArray, isInvalidSubmit } = this.state;
    const { name, description, price, discount, minPrice, newPrice, images, categoriesId, keyWords } = this.state.form;
    return (
      categories && categoriesId ? <div>
        <h2>{`${!productId ? 'Добавить' : 'Обновить'}`} продукт</h2>
        <form onSubmit={this.onSubmit} className="product-form">
          <label htmlFor="name">Названия<span className="red">*</span></label>
          <input
            id="name"
            type="text"
            name="name"
            value={name}
            placeholder="названия"
            onChange={this.onChange}
            className={`name ${isInvalidSubmit && !name ? "error" : ""}`}
          />
          <label htmlFor="description">Описание<span className="red">*</span></label>
          <textarea
            id="description"
            type="text"
            placeholder="описание"
            name="description"
            value={description}
            onChange={this.onChange}
            className={`description ${isInvalidSubmit && !description ? "error" : ""}`}
          />
          <label htmlFor="minPrice">
            <input
              id="minPrice"
              type="checkbox"
              name="minPrice"
              checked={minPrice}
              onChange={this.onCheckboxChange}
            />
            <span>Сделать данную цену минимальной</span>
          </label>
          <label htmlFor="price">{`Цена ${minPrice ? 'от' : ''}`}<span className="red">*</span></label>
          <input
            id="price"
            type="number"
            placeholder="цена"
            name="price"
            min="1"
            value={price}
            onChange={this.onChange}
            className={` ${isInvalidSubmit && !price ? "error" : ""}`}
          />
          <label htmlFor="discount">
            <input
              id="discount"
              type="checkbox"
              name="discount"
              checked={discount}
              onChange={this.onCheckboxChange}
            />
            <span>Скидка</span>
          </label>
          {
            discount ?
              <>
                <label htmlFor="newPrice">Новая цена</label>
                <input
                  id="newPrice"
                  type="number"
                  name="newPrice"
                  min="1"
                  value={newPrice}
                  placeholder="новая цена"
                  onChange={this.onChange}
                  className={` ${isInvalidSubmit && discount && !newPrice ? "error" : ""}`}
                />
              </>
              : null
          }
          <label htmlFor="">Добавьте фотографии <span className="red">*</span></label>
          <div className={
            `images-block
            ${!productId && !images.length && isInvalidSubmit ? "error" : ""}
            ${productId && !images.length && !imagesForDraw.length && isInvalidSubmit ? "error" : ""}`
          }>
            <div className="upload-img">
              <input type="file" id="upload" hidden name="img" multiple onChange={this.onChangeFile} />
              <label className="labelForUpload" htmlFor="upload">
                <img src={cameraGrey} alt="#"/>
              </label>
            </div>
            <div className="product-image-block">
              {
                imagesBlobArray.length ?
                  <>
                    <img className="global-settings" src={settingsIcon} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="#"/>
                    <div className="dropdown-menu dropdown-menu-right">
                      <button className="dropdown-item" type="button" onClick={this.removeAllPhotos}>Удалить все фотографии</button>
                    </div>
                  </>
                  : null
              }
              {
                imagesForDraw.length ?
                  imagesForDraw.map((path, index) => {
                    return <div key={index} className='image-block'>
                      <img className="settings" src={settingsIcon} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="#"/>
                      <div className="dropdown-menu dropdown-menu-right">
                        {
                          productId ?
                            <button
                              title="Вы можете сделать главными только те фотографии которые уже загрузили на сервер, например эту :)) !"
                              className="dropdown-item"
                              type="button"
                              onClick={() => this.makeTheMain(index, imagesForDraw, productId)}
                            >
                              Сделать главным
                              </button>
                            : null
                        }
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => this.removePhotoWithServer(path, productId, imagesForDraw)}
                        >
                          Удалить фото {<br />}
                          из сервера
                          </button>
                      </div>
                      {console.log(path)}
                      <img className="product-img" src={path} alt="#"/>
                    </div>
                  })
                  : null
              }
              {
                imagesBlobArray.length ? this.renderPhotos(imagesBlobArray) : null
              }

            </div>
          </div>

          <label htmlFor="keyWords">Ключевые слова<span className="red">*</span></label>
          <textarea
            id="keyWords"
            type="text"
            name="keyWords"
            value={keyWords}
            placeholder="ключевые слова"
            onChange={this.onChange}
            title="Разделите слова запятыми и не надо никаких пробелов!!!"
            className={`keyWords ${isInvalidSubmit && !keyWords ? "error" : ""}`}
          />
          <label htmlFor="category">Выберите к какой/каким категории/категориям относится данный товар</label>
          <Select
            closeMenuOnSelect={false}
            isMulti
            onChange={this.selectChange}
            options={categories}
            className={`${isInvalidSubmit && !categoriesId.length ? "error" : ""}`}
            value={(() => {
              var selectedValues = [];
              categoriesId.forEach(categoryId => {
                categories.forEach(data => {
                  if (data.label === categoryId.label) {
                    selectedValues.push(data)
                  }
                })
              })
              if (selectedValues) {
                selectedValues.label = selectedValues.label;
                selectedValues.value = selectedValues.value;
              }
              return selectedValues;
            })()}
          />
          <button type="submit" className="btn btn-outline-primary">{`${productId ? "Обнавить" : "Добавить"}`}</button>
        </form>
      </div> : null
    );
  }
}
export default withRouter(Product);