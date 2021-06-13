import Api from "../../Api";
import { takeLatest, put, call } from 'redux-saga/effects';
import {
  SEARCH_PRODUCT_REQUSET,
  SEARCH_PRODUCT_SUCCESS,
  SEARCH_PRODUCT_FAIL,
} from "../actions/products";
import uuid from "react-uuid";
import { addPageSpinner, removePageSpinner } from "../actions/spinner";

export default function* watcher() {
  yield takeLatest(SEARCH_PRODUCT_REQUSET, searchProduct);
}

function* searchProduct(action) {
  const spinnerId = uuid();
  try {
    const data = action.payload;
    yield put(addPageSpinner(spinnerId));
    const products = yield call(Api.searchProduct, data);
    yield put({
      type: SEARCH_PRODUCT_SUCCESS,
      payload: products,
    });
    yield put(removePageSpinner(spinnerId));
  } catch (error) {
    yield put({
      type: SEARCH_PRODUCT_FAIL,
    });
    yield put(removePageSpinner(spinnerId));
  }
}