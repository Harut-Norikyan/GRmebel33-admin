import React, { Component } from 'react';

class Categories extends Component {

  state = {
    categoryName: ''
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onSubmit = (event) => {
    event.preventDefault();

    this.setState({ categoryName: ''})
  }
  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            name="categoryName"
            value={this.state.categoryName}
            onChange={this.onChange}
          />
          <button>
            Add Category
          </button>
        </form>
      </div>
    );
  }
}

export default Categories;