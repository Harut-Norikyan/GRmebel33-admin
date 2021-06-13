import Api from "../../Api";
import { takeLatest, put, call } from 'redux-saga/effects';
import {
  GET_CATEGORIES_REQUSET,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAIL
} from "../actions/categories";
import uuid from "react-uuid";
import { addPageSpinner, removePageSpinner } from "../actions/spinner";

export default function* watcher() {
  yield takeLatest(GET_CATEGORIES_REQUSET, getCategories);
}

function* getCategories(action) {
  const spinnerId = uuid();
  try {
    const currentPageNumber = action.payload;
    yield put(addPageSpinner(spinnerId));
    const categoies = yield call(Api.getCategories, currentPageNumber);
    yield put({
      type: GET_CATEGORIES_SUCCESS,
      payload: categoies,
    });
    yield put(removePageSpinner(spinnerId));
  } catch (error) {
    yield put({
      type: GET_CATEGORIES_FAIL,
    });
    yield put(removePageSpinner(spinnerId));
  }

}