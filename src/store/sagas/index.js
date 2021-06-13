import { all, fork } from 'redux-saga/effects';
import users from "./users";
import categories from "./categories";
import products from "./products";

export default function* watchers() {
  yield all([
    users,
    categories,
    products
  ].map(fork));
}