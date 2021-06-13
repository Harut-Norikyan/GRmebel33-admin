import { ADD_PAGE_SPINNER, REMOVE_PAGE_SPINNER } from "../actions/spinner";

const initialState = {
  pageSpinners: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PAGE_SPINNER:
      return {
        ...state,
        pageSpinners: [...state.pageSpinners, action.payload],
      };
    case REMOVE_PAGE_SPINNER:
      return {
        ...state,
        pageSpinners: state.pageSpinners.filter(data => data !== action.payload),
      };
    default:
      return state
  }
};

export default reducer;
