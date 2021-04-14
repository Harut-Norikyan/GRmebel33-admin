import React, { Component } from 'react';
import { NotificationContainer } from 'react-notifications';
import { BrowserRouter, Redirect } from 'react-router-dom';
import { withRouter } from "react-router";
import Routing from './Routing/Routing';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routing />
        <NotificationContainer />
        {/* <Redirect from="/" to="/" /> */}
      </BrowserRouter>
    );
  }
}
export default App;