import api from "../../services/api";

export const getCartAPI = () => api.get("/cart");

export const addToCartAPI = (data) => api.post("/cart", data);

export const updateCartItemAPI = (id, quantity) =>
  api.put(`/cart/${id}`, { quantity });

export const removeCartItemAPI = (id) =>
  api.delete(`/cart/${id}`);

export const applyCouponAPI = (data) =>
  api.post("/coupons/apply", data);
