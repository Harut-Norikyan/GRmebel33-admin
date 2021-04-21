import React, { Component } from 'react';
import Api from '../Api';
import AlertService from '../Services/AlertService';

class AboutUs extends Component {

  state = {
    description: '',
    descId: null,
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  componentDidMount() {
    this.getDescription()
  }

  getDescription = () => {
    Api.getAboutUsDescrition().then(response => {
      const data = { ...response.data.data };
      this.setState({ description: data.description, descId: data._id })
    })
  }

  onSubmit = (event) => {
    event.preventDefault();
    const { description, descId } = this.state;
    if (!descId) {
      Api.addAboutUsDescrition(description).then(response => {
        const data = { ...response.data };
        data && AlertService.alert("success", data.message);
      })
    } else {
      Api.updateAboutUsDescrition(description, descId).then(response => {
        const data = { ...response.data };
        data && AlertService.alert("success", data.message);
      })
    }
  }

  render() {
    const { descId } = this.state;
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <textarea
            type="text"
            cols='50'
            rows='10'
            name="description"
            style={{ padding: '10px', whiteSpace: 'nowrap' }}
            value={this.state.description}
            onChange={this.onChange}
          />
          <button>
            {`${descId ? "update" : "create"}`}
          </button>
        </form>
      </div>
    );
  }
}

export default AboutUs;