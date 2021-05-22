import React, { Component } from 'react';
import { NotificationContainer } from 'react-notifications';
import { BrowserRouter } from 'react-router-dom';
import Routing from './Routing/Routing';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routing />
        <NotificationContainer />
      </BrowserRouter>
    );
  }
}
export default App;