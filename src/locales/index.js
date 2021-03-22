import Vue from "vue";
import VueI18n from "vue-i18n";
import enLocale from "./en.json";
import arLocale from "./ar.json";
import Cookies from "js-cookie";

Vue.use(VueI18n);

export const messages = {
  en: {
    ...enLocale
  },
  ar: {
    ...arLocale
  }
};

const i18n = new VueI18n({
  locale: Cookies.get("language") || "en",
  fallbackLocale: "en",
  messages
});

export default i18n;
