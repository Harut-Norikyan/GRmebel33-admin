import React, { Component } from 'react';
import { addPageSpinner, removePageSpinner } from "../../store/actions/spinner";
import { connect } from "react-redux";
import uuid from 'react-uuid';
import Api from "../../Api";

class AboutUs extends Component {

  state = {
    aboutUsDescription: ''
  }

  componentDidMount() {
    this.getAboutUsDescription()
  }

  getAboutUsDescription = () => {
    const spinnerId = uuid();
    this.props.addPageSpinner(spinnerId)
    Api.getAboutUsDescription().then(response => {
      this.props.removePageSpinner(spinnerId);
      response.data?.data && this.setState({ aboutUsDescription: response.data.data.description })
    })
  }

  render() {
    const { aboutUsDescription } = this.state;
    return (
      <section className="section category">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title">
                <h1>о нас</h1>
              </div>
            </div>
            <div className="col-12">
              <div className="card">
                {
                  aboutUsDescription ?
                    <div className="card-body">
                      {aboutUsDescription}
                    </div>
                    : null
                }
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

const mapDispatchToProps = {
  addPageSpinner,
  removePageSpinner
}

export default connect(null, mapDispatchToProps)(AboutUs)
