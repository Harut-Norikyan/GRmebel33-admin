import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Home from './Pages/Home';
import Product from "./Pages/Product";
import Categories from "./Pages/Categories";
import AboutUs from "./Pages/AboutUs";
import AllProducts from "./Pages/AllProducts";
import Wrapper from './Components/Wrapper';
import Login from './Pages/Login';
import Registration from './Pages/Registration';

class Routing extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
            <Route path='/' exact component={Login} />
            <Route path='/registration' exact component={Registration} />
            <Wrapper>
              <Route path='/home' exact component={Home} />
              <Route path='/product' exact component={Product} />
              <Route path='/categories' exact component={Categories} />
              <Route path='/about-us' exact component={AboutUs} />
              <Route path='/about-us' exact component={AboutUs} />
              <Route path='/all-products' exact component={AllProducts} />
            </Wrapper>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Routing;