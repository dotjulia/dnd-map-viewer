import Vue from 'vue'
import App from './App.vue'
import movable from 'v-movable';
import './registerServiceWorker'
import vuetify from './plugins/vuetify';


Vue.config.productionTip = false

Vue.use(movable);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
