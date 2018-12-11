// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './vuex/store';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import $ from 'jquery';
import axios from 'axios';
import VueCookies from 'vue-cookies';


Vue.prototype.axios = axios;
axios.defaults.baseURL = '/';

Vue.use(MuseUI);
Vue.config.productionTip = false;
Vue.use(VueCookies)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  $,
  components: { App },
  template: '<App/>'
})
