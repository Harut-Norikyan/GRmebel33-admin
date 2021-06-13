import React, { Component } from 'react';
import Api from '../../Api';
import AlertService from '../../Services/AlertService';
import { connect } from "react-redux";
import { addPageSpinner, removePageSpinner } from "../../store/actions/spinner";
import uuid from 'react-uuid';

class AboutUs extends Component {

  state = {
    description: '',
    descId: null,
  }
  
  componentDidMount() {
    this.getDescription()
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  getDescription = () => {
    const spinnerId = uuid();
    this.props.addPageSpinner(spinnerId);
    Api.getAboutUsDescription().then(response => {
      this.props.removePageSpinner(spinnerId);
      const data = { ...response.data.data };
      data && this.setState({ description: data.description, descId: data._id })
    }).catch(error => this.getFail(error, spinnerId))
  }

  getFail = (error, spinnerId) => {
    error && AlertService.alert("error", error);
    spinnerId && this.props.removePageSpinner(spinnerId);
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
      <div className="container">
        <h2 className="title">О нас</h2>
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
            <button type="submit" className="admin-button">{`${descId ? "Обновить" : "Добавить"}`}</button>
          </div>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = {
  addPageSpinner,
  removePageSpinner
}

export default connect(null, mapDispatchToProps)(AboutUs);
