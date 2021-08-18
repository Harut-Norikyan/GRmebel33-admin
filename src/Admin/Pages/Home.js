import React, { Component } from 'react';
import { MdUpdate } from 'react-icons/md';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../..';
import Api from '../../Api';
import AlertService from '../../Services/AlertService';

class Home extends Component {

  state = {
    text: "",
    products: [],
    isinvalidSubmit: false
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value, isinvalidSubmit: false })
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

  onSubmit = (event) => {
    event.preventDefault();
    let { text } = this.state;
    if (!text) {
      this.setState({ isinvalidSubmit: true });
    } else {
      text = text.split(" ");
      Api.searchProduct(text).then(response => {
        if (response?.data?.products?.length) {
          this.setState({ products: response.data.products, text: '' });
        } else {
          AlertService.alert('warning', "Продукт не найден !!!");
          this.setState({ text: '' });
        }
      })
    }
  }

  render() {
    // if (localStorage.getItem("token") === undefined || null) {
    //   return <Redirect to="/gr-admin" />
    // }

    const { products, text, isinvalidSubmit } = this.state;

    return (
      <div className="container">
        <div className="home-containe pr-5">
          <h2 className="title">Искать продукт</h2>
          <form onSubmit={this.onSubmit}>
            <div className="d-flex search-block">
              <input
                className={`form-control mb-10 mr-2 ${isinvalidSubmit && !text ? "error" : ""}`}
                type="text"
                name="text"
                value={text}
                onChange={this.onChange}
              />
              <button type="submit" className="admin-button">Искать</button>
            </div>
          </form>
          <div>
            {
              products.length ?
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
                    {products.map(product => {
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
                    })}
                  </tbody>
                </table>
                : null
            }

          </div>
        </div>
      </div>
    );
  }
}

export default Home;