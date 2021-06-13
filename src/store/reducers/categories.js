import {
  GET_CATEGORIES_REQUSET,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAIL,
} from "../actions/categories";

const initialState = {
  categories: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    ////Categories
    case GET_CATEGORIES_REQUSET:
      return {
        ...state,
        requestStatus: "request"
      }
    case GET_CATEGORIES_SUCCESS:
      return {
        ...state,
        requestStatus: "success",
        categories: action.payload.data.categories
      }
    case GET_CATEGORIES_FAIL:
      return {
        ...state,
        requestStatus: "fail",
      }

    default:
      return state;
  }
}