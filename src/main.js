import '@babel/polyfill'
import Vue from 'vue';
import './plugins/axios';
import './plugins/vuetify';
import './plugins/vue-i18n';
import './plugins/vue-print-nb';
import './plugins/vee-validate';
import './filters/number';
import './filters/currency';
import './filters/percentage';
import App from './App.vue';
import store from './store';
import router from './router/';
import i18n from './i18n';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
