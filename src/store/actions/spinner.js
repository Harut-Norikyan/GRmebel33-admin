export const ADD_PAGE_SPINNER = "ADD_PAGE_SPINNER";
export const REMOVE_PAGE_SPINNER = "REMOVE_PAGE_SPINNER";

export function addPageSpinner(spinnerId) {
  return {
    type: ADD_PAGE_SPINNER,
    payload: spinnerId
  };
};

export function removePageSpinner(spinnerId) {
  return {
    type: REMOVE_PAGE_SPINNER,
    payload: spinnerId
  };
};
