import React, { Component } from 'react';
import Select from 'react-select';
import Api from "../../Api";
import AlertService from '../../Services/AlertService';
import settingsIcon from "../Images/settings (2).png";
import cameraGrey from "../Images/camera-grey.png";
import { getImageUrl } from '../..';
import { connect } from "react-redux";
import { addPageSpinner, removePageSpinner } from "../../store/actions/spinner";
import uuid from 'react-uuid';
import Auxiliary from '../../User/Components/Auxiliary';

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
      categoriesId: [],
      colorsId: [],
      isRrunningMeter: false
    },
    productId: this.props.match.params.id || null,
    categories: [],
    productById: null,
    imagesForDraw: [],
    imagesBlobArray: [],
    isInvalidSubmit: false,
    colors: [],
  }

  componentDidMount() {
    const { productId } = this.state;
    if (productId) {
      this.getProductById(productId);
    }
    this.getCategories();
    this.getColors();
  }

  getProductById = (productId) => {
    const spinnerId = uuid();
    this.props.addPageSpinner(spinnerId);
    Api.getProductById(productId).then(response => {
      this.props.removePageSpinner(spinnerId)
      if (response.data) {
        const { product } = { ...response.data };
        this.setState(prevState => ({
          ...prevState,
          imagesForDraw: JSON.parse(product.images) || [],
          form: {
            ...prevState.form,
            categoriesId: product.categoriesId ? JSON.parse(product.categoriesId) : [],
            colorsId: product.colorsId ? JSON.parse(product.colorsId) : [],
            description: product.description || "",
            discount: product.discount || false,
            keyWords: product.keyWords ? JSON.parse(product.keyWords).join() : '',
            name: product.name || "",
            newPrice: product.newPrice || "",
            price: product.price || "",
            minPrice: product.minPrice,
            isRrunningMeter: product.isRrunningMeter
          }
        }))
      }
    }).catch(error => this.getFail(error, spinnerId))
  }

  getCategories = () => {
    const spinnerId = uuid();
    this.props.addPageSpinner(spinnerId);
    Api.getCategories().then(response => {
      this.props.removePageSpinner(spinnerId);
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
    }).catch(error => this.getFail(error, spinnerId))
  }

  getColors = () => {
    const spinnerId = uuid();
    this.props.addPageSpinner(spinnerId);
    Api.getColors().then(response => {
      this.props.removePageSpinner(spinnerId);
      const colors = [];
      if (response.data.colors) {
        response.data.colors.forEach(element => {
          colors.push({
            value: element._id,
            label: element.color,
            colorCode: element.colorCode
          })
        });
        this.setState({ colors });
      }
    }).catch(error => this.getFail(error, spinnerId))
  }

  getFail = (error, spinnerId) => {
    error && AlertService.alert("error", error);
    spinnerId && this.props.removePageSpinner(spinnerId);
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

  selectChange = (selectedOption, array) => {
    const idsArray = [];
    selectedOption.forEach(elem => {
      idsArray.push(elem)
    });
    this.setState(prevState => ({
      ...prevState,
      form: {
        ...prevState.form,
        [array]: idsArray
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
          <div data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <img className="settings" src={settingsIcon} alt="#" />
          </div>
          {/* <img className="settings" src={settingsIcon} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="#" /> */}
          <div className="dropdown-menu dropdown-menu-right">
            <button
              className="dropdown-item"
              type="button"
              onClick={() => this.removePhoto(index)}
            >?????????????? ????????</button>
          </div>
          <img className="product-img" src={photo} alt="#" />
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

  removePhotoWithServer = (path, id, imagesForDraw) => {
    const imagesArrForDraw = [...imagesForDraw];
    var updatedImagesArr = imagesArrForDraw.filter(img => img !== path);
    var imagesArrForSend = [];
    updatedImagesArr.forEach(img => {
      var imgPathArr = img.split("/");
      imagesArrForSend.push(imgPathArr[imgPathArr.length - 1]);
    });
    AlertService.alertConfirm(`???? ?????????????????????????? ???????????? ?????????????? ???????????? ???????????????????? ?`, "????", "??????").then(() => {
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
      AlertService.alert("warning", "???????????? ???????????????????? ?? ???????? ??????????????");
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
    const spinnerId = uuid();
    let { productId, imagesForDraw, isInvalidSubmit } = this.state;
    const form = { ...this.state.form };
    form.categoriesId = form.categoriesId ? JSON.stringify(form.categoriesId) : null;
    form.colorsId = form.colorsId ? JSON.stringify(form.colorsId) : null;
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
        this.props.addPageSpinner(spinnerId);
        Api.updateProduct(form, productId).then(response => {
          this.props.removePageSpinner(spinnerId);
          if (response) {
            AlertService.alert("success", response.data.message);
            this.props.history.push(`/gr-admin/all-products`);
          }
        })
      } else {
        this.props.addPageSpinner(spinnerId);
        Api.addProduct(form).then(response => {
          this.props.removePageSpinner(spinnerId);
          if (response) {
            AlertService.alert("success", response.data.message);
            this.props.history.push(`/gr-admin/all-products`);
          }
        })
      }
    }
  }

  render() {
    const { categories, productId, imagesForDraw, imagesBlobArray, isInvalidSubmit, colors } = this.state;
    const { name, description, price, discount, minPrice, newPrice, images, categoriesId, keyWords, colorsId, isRrunningMeter } = this.state.form;
    return (
      categories && colors ? <div className="container">
        <h2 className="title">{`${!productId ? '????????????????' : '????????????????'}`} ??????????</h2>
        <form onSubmit={this.onSubmit} className="product-form">
          <label htmlFor="name">????????????????<span className="red">*</span></label>
          <input
            id="name"
            type="text"
            name="name"
            value={name}
            placeholder="????????????????"
            onChange={this.onChange}
            className={`name ${isInvalidSubmit && !name ? "error" : ""}`}
          />
          <label htmlFor="description">????????????????<span className="red">*</span></label>
          <textarea
            id="description"
            type="text"
            placeholder="????????????????"
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
            <span>?????????????? ???????????? ???????? ??????????????????????</span>
          </label>
          <label htmlFor="price">{`???????? ${minPrice ? '????' : ''}`}<span className="red">*</span></label>
          <input
            id="price"
            type="number"
            placeholder="????????"
            name="price"
            min="1"
            value={price}
            onChange={this.onChange}
            className={` ${isInvalidSubmit && !price ? "error" : ""}`}
          />
          <label htmlFor="isRrunningMeter">
            <input
              id="isRrunningMeter"
              type="checkbox"
              name="isRrunningMeter"
              checked={isRrunningMeter}
              onChange={this.onCheckboxChange}
            />
            <span>???????? ???? ???????????????? ????????</span>
          </label>
          <label htmlFor="discount">
            <input
              id="discount"
              type="checkbox"
              name="discount"
              checked={discount}
              onChange={this.onCheckboxChange}
            />
            <span>????????????</span>
          </label>

          {
            discount ?
              <Auxiliary>
                <label htmlFor="newPrice">?????????? ????????</label>
                <input
                  id="newPrice"
                  type="number"
                  name="newPrice"
                  min="1"
                  value={newPrice}
                  placeholder="?????????? ????????"
                  onChange={this.onChange}
                  className={` ${isInvalidSubmit && discount && !newPrice ? "error" : ""}`}
                />
                <hr className="w-100 my-2" />
              </Auxiliary>
              : null
          }
          <label htmlFor="">???????????????? ???????????????????? <span className="red">*</span></label>
          <div className={
            `images-block
            ${!productId && !images.length && isInvalidSubmit ? "error" : ""}
            ${productId && !images.length && !imagesForDraw.length && isInvalidSubmit ? "error" : ""}`
          }>
            <div className="upload-img">
              <input type="file" id="upload" hidden name="img" multiple onChange={this.onChangeFile} />
              <label className="labelForUpload" htmlFor="upload">
                <img src={cameraGrey} alt="#" />
              </label>
            </div>
            <div className="product-image-block">
              {
                imagesForDraw.length ?
                  imagesForDraw.map((path, index) => {
                    return <div key={index} className='image-block'>
                      <div data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img className="settings" src={settingsIcon} alt="#" />
                      </div>
                      {/* <img className="settings" src={settingsIcon} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="#" /> */}
                      <div className="dropdown-menu dropdown-menu-right dropdown-window">
                        {
                          productId ?
                            <button
                              title="???? ???????????? ?????????????? ???????????????? ???????????? ???? ???????????????????? ?????????????? ?????? ?????????????????? ???? ????????????, ???????????????? ?????? :)) !"
                              className="dropdown-item"
                              type="button"
                              onClick={() => this.makeTheMain(index, imagesForDraw, productId)}
                            >
                              ?????????????? ??????????????
                            </button>
                            : null
                        }
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => this.removePhotoWithServer(path, productId, imagesForDraw)}
                        >
                          ?????????????? ???????? {<br />}
                          ???? ??????????????
                        </button>
                      </div>
                      <img className="product-img" src={`${getImageUrl}/${path}`} alt="#" />
                    </div>
                  })
                  : null
              }
              {
                imagesBlobArray.length ? this.renderPhotos(imagesBlobArray) : null
              }
            </div>
          </div>
          <label htmlFor="keyWords">???????????????? ??????????<span className="red">*</span></label>
          <textarea
            id="keyWords"
            type="text"
            name="keyWords"
            value={keyWords}
            placeholder="???????????????? ??????????"
            onChange={this.onChange}
            title="?????????????????? ?????????? ???????????????? ?? ???? ???????? ?????????????? ????????????????!!!"
            className={`keyWords ${isInvalidSubmit && !keyWords ? "error" : ""}`}
          />
          <label htmlFor="category">???????????????? ?? ??????????/?????????? ??????????????????/???????????????????? ?????????????????? ???????????? ??????????</label>
          <Select
            closeMenuOnSelect={false}
            isMulti
            onChange={(item) => this.selectChange(item, "categoriesId")}
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
          <label htmlFor="category">??????????</label>
          <Select
            closeMenuOnSelect={false}
            isMulti
            onChange={(item) => this.selectChange(item, "colorsId")}
            options={colors}
            className={`${isInvalidSubmit && !colorsId.length ? "error" : ""}`}
            value={(() => {
              var selectedValues = [];
              colorsId.forEach(courseId => {
                colors.forEach(data => {
                  if (data.label === courseId.label) {
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
          <button type="submit" className="btn btn-outline-primary admin-button">{`${productId ? "????????????????" : "????????????????"}`}</button>
        </form>
      </div> : null
    );
  }
}

const mapDispatchToProps = {
  addPageSpinner,
  removePageSpinner
}

export default connect(null, mapDispatchToProps)(Product)