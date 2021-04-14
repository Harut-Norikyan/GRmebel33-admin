import axios from "axios";
import { serialize } from 'object-to-formdata';

const API_URL = 'http://localhost:4000';
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['authorization'] = token;
  }
  return config;
}, (err) => Promise.reject(err));

class UserApi {
  static url = API_URL;

  // static registration(firstName, lastName, email, password) {
  //   return api.post('/user/add-user', { firstName, lastName, email, password });
  // }

}

export default UserApi;