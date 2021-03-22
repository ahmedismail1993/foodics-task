import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import vueAxios from "vue-axios";
import axiosInstance from "@/config/axios.js";

import i18n from "./locales";
import "./libs/vee-validate";

Vue.config.productionTip = false;

Vue.use(vueAxios, axiosInstance);

new Vue({
  router,
  vuetify,
  i18n,
  render: (h) => h(App)
}).$mount("#app");
