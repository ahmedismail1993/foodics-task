import axios from "axios";

import state from "../helpers/serverErrors";
import { token } from "../config/api_keys";
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    let { method } = response.config;
    if (method === "post" || method === "put" || method === "delete") {
      state.snackbar.text = "Success Request";
      state.snackbar.color = "success";
      state.snackbar.visible = true;

      state.serverErrors = {};
    }

    return response;
  },

  (error) => {
    const { errors } = error.response.data;
    state.serverErrors = errors;
    return Promise.reject(error);
  }
);
export default axiosInstance;
