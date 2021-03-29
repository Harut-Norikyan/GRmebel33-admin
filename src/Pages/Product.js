import React, { Component } from 'react';
import Select from 'react-select';

class Product extends Component {

  state = {
    name: "",
    description: "",
    price: 0,
    newPrice: 0,
    discount: false,
    images: [],
    img: '',
    categoryName: null,
    keyWords: []
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  onChangeFile = (event) => {
    console.log(URL.createObjectURL(event.target.files[0]), "img 1");
    const { images } = this.state;

    this.setState({
      images: [...images, URL.createObjectURL(event.target.files[0])]
    })
  }

  onSubmit = (event) => {
    event.preventDefault();
    console.log(this.state);
  }

  render() {
    const options = [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' }
    ]

    let { img, images } = this.state;
    // var imgArr = [
    //   "blob:http://localhost:3000/6f98abd0-6c4b-4078-a626-e059dd7a4ba4",
    //   "blob:http://localhost:3000/85b14e00-06ec-42a9-9d96-56e8c924e4e5"
    // ]
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            name="name"
            placeholder="name"
            onChange={this.onChange}
          />
          <input
            type="text"
            placeholder="description"
            name="description"
            onChange={this.onChange}
          />
          <input
            type="number"
            placeholder="price"
            name="price"
            onChange={this.onChange}
          />
          <input
            type="text"
            name="newPrice"
            placeholder="New price"
            onChange={this.onChange}
          />
          <input
            type="file"
            name="images"
            multiple
            onChange={this.onChangeFile}
          />

          <input type="text"
            name="keyWords"
            placeholder="keywords"
            onChange={this.onChange}
          />
          <Select
            closeMenuOnSelect={false}
            isMulti
            options={options}
          />
          <div className="product-image-block">
            {/* {
              img ?
                <>
                  <img className="product-img" src={img} alt="/" />
                </>
                : null
            } */}
            {
              images && images.map(img => {
                console.log(img);
                // <img className="product-img" src={img} alt="/" />
              })
            }
            
          </div>
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }
}

export default Product;