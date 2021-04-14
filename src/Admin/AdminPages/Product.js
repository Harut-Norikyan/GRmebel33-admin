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
    const { images } = this.state;

    this.setState({
      images: [...images, event.target.files[0]]
    })

    // this.readFile(event.target.files[0],['jpeg', 'png', 'jpg']).then(image=>{
    //   this.setState({
    //     img: image
    //   })
    // })
  }

 readFile(file, validFileTypes = null) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      const fileName = file.name;
      const lastDotIndex = fileName.lastIndexOf('.');
      const fileExtention = lastDotIndex !== -1 ? fileName.substring(lastDotIndex + 1).toLowerCase() : ' ';
      const isValid = validFileTypes.find(data => data === fileExtention);
      !isValid && reject(true);
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        resolve(reader.result);
      }
    });
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
                  <img className="product-img" src={img} alt="/" multiple/>
                </>
                : null
            } */}
            {
              images && images.map(img => {
                console.log(this.readFile(img, ['jpeg', 'png', 'jpg']));
                this.readFile(img, ['jpeg', 'png', 'jpg']).then(image=>{
                  console.log(image);
                  // <img className="product-img" multiple src={image}/>
                })
                // <img className="product-img" src={this.readFile(img, ['jpeg', 'png', 'jpg'])} alt="/" multiple/>
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