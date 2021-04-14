import React from 'react';
import Home from '../User/UserPages/Home';
import { Route, Switch } from 'react-router';

const UserRouting = () => {
  return (
    <Switch>
      <Route path='/' exact component={Home} />
    </Switch>
  );
}

export default UserRouting;