import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import store from "./store";
import VueCookies from 'vue-cookies'
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import Vuex from 'vuex'

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
Vue.config.productionTip = false;

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
Vue.use(VueCookies);
Vue.use(Vuex)
axios.defaults.baseURL = 'http://localhost:3000/'

axios.interceptors.request.use(config => {
  if(!router.currentRoute.path.includes("login") && VueCookies.get("user") == null) {
        router.push("/error");
        return Promise.reject;
  }
  return config;
}, error => {
  return Promise.reject(error);
});



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
