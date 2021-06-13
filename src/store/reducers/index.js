import { combineReducers } from 'redux';
import users from "./users";
import spinner from "./spinner";
import categories from "./categories";
import products from "./products";

export default combineReducers({
  users,
  spinner,
  categories,
  products
});
