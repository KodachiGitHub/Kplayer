import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueResource from 'vue-resource'
import Api from './ApiService'
import store from './store/index'
import tools from './assets/js/tools'

Vue.use(VueResource);

Vue.prototype.$api = Api;
Vue.prototype.$t = tools;

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
