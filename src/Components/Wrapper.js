import React, { Component } from 'react';
import { Redirect } from 'react-router';
import LeftSiteBar from "./LeftSiteBar";

class Wrapper extends Component {
  render() {
    if (!localStorage.getItem("token")) {
      return <Redirect to="/gr-admin" />
    }
    return (
      <div className="global-container">
        <LeftSiteBar />
        <div className='right-site-bar'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Wrapper;