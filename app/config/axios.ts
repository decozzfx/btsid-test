import axios from "axios";
import { envConfig } from "./envConfig";

export const CustomAxios = axios.create({
  baseURL: envConfig.baseApi,
});

CustomAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      if (config.headers) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
