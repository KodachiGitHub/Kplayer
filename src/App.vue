<template>
    <div id="app">
        <header class="flex header">
            <span class="iconfont icon-menu" @click="openPanel"></span>
            <div class="flex-1 flex tabs">
                <div class="flex-1"></div>
                <span class="iconfont icon-music" :class="{ 'tab-current': currentTab === 'music'}" @click="changeTab('music')"></span>
                <span class="iconfont icon-rank" :class="{ 'tab-current': currentTab === 'rank'}"  @click="changeTab('rank')"></span>
                <div class="flex-1"></div>
            </div>
            <router-link :to="{ name: 'search'}" class="iconfont icon-search"></router-link>
        </header>
        <transition name="music-slide">
            <music class="tab-content" ref="tab-content" v-show="currentTab === 'music'"></music>
        </transition>
        <transition name="rank-slide">
            <rank class="tab-content" ref="tab-content" v-show="currentTab === 'rank'"></rank>
        </transition>
        <player></player>
        <user-panel :panelShow="panelShow" v-show="panelShow" v-on:wrapClick="closePanel"></user-panel>
        <transition name="page-fade">
            <router-view class="pages"></router-view>
        </transition>
    </div>
</template>

<script>
    import Player from './components/Player.vue'
    import UserPanel from './components/UserPanel.vue'
    import Music from './views/Music.vue'
    import Rank from './views/Rank.vue'

    export default {
        components:{
            Player,
            UserPanel,
            Music,
            Rank,
        },
        data () {
            return {
                panelShow:false,
                transitionName: 'slide-left',
                currentTab:'music',
            }
        },
        methods:{
            closePanel:function(){
                this.panelShow = false;
            },
            openPanel:function(){
                this.panelShow = true;
            },
            changeTab:function(tab){
                this.currentTab = tab;
            }
        },
    }
</script>

<style>
    @import 'assets/css/normalize.css';
    @import 'assets/css/common.css';
    @import url(https://at.alicdn.com/t/font_ocqohyg8c2xu5wmi.css);

    #app {
        font-family: '微软雅黑', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        position: absolute;
        width: 100%;
        top:0;
        bottom: 0;
    }
    a {
        color: #42b983;
    }
    .header{
        width: 100%;
        height: 2rem;
        background-color: #C10D0C;
        position: absolute;
        top:0;
        z-index: 20;
    }
    .header .iconfont{
        color:#fff;
        padding: 0 .3rem;
        font-size: 1rem;
    }
    .tabs .iconfont{
        color:#ddd;
    }
    .tabs .tab-current{
        color:#fff;
    }
    .tab-content,.pages{
        width: 100%;
        position: absolute;
        top:2rem;
        bottom: 2.5rem;
        background-color: hsla(0, 0%, 90%, 1);
        overflow-y: scroll;
    }
    .rank-slide-enter-active{
        animation:slide-left-in .5s;
    }
    .rank-slide-leave-active{
        animation:slide-left-out .5s;
    }
    .music-slide-enter-active{
        animation:slide-right-in .5s;
    }
    .music-slide-leave-active{
        animation:slide-right-out .5s;
    }
    @keyframes slide-left-in {
        from {
            transform:translate(100%,0)
        }
        to{
            transform:translate(0,0)
        }
    }
    @keyframes slide-left-out {
        from {
            transform:translate(0,0)
        }
        to{
            transform:translate(100%,0)
        }
    }
    @keyframes slide-right-in {
        from {
            transform:translate(-100%,0)
        }
        to{
            transform:translate(0,0)
        }
    }
    @keyframes slide-right-out {
        from {
            transform:translate(0,0)
        }
        to{
            transform:translate(-100%,0)
        }
    }
    .pages{
        height: 100%;
        position: absolute;
        top:0;
        bottom:0;
        background-color: hsla(0, 0%, 91%, 1);
        z-index: 100;
        overflow: scroll;
    }
    .page-fade-enter-active{
        animation:page-fade-in 0.3s;
    }
    .page-fade-leave-active{
        animation:page-fade-out 0.3s;
    }
    @keyframes page-fade-in {
        from{
            transform: translate(0,1rem);
            opacity: 0;
        }
        to{
            transform: translate(0,0);
            opacity: 1;
        }
    }
    @keyframes page-fade-out {
        from{
            transform: translate(0,0);
            opacity: 1;
        }
        to{
            transform: translate(0,1rem);
            opacity: 0;
        }
    }
</style>
