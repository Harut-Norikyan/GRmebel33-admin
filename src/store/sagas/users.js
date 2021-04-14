import Api from "../../ApiService/AdminApi";
import { takeLatest, put, call } from 'redux-saga/effects';

import {
  REGISTRATION_REQUEST,
  REGISTRATION_SUCCESS,
  REGISTRATION_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from "../actions/users";

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
  try {
    const { email, password } = action.payload;
    const user = yield call(Api.login, email, password)
    yield put({
      type: LOGIN_SUCCESS,
      payload: { user },
    });
  } catch (error) {
    yield put({
      type: LOGIN_FAIL,
      payload : error.message
    });
  }
}