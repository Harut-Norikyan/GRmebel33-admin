import AlertService from "../../Services/AlertService";
import {
  SEARCH_PRODUCT_REQUSET,
  SEARCH_PRODUCT_SUCCESS,
  SEARCH_PRODUCT_FAIL,
  ADD_PRODUCT_TO_WISHLIST,
  REMOVE_PRODUCT_TO_WISHLIST,
} from "../actions/products";

const initialState = {
  findedProducts: [],
  requestStatus: null,
  wishListProductsCount: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    ////Products
    case SEARCH_PRODUCT_REQUSET:
      return {
        ...state,
        requestStatus: "request"
      }
    case SEARCH_PRODUCT_SUCCESS:
      if (!action.payload.data.products.length) {
        AlertService.alert('warning', "Ничего не найдено !!!");
      }
      return {
        ...state,
        requestStatus: "success",
        findedProducts: action.payload.data.products ? action.payload.data.products : null,
      }
    case ADD_PRODUCT_TO_WISHLIST:
      return {
        ...state,
        requestStatus: "success",
        wishListProductsCount: action.payload
      }
    case REMOVE_PRODUCT_TO_WISHLIST:
      return {
        ...state,
        requestStatus: "success",
        wishListProductsCount: action.payload
      }
    case SEARCH_PRODUCT_FAIL:
      return {
        ...state,
        requestStatus: "fail",
      }

    default:
      return state;
  }
}