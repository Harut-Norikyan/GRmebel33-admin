import React, { Component } from 'react';
import { addPageSpinner, removePageSpinner } from "../../store/actions/spinner";
import { connect } from "react-redux";
import uuid from 'react-uuid';
import Api from "../../Api";
import { YMaps, Map, Placemark } from "react-yandex-maps";

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

    // const mapData = {
    //   center: [55.751574, 37.573856],
    //   zoom: 7,
    // };

    // const coordinates = [
    //   [55.684758, 37.738521],
    //   [57.684758, 39.738521]
    // ];

    const mapData = {
      center: [55.987678, 40.018289],
      zoom: 9,
    };

    const coordinates = [
      [55.987678, 40.018289],
    ];

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
          <div className="row my-3">
            <div className="col-12" >
              <hr />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="section-title">
                <h1>Как добраться до нас</h1>
              </div>
            </div>
            <div className="col-12">
              <div className="map">
                <YMaps>
                  <Map defaultState={mapData} width="80" height="300px">
                    {coordinates.map((coordinate, index) =>
                      <Placemark
                        key={index}
                        geometry={coordinate}
                      />
                    )}
                  </Map>
                </YMaps>
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
