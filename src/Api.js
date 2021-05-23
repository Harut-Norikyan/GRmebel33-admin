import axios from "axios";
import { serialize } from 'object-to-formdata';

// const API_URL = process.env.NODE_ENV === "development" ? 'http://localhost:4000/gr-admin' : 'https://gr-mebel-admin.herokuapp.com/gr-admin';
// const API_URL = 'http://5.63.152.244:4000/gr-admin';
const API_URL = "https://gr-mebel-admin.herokuapp.com/gr-admin";
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

api.interceptors.response.use(response => response, function (error) {
  if (error) {
    localStorage.clear()
    window.location.href = "/gr-admin"
    return Promise.reject(error);
  }
});

class Api {
  static url = API_URL;

  //// Auth
  static registration(firstName, lastName, email, password) {
    return api.post('/user/add-user', { firstName, lastName, email, password });
  }
  static login(email, password) {
    return api.post('/user/login', { email, password });
  }

  //// Category
  static addCategory(data) {
    const formData = serialize(
      data,
    );
    return api.post('/category/add-category', formData);
  }
  static updateCategory(data) {
    const formData = serialize(
      data,
    );
    return api.put('/category/update-category-by-id', formData);
  }
  static getCategories(currentPage) {
    return api.get(`/category/get-categories/${currentPage}`);
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

  // Product
  static addProduct(data) {
    const formData = serialize(
      data,
    );
    return api.post('/product/add-product', formData);
  }
  static updateProduct(data, id) {
    const formData = serialize(
      data,
    );
    return api.put(`/product/update-product/${id}`, formData);
  }
  static getProducts(currentPage) {
    return api.get(`/product/get-products/${currentPage}`);
  }
  static getProductById(id) {
    return api.get(`/product/get-product-by-id/${id}`);
  }
  static removeProduct(id, images) {
    return api.post(`/product/remove-product/${id}`, { images });
  }
  static removeProductImage(imgPath, id, images) {
    return api.post(`/product/remove-product-image/${id}`, { imgPath, images });
  }
  static makeTheMain(images, id) {
    return api.post(`/product/make-the-main/${id}`, { images, id });
  }
  static searchProduct(data) {
    return api.post("/product/search", { data });
  }
  static getProductByCategoryId(id) {
    return api.get(`/product/get-product-by-category-id/${id}`);
  }
}
export default Api;