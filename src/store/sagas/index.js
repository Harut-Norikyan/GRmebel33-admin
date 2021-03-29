import { all, fork } from 'redux-saga/effects';
import users from "./users";

export default function* watchers() {
  yield all([
    users,
  ].map(fork));
}