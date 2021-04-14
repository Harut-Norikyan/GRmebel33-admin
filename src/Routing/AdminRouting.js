import React from 'react';
import Home from '../Admin/AdminPages/Home';
import Product from "../Admin/AdminPages/Product";
import Categories from "../Admin/AdminPages/Categories";
import AboutUs from "../Admin/AdminPages/AboutUs";
import AllProducts from "../Admin/AdminPages/AllProducts";
import Wrapper from '../Admin/AdminComponents/Wrapper';
import Login from '../Admin/AdminPages/Login';
import Registration from '../Admin/AdminPages/Registration';
import { Route, Switch } from 'react-router';

const AdminRouting = () => {
  return (
    <Switch>
      <Route path='/gr-admin' exact component={Login} />
      <Route path='/gr-admin/registration' exact component={Registration} />
      <Wrapper>
        <Route path='/gr-admin/home' exact component={Home} />
        <Route path='/gr-admin/product' exact component={Product} />
        <Route path='/gr-admin/categories' exact component={Categories} />
        <Route path='/gr-admin/about-us' exact component={AboutUs} />
        <Route path='/gr-admin/all-products' exact component={AllProducts} />
      </Wrapper>
    </Switch>
  );
}

export default AdminRouting;