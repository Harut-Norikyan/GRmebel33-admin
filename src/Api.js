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

// api.interceptors.response.use((response) => {
//   if (response.config.parse) {
//       //perform the manipulation here and change the response object
//   }
//   return response;
// }, (error) => {
//   return Promise.reject(error.message);
// });

class Api {
  static url = API_URL;

  static registration(firstName, lastName, email, password) {
    return api.post('/user/add-user', { firstName, lastName, email, password });
  }
  static login(email, password) {
    return api.post('/user/login', { email, password });
  }

}

export default Api;