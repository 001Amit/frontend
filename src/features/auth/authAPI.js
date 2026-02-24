import api from "../../services/api";

export const registerAPI = (data) =>
  api.post("/auth/register", data);

export const verifyEmailAPI = (data) =>
  api.post("/auth/verify-email", data);

export const loginAPI = (data) =>
  api.post("/auth/login", data);

export const logoutAPI = () =>
  api.post("/auth/logout");

export const getMeAPI = async () => {
  try {
    return await api.get("/user/me");
  } catch (error) {
    if (error.response?.status === 401) {
      return { data: { user: null } };
    }
    throw error;
  }
};
