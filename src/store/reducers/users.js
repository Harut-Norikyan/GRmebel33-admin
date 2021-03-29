import {
  REGISTRATION_REQUEST,
  REGISTRATION_SUCCESS,
  REGISTRATION_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from "../actions/users";

const initialState = {
  requsetStatus: "",
  user: null,
  token: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    ////User Registration
    case REGISTRATION_REQUEST:
      return {
        ...state,
        requestStatus: "request"
      }
    case REGISTRATION_SUCCESS:
      return {
        ...state,
        requestStatus: "success",
      }
    case REGISTRATION_FAIL:
      return {
        ...state,
        requestStatus: "fail",
      }
    ////User Login
    case LOGIN_REQUEST:
      return {
        ...state,
        requestStatus: "request"
      }
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.user.data.token)
      localStorage.setItem("user", JSON.stringify(action.payload.user.data.user))
      return {
        ...state,
        requestStatus: "success",
        token: action.payload.user.data.token,
        user: action.payload.user.data.user
      }
    case LOGIN_FAIL:
      return {
        ...state,
        requestStatus: "fail",
        errorMessage: action.payload
      }
    ////


    default:
      return state;
  }
}