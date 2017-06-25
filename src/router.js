/**
 * Created by sioxa on 2016/12/29 0029.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import RankList from './components/RankList.vue'
import Search from './components/Search.vue'
import DissList from './components/DissList.vue'
import Album from './components/Album.vue'
import Singer from './components/Singer.vue'

Vue.use(VueRouter);

const routes = [
    { path: '/rankList/:id',name:'rankList',component: RankList},
    { path: '/search',name:'search',component: Search},
    { path: '/dissList/:id',name:'dissList',component: DissList},
    { path: '/album/:id',name:'album',component: Album},
    { path: '/singer/:id',name:'singer',component: Singer},
];

export default new VueRouter({
    routes,
})
