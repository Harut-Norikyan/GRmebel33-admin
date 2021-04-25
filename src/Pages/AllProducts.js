import React, { Component } from 'react';
import { MdUpdate } from 'react-icons/md';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import { Link, withRouter } from 'react-router-dom';
import Api from '../Api';
import AlertService from '../Services/AlertService';

class AllProducts extends Component {

  state = {
    products: [],
  }

  componentDidMount() {
    this.getProducts();
  }

  getProducts = () => {
    Api.getProducts().then(response => {
      if (response) {
        this.setState({ products: response.data.products })
      }
    })
  }

  removeProduct = (id, name) => {
    const { products } = this.state;
    AlertService.alertConfirm(`Вы действительно хотите удалить ${name} ?`, "Да", "Нет").then(() => {
      Api.removeProduct(id).then(response => {
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
    const { products } = this.state;
    console.log(products);
    return (
      <div>
        <h2>Продукты</h2>
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
                      <img className="td-img" src={`http://localhost:4000/${JSON.parse(product.images)[0]}`} />
                    }
                  </td>
                  <td><p className="td-desc">{product.description}</p></td>
                  <td className="center blue icon">
                    <Link to={`/gr-admin/product/${product._id}`}>
                      <MdUpdate />
                    </Link>
                  </td>
                  <td className="center red icon" onClick={() => this.removeProduct(product._id, product.name)}><RiDeleteBin2Fill /></td>
                </tr>
              }) : null
            }
          </tbody>
        </table>
        <Link to="/gr-admin/product">Добавить продукт</Link>
      </div>
    );
  }
}

export default withRouter(AllProducts)
