/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import {store} from './store/store'
import axios from "axios";
window._ = require('lodash')
Vue.config.productionTip = false;

const siteName = "testing";
const backendUrl = "http://localhost:9000";

import th from 'vee-validate/dist/locale/th';
import VeeValidate, { Validator } from 'vee-validate'
Vue.use(VeeValidate);
Validator.localize('th', th);

import number from './misc/number'
Vue.use(number)

import VueProgressBar from 'vue-progressbar'
const progressBarOptions = {
  color: '#64d858',
  failedColor: '#ce2446',
  thickness: '5px'
}

Vue.use(VueProgressBar, progressBarOptions)

/* JWT TOKEN AUTH */
let jwtToken = null;
let clientId = null;
let authCheck = null;

if (localStorage.token) {
  jwtToken = `Bearer ${localStorage.token}`;
  clientId = localStorage.client;
  authCheck = true
}

if (localStorage.getItem("cart") === null) {
  localStorage.setItem('cart', '[]')
}

/* AXIOS */
Vue.prototype.$http = axios.create({
  baseURL: backendUrl,
  data: {
    siteName: siteName
  },
  headers: {
    Authorization: jwtToken,
    Client: clientId
  }
});

Vue.component('form-input', require('./views/_partials/Input.vue').default)

new Vue({
  data() {
    return {
      backendUrl: backendUrl,
      loading: false,
      showModal: false,
      clientId: clientId,
      auth: authCheck
    };
  },
  router,
  store,
  render: h => h(App)
}).$mount("#app");
