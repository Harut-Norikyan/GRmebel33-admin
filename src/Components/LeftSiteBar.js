import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

class LeftSiteBar extends Component {

  state = {
    user: null || JSON.parse(localStorage.getItem("user"))
  }

  ucFirst = (str) => {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
  }

  logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.props.history.push("/")
  }

  render() {
    const { user } = this.state;
    return (
      user &&
      <div className="container-left">
        <div className="img-block">
          <p>{user.firstName.slice(0, 1).toUpperCase()}</p>
          <p>{user.lastName.slice(0, 1).toUpperCase()}</p>
        </div>
        <span className="name">
          <p>{this.ucFirst(user.firstName)} {this.ucFirst(user.lastName)}</p>
        </span>
        <div className="line" />
        <Link to="/product">
          Add Product
         </Link>
        <div className="line" />
        <Link to="/all-products">
          All Products
         </Link>
        <div className="line" />
        <button onClick={this.logOut}>Log Out</button>
      </div>
    );
  }
}

export default withRouter(LeftSiteBar);