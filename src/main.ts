import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './vendor/vuetify';
import './registerServiceWorker';
import config from 'config';

console.log(config);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
