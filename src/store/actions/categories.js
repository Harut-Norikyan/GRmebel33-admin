export const GET_CATEGORIES_REQUSET = "GET_CATEGORIES_REQUSET";
export const GET_CATEGORIES_SUCCESS = "GET_CATEGORIES_SUCCESS";
export const GET_CATEGORIES_FAIL = "GET_CATEGORIES_FAIL";

export function getCategories(currentPageNumber) {
  return {
    type: GET_CATEGORIES_REQUSET,
    payload: currentPageNumber
  };
}
