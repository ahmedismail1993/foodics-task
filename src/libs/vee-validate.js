import VeeValidate from "vee-validate";
import Vue from "vue";
import i18n from "../locales";
import enMessages from "vee-validate/dist/locale/en";
import arMessages from "vee-validate/dist/locale/ar";

Vue.use(VeeValidate, {
  locale: i18n.locale,
  i18n,
  dictionary: {
    en: enMessages,
    ar: arMessages
  }
});
