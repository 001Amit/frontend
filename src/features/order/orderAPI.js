import api from "../../services/api";

export const getMyOrdersAPI = () => api.get("/orders/my");
