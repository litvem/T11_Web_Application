import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import BootstrapVue from "bootstrap-vue";
// import * as VueGoogleMaps from 'vue2-google-maps'
import VueGeoLocation from 'vue-browser-geolocation'
import GmapVue from 'gmap-vue'

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import "./assets/main.css";

Vue.use(GmapVue, {
  load: {
    key: 'AIzaSyCP-QTMs7ocdRbmaL92dkzLXJLd0_LK2ag',
    libraries: 'places'
  }
})
Vue.use(VueGeoLocation)

Vue.use(BootstrapVue);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
