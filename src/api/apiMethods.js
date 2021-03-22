import axiosInstance from "../config/axios";
import Vue from "vue";
class ApiMethods {
  getData({ url, data }) {
    return axiosInstance({
      method: "get",
      url,
      data
    });
  }

  storeData({ url, data }) {
    return axiosInstance({
      method: "post",
      url,
      data
    });
  }
}
Vue.prototype.$http = new ApiMethods();
export default ApiMethods;
