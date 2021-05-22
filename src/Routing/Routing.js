import React from 'react';
import Home from '../Pages/Home';
import Product from "../Pages/Product";
import Categories from "../Pages/Categories";
import AboutUs from "../Pages/AboutUs";
import AllProducts from "../Pages/AllProducts";
import Wrapper from '../Components/Wrapper';
import Login from '../Pages/Login';
import Registration from '../Pages/Registration';
import { Route, Switch } from 'react-router';

const AdminRouting = () => {
  return (
    <Switch>
      <Route path='/gr-admin' exact component={Login} />
      <Route path='/gr-admin/registration' exact component={Registration} />
      <Wrapper>
        <Route path='/gr-admin/home' exact component={Home} />
        <Route path='/gr-admin/product' exact component={Product} />
        <Route path='/gr-admin/product/:id' exact component={Product} />
        <Route path='/gr-admin/categories' exact component={Categories} />
        <Route path='/gr-admin/about-us' exact component={AboutUs} />
        <Route path='/gr-admin/all-products' exact component={AllProducts} />
      </Wrapper>
    </Switch>
  );
}

export default AdminRouting;