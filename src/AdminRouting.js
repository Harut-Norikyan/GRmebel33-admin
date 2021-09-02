import React from 'react';
import Home from './Admin/Pages/Home';
import Product from "./Admin/Pages/Product";
import Categories from "./Admin/Pages/Categories";
import AboutUs from "./Admin/Pages/AboutUs";
import AllProducts from "./Admin/Pages/AllProducts";
import Wrapper from './Admin/Components/Wrapper';
import Login from './Admin/Pages/Login';
import { Route, Switch } from 'react-router';
import Colors from './Admin/Pages/Colors';
import ChangePrices from './Admin/Pages/ChangePrices';
import AllProductsByCategory from './Admin/Pages/AllProductsByCategory';

const AdminRouting = () => {
  return (
    <Switch>
      <Route path='/gr-admin' exact component={Login} />
      {/* <Route path='/gr-admin/registration' exact component={Registration} /> */}
      <Wrapper>
        <Route path='/gr-admin/home' exact component={Home} />
        <Route path='/gr-admin/product' exact component={Product} />
        <Route path='/gr-admin/product/:id' exact component={Product} />
        <Route path='/gr-admin/categories' exact component={Categories} />
        <Route path='/gr-admin/colors' exact component={Colors} />
        <Route path='/gr-admin/about-us' exact component={AboutUs} />
        <Route path='/gr-admin/all-products' exact component={AllProducts} />
        <Route path='/gr-admin/all-products-by-category' exact component={AllProductsByCategory} />
        <Route path='/gr-admin/change-prices' exact component={ChangePrices} />
      </Wrapper>
    </Switch>
  );
}

export default AdminRouting;