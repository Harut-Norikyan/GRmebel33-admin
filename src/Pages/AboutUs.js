import React, { Component } from 'react';

class AboutUs extends Component {

  state = {
    description: ''
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onSubmit = (event) => {
    event.preventDefault();
    
    this.setState({ description: ''})
  }
  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            name="description"
            value={this.state.description}
            onChange={this.onChange}
          />
          <button>
            Add Description
          </button>
        </form>
      </div>
    );
  }
}

export default AboutUs;