import React, { Component } from 'react';
import { Redirect } from 'react-router';
import LeftSiteBar from "./LeftSiteBar";

class Wrapper extends Component {

  state = {
    user: null || JSON.parse(localStorage.getItem("user")),
    token: null || localStorage.getItem("token"),
  }

  render() {
    if (!localStorage.getItem("token")) {
      return <Redirect to="/" />
    }
    const { user, token } = this.state;
    return (
      (user && token) ?
        <div className="global-container">
          <LeftSiteBar />
          <div className='right-site-bar'>
            {this.props.children}
          </div>
        </div>
        : null
    );
  }
}

export default Wrapper;