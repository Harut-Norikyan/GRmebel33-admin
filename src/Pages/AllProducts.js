import React, { Component } from 'react';
import { MdUpdate } from 'react-icons/md';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import { Link, withRouter } from 'react-router-dom';
import Api from '../Api';

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

  removeProductById = () => {

  }

  render() {
    const { products } = this.state;
    return (

      <div>
        <h2>Продукты</h2>
        <table id="customers">
          <thead>
            <tr>
              <th>Название продукта</th>
              <th>Обновить</th>
              <th>Удалить</th>
            </tr>
          </thead>
          <tbody>
            {
              products ? products.map(product => {
                return <tr key={product._id}>
                  <td>{product.name}</td>
                  <td className="center blue icon">
                    <Link to={`/gr-admin/product/${product._id}`}>
                      <MdUpdate />
                    </Link>
                  </td>
                  <td className="center red icon" onClick={() => this.removeProductById(product)}><RiDeleteBin2Fill /></td>
                </tr>
              }) : null
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default withRouter(AllProducts)
