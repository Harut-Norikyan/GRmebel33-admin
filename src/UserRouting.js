import React from 'react';
import Home from './User/Pages/Home';
import { Route, Switch } from 'react-router';
import Categories from './User/Pages/Categories';
import Category from './User/Pages/Category';
import Wrapper from './User/Components/Wrapper';
import Login from './Admin/Pages/Login';
import FeedBack from './User/Components/FeedBack';
import Product from './User/Pages/Product';
import Search from './User/Pages/Search';
import WishList from './User/Pages/WishList';
import AboutUs from './User/Pages/AboutUs';

const goToTop = () => {
  window.scrollTo(0, 0);
}

const UserRouting = () => {
  return (
    <Switch>
      <Route path='/gr-admin' exact component={Login} />
      {/* <Route path='/gr-admin/registration' exact component={Registration} /> */}
      <Wrapper>
        <Route path='/' exact component={Home} />
        <Route path='/about-us' exact component={AboutUs} />
        <Route path='/categories' exact component={Categories} />
        <Route path='/category/:id' exact component={Category} />
        <Route path='/product/:id' exact component={Product} />
        <Route path='/search' exact component={Search} />
        <Route path='/wish-list' exact component={WishList} />
        <div className="bottom-ruler slide-up-button" onClick={goToTop}><i className="fas fa-chevron-up"></i></div>
        <FeedBack />
      </Wrapper>
    </Switch>
  );
}

export default UserRouting;