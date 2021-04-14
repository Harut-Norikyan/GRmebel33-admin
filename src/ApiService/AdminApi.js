import axios from "axios";
import { serialize } from 'object-to-formdata';

const API_URL = 'http://localhost:4000/gr-admin';
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

class AdminApi {
  static url = API_URL;

  //// Auth
  static registration(firstName, lastName, email, password) {
    return api.post('/user/add-user', { firstName, lastName, email, password });
  }
  static login(email, password) {
    return api.post('/user/login', { email, password });
  }

  //// Category
  static addCategory(categoryName) {
    return api.post('/category/add-category', { categoryName });
  }
  static updateCategory(categoryName, id) {
    return api.put('/category/update-category-by-id', { categoryName, id });
  }
  static getCategories() {
    return api.get('/category/get-categories');
  }
  static getCategoryById(id) {
    return api.get(`/category/get-category-by-id/${id}`)
  }
  static removeCategoryById(id) {
    return api.delete(`/category/remove-category/${id}`)
  }

  //AboutUs
  static addAboutUsDescrition(description) {
    return api.post('/aboutUs/add-about-us-description', { description });
  }
  static getAboutUsDescrition() {
    return api.get('/aboutUs/get-about-us-description');
  }
  static updateAboutUsDescrition(description, descId) {
    return api.put('/aboutUs/update-about-us-description', { description, descId });
  }

}

export default AdminApi;