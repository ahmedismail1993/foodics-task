import Vue from "vue";
const state = Vue.observable({
  serverErrors: {},
  snackbar: {
    text: "",
    visible: false,
    timeout: 3000,
    color: "success"
  }
});

export default state;
