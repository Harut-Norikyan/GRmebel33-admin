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
        <h2>О нас</h2>
        <form onSubmit={this.onSubmit}>
          <div className="about-us-block">
          <textarea
            type="text"
            cols='50'
            rows='10'
            name="description"
            wrap='hard'
            style={{ padding: '10px', whiteSpace: 'nowrap' }}
            value={this.state.description}
            onChange={this.onChange}
          />
          <button type="submit" className="btn btn-outline-primary">{`${descId ? "Обнавить" : "Добавить"}`}</button>
          </div>
        </form>
      </div>
    );
  }
}

export default AboutUs;