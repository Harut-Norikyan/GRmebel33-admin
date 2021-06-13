import React, { Component } from 'react';
import { NotificationContainer } from 'react-notifications';
import { BrowserRouter } from 'react-router-dom';
import Routing from './Routing';
import { connect } from "react-redux";
import { addPageSpinner, removePageSpinner } from "./store/actions/spinner";
import { getCategories } from "./store/actions/categories";
import PageSpinner from './User/Components/Spinners/PageSpinner';

class App extends Component {

  componentDidMount() {
    this.props.getCategories(1);
  }

  render() {
    return (
      <BrowserRouter>
        <Routing />
        <NotificationContainer />
        <PageSpinner spinners={this.props.pageSpinners} />
      </BrowserRouter>
    );
  }
}
const mapStateToProps = state => ({
  pageSpinners: state.spinner.pageSpinners,
})

const mapDispatchToProps = {
  addPageSpinner,
  removePageSpinner,
  getCategories,
}

export default connect(mapStateToProps, mapDispatchToProps)(App);