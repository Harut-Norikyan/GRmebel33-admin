import React, { Component } from 'react';
import Select from 'react-select';
import Api from "../Api";
import AlertService from '../Services/AlertService';

class Product extends Component {

  state = {
    productId: this.props.match.params.id || null,
    categories: [],
    productById: null,
    form: {
      name: "",
      description: "",
      price: 0,
      minPrice: false,
      newPrice: 0,
      discount: false,
      images: [],
      keyWords: '',
      categoriesId: []
    }
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
          form: {
            ...prevState.form,
            categoriesId: JSON.parse(product.categoriesId),
            description: product.description,
            discount: product.discount,
            images: JSON.parse(product.images),
            keyWords: product.keyWords ? JSON.parse(product.keyWords).join() : '',
            name: product.name,
            newPrice: product.newPrice,
            price: product.price,
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

  handleChange = selectedOption => {
    const categoriesId = [];
    selectedOption.map(elem => {
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
    this.setState(prevState => ({
      ...prevState,
      form: {
        ...prevState.form,
        [event.target.name]: event.target.checked
      }
    }));
  }

  onChangeFile = (event) => {
    const { productId } = this.state;
    if (productId) {
      let img = event.target?.files;
      let { images } = this.state.form;
      for (const i of img) {
        images.push(i)
      }
      this.setState(prevState => ({
        ...prevState,
        form: {
          ...prevState.form,
          images,
        }
      }));
    }


    // const { images } = this.state.form;
    // if (event.target.files) {
    //   const fileArray = Array.from(event.target.files).map(file => URL.createObjectURL(file));
    //   fileArray.map(elem => images.push(elem));
    //   console.log(fileArray);
    //   this.setState(prevState => ({
    //     ...prevState,
    //     form: {
    //       ...prevState.form,
    //       images
    //     }
    //   }));
    //   // Array.from(event.target.files).map(file => URL.revokeObjectURL(file))
    // }
  }

  renderPhotos = (sourse) => {
    return sourse.map(photo => {
      console.log(photo, typeof photo);
      return <img className="product-img" src={photo} key={photo} />
    })
  }

  onSubmit = (event) => {
    event.preventDefault();
    const form = { ...this.state.form };
    form.categoriesId = form.categoriesId ? JSON.stringify(form.categoriesId) : null;
    // form.images = form.images ? JSON.stringify(form.images) : null;
    form.keyWords = form.keyWords ? JSON.stringify(form.keyWords.split(",")) : null;
    // if (form.name && form.description && form.price && form.images && form.keyWords && form.categoriesId) {
    Api.addProduct(form).then(response => {
      if (response) {
        AlertService.alert("success", response.data.message)
      }
    })
    // }
  }

  render() {
    const { categories, productId } = this.state;
    const { name, description, price, discount, minPrice, newPrice, images, categoriesId, keyWords } = this.state.form;
    console.log(images);
    return (
      categories && categoriesId ? <div>
        <h2>{`${!productId ? 'Добавить' : 'Обновить'}`} продукт</h2>
        <form onSubmit={this.onSubmit} className="product-form">
          <label htmlFor="name">Названия</label>
          <input
            id="name"
            type="text"
            name="name"
            value={name}
            placeholder="названия"
            onChange={this.onChange}
          />
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            type="text"
            placeholder="описание"
            name="description"
            value={description}
            onChange={this.onChange}
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
          <label htmlFor="price">{`Цена ${minPrice ? 'от' : ''}`}</label>
          <input
            id="price"
            type="number"
            placeholder="цена"
            name="price"
            value={price}
            onChange={this.onChange}
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
                  value={newPrice}
                  placeholder="новая цена"
                  onChange={this.onChange}
                />
              </>
              : null
          }
          <input
            type="file"
            name="images"
            multiple
            onChange={this.onChangeFile}
          />
          <div className="product-image-block">
            {
              images ? this.renderPhotos(images) : null
            }
          </div>
          <label htmlFor="keyWords">Ключевые слова</label>
          <textarea
            id="keyWords"
            type="text"
            name="keyWords"
            value={keyWords}
            placeholder="ключевые слова"
            onChange={this.onChange}
          />
          <label htmlFor="category">Выберите категорию</label>
          <Select
            closeMenuOnSelect={false}
            isMulti
            // defaultValue={[{value:"111",label:"111"},{value:"222",label:"222"}]}
            onChange={this.handleChange}
            options={categories}
          />
          <button type="submit">Send</button>
        </form>
      </div> : null
    );
  }
}

export default Product;