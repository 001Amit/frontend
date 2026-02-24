import api from "../../services/api";

export const fetchProductsAPI = (params) =>
  api.get("/products", { params });

export const fetchProductAPI = (id) =>
  api.get(`/products/${id}`);

export const searchAutocompleteAPI = (q) =>
  api.get(`/products/autocomplete?q=${q}`);
