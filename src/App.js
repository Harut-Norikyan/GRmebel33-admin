import React, { Component } from 'react';
import { NotificationContainer } from 'react-notifications';
import Routing from './Routing';

class App extends Component {
  render() {
    return (
      <div>
        <Routing />
        <NotificationContainer />
      </div>
    );
  }
}

export default App;