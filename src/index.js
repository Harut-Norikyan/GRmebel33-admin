import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import App from './App';
import reportWebVitals from './reportWebVitals';

import reducer from './store/reducers';
import watchers from './store/sagas';

import "./User/Css/style.css";
import "./Admin/Css/style.css";

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.min.js';
// import 'jquery/dist/jquery.min.js';

import 'react-notifications/lib/notifications.css';
import "react-multi-carousel/lib/styles.css";

export const getImageUrl = process.env.NODE_ENV === 'production'
  ? 'https://gr-mebel-admin.herokuapp.com/gr-admin/get-image'
  : 'http://localhost:4000/gr-admin/get-image';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const saga = createSagaMiddleware();
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(saga)),
);
saga.run(watchers);
window.store = store;


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
reportWebVitals();