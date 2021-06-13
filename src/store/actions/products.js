export const SEARCH_PRODUCT_REQUSET = "SEARCH_PRODUCT_REQUSET";
export const SEARCH_PRODUCT_SUCCESS = "SEARCH_PRODUCT_SUCCESS";
export const SEARCH_PRODUCT_FAIL = "SEARCH_PRODUCT_FAIL";
export const ADD_PRODUCT_TO_WISHLIST = "ADD_PRODUCT_TO_WISHLIST";
export const REMOVE_PRODUCT_TO_WISHLIST = "REMOVE_PRODUCT_TO_WISHLIST";

export function searchProduct(data) {
  return {
    type: SEARCH_PRODUCT_REQUSET,
    payload: data
  };
}

export function addProductToWishList(products) {
  return {
    type: ADD_PRODUCT_TO_WISHLIST,
    payload: products
  };
}

export function removeProductFromWishList(products) {
  return {
    type: REMOVE_PRODUCT_TO_WISHLIST,
    payload: products
  };
}
