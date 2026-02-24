import api from "../../services/api";

export const getProductReviewsAPI = (productId) =>
  api.get(`/reviews/${productId}`);

export const addReviewAPI = (data) =>
  api.post("/reviews", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
