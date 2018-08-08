/**
 * Created by sioxa on 2016/12/29 0029.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store/index'

Vue.use(VueRouter);

const routes = [
    {
        path:'/',
        name:'index',
        meta:{
            keepAlive:true
        }
    },
    {
        path: '/rankList/:id',
        name:'rankList',
        component: resolve => require(['./views/RankList.vue'], resolve),
        meta:{
            keepAlive:true
        }
    },
    {
        path: '/search',
        name:'search',
        component: resolve => require(['./views/Search.vue'], resolve),
        meta:{
            keepAlive:true
        }
    },
    {
        path: '/dissList/:id',
        name:'dissList',
        component: resolve => require(['./views/DissList.vue'], resolve),
        meta:{
            keepAlive:true
        }
    },
    {
        path: '/album/:id',
        name:'album',
        component: resolve => require(['./views/Album.vue'], resolve),
        meta:{
            keepAlive:true
        }
    },
    {
        path: '/singer/:id',
        name:'singer',
        component: resolve => require(['./views/Singer.vue'], resolve),
        meta:{
            keepAlive:true
        }
    },
];

let router = new VueRouter({
    routes,
});

router.pageStack = [];

router.beforeEach((to, from, next) => {
    let {name, path, fullPath} = to;
    if(router.pageStack.length === 0){
        if(path !== '/'){
            router.pageStack.push({
                name:'index',
                path:'/',
                fullPath:'/'
            });
        }
    }else{

        for(let i = 0; i < router.pageStack.length; i++){
            let page = router.pageStack[i];
            if(page.name === name){
                router.pageStack.splice(i,1);
                to.meta.keepAlive = Boolean(page.fullPath === fullPath);
                if(to.meta.keepAlive){
                    console.log('keep-alive');
                }
                break;
            }
        }
    }
    router.pageStack.push({
        name,
        path,
        fullPath
    });
    console.log(router.pageStack);
    next();
});

export default router
