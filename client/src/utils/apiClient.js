import axios from "axios";
import { API_URL } from "./apiConfig";

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("hr-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const onAuthPage = window.location.pathname.startsWith("/auth/");
    if (status === 401 && !onAuthPage) {
      localStorage.removeItem("hr-token");
      window.location.href = "/auth/sign-in";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
