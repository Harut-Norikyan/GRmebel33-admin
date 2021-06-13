import Api from "../../Api";
import { takeLatest, put, call } from 'redux-saga/effects';

import {
  REGISTRATION_REQUEST,
  REGISTRATION_SUCCESS,
  REGISTRATION_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from "../actions/users";
import { addPageSpinner, removePageSpinner } from "../actions/spinner";
import uuid from "react-uuid";

export default function* watcher() {
  yield takeLatest(REGISTRATION_REQUEST, registration);
  yield takeLatest(LOGIN_REQUEST, login);
}

function* registration(action) {
  try {
    const { firstName, lastName, email, password } = action.payload;
    yield call(Api.registration, firstName, lastName, email, password);
    yield put({
      type: REGISTRATION_SUCCESS,
      payload: {},
    });
    const user = yield call(Api.login, email, password);
    yield put({
      type: LOGIN_SUCCESS,
      payload: { user },
    });
  } catch (error) {
    yield put({
      type: REGISTRATION_FAIL,
    });
  }
}

function* login(action) {
  const spinnerId = uuid()
  try {
    const { email, password } = action.payload;
    yield put(addPageSpinner(spinnerId));
    const user = yield call(Api.login, email, password);
    yield put({
      type: LOGIN_SUCCESS,
      payload: { user },
    });
    yield put(removePageSpinner(spinnerId));
  } catch (error) {
    yield put({
      type: LOGIN_FAIL,
      payload: error.message
    });
    yield put(removePageSpinner(spinnerId));
  }
}