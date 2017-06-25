import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueResource from 'vue-resource'
import VueMaterial  from 'vue-material'
import Api from './ApiService'
import store from './store/index'

Vue.use(VueResource);
Vue.use(VueMaterial);

Vue.prototype.$api = Api;

Vue.config.devtools = true;

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
