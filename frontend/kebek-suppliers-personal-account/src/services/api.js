import { camelizeKeys, decamelizeKeys } from "humps";
import axios from "axios";
import { BASE_URL } from "../utils/consts";
import { toast } from "react-toastify";

export const $api = axios.create({
  baseURL: BASE_URL,
});

$api.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("token");
    if (token && token !== "") {
      config.headers.Authorization = `Token ${token}`;
    }
    if (config.data && config.headers["content-type"] === "application/json") {
      config.data = decamelizeKeys(config.data);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

$api.interceptors.response.use(
  (config) => {
    if (config.data && config.headers["content-type"] === "application/json") {
      config.data = camelizeKeys(config.data);
    }
    return config;
  },
  async (error) => {
    if (error?.response?.status === 401) {
      try {
        toast.error("Учетные данные не были предоставлены!");
      } catch (e) {
        //TODO rewrite 401 handler
        // await jwtService.clearTokens();
        // return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
