/**
 * Created by sioxa on 2016/12/29 0029.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
    { path: '/rankList/:id',name:'rankList',component: resolve => require(['./views/RankList.vue'], resolve)},
    { path: '/search',name:'search',component: resolve => require(['./views/Search.vue'], resolve)},
    { path: '/dissList/:id',name:'dissList',component: resolve => require(['./views/DissList.vue'], resolve)},
    { path: '/album/:id',name:'album',component: resolve => require(['./views/Album.vue'], resolve)},
    { path: '/singer/:id',name:'singer',component: resolve => require(['./views/Singer.vue'], resolve)},
];

let router = new VueRouter({
    routes,
});

export default router
