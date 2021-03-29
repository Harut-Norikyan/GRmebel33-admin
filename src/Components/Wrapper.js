import React, { Component } from 'react';
import { Redirect } from 'react-router';
import LeftSiteBar from "./LeftSiteBar";

class Wrapper extends Component {
  render() {
    if (!localStorage.getItem("token")) {
      return <Redirect to="/" />
    }
    return (
      <div className="container">
        <LeftSiteBar />
        {this.props.children}
      </div>
    );
  }
}

export default Wrapper;