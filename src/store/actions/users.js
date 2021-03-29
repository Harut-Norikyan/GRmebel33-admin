export const REGISTRATION_REQUEST = "REGISTRATION_REQUEST";
export const REGISTRATION_SUCCESS = "REGISTRATION_SUCCESS";
export const REGISTRATION_FAIL = "REGISTRATION_FAIL";
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const GET_USER_BY_EMAIL_ID_REQUEST = "GET_USER_BY_EMAIL_ID_REQUEST";
export const GET_USER_BY_EMAIL_ID_SUCCESS = "GET_USER_BY_EMAIL_ID_SUCCESS";
export const GET_USER_BY_EMAIL_ID_FAIL = "GET_USER_BY_EMAIL_ID_FAIL";
export const UPDATE_USER_DATA_REQUEST = "UPDATE_USER_DATA_REQUEST";
export const UPDATE_USER_DATA_SUCCESS = "UPDATE_USER_DATA_SUCCESS";
export const UPDATE_USER_DATA_FAIL = "UPDATE_USER_DATA_FAIL";

export function registration(firstName, lastName, email, password) {
  return {
    type: REGISTRATION_REQUEST,
    payload: { firstName, lastName, email, password }
  };
};

export function login(email, password) {
  return {
    type: LOGIN_REQUEST,
    payload: { email, password }
  };
};

export function getUserByEmailId(email, id) {
  return {
    type: GET_USER_BY_EMAIL_ID_REQUEST,
    payload: { email, id }
  };
};

export function updateUserData(id, data) {
  return {
    type: UPDATE_USER_DATA_REQUEST,
    payload: { id, data }
  };
};
