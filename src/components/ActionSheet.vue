<template>
    <div id="action-sheet">
        <div class="action-wrap" @click="closeAction"></div>
        <div class="action-list">
            <div class="action-title">歌曲：{{ music.name }}</div>
            <div class="flex action-item">
                <span class="iconfont icon-singer"></span>
                <span v-for="singer in music.ar" @click="toSinger(singer.id)">歌手：{{ singer.name }} </span>
            </div>
            <div class="flex action-item" @click="toAlbum(music.al.id)">
                <span class="iconfont icon-album"></span>
                <span class="album-name">专辑：{{ music.al.name }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['music'],
        data () {
            return {

            }
        },
        methods:{
            closeAction:function(){
                this.$emit('closeAction')
            },
            toSinger:function(id){
                this.$emit('closePlayer');
                this.closeAction();
                this.$router.push({name: 'singer', params: {id: id}})
            },
            toAlbum:function(id){
                this.$emit('closePlayer');
                this.closeAction();
                this.$router.push({name: 'album', params: {id: id}})
            },
        }
    }
</script>

<style scoped>
    #action-sheet{
        width: 100%;
        height: 100%;
        position: fixed;
        top:0;
        left:0;
        overflow: hidden;
        z-index: 1200;
    }
    .action-wrap{
        width: 100%;
        height: 100%;
        position: absolute;
        top:0;
        left:0;
        background-color: rgba(0,0,0,.5);
    }
    .action-list{
        width: 100%;
        position: absolute;
        bottom: 0;
        background-color: #fff;
        font-size: .7rem;
    }
    .slide-enter-active {
        animation: slide-in .5s;
    }
    .slide-leave-active {
        animation: slide-out .5s;
    }
    @keyframes slide-in {
        0% {
            transform: translate(0,100%);
        }
        100% {
            transform: translate(0,0);
        }
    }
    @keyframes slide-out {
        0% {
            transform: translate(0,0);
        }
        100% {
            transform: translate(0,100%);
        }
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
    .fade-enter, .fade-leave-active {
        opacity: 0
    }
    .action-title{
        padding: 0 .4rem;
        line-height: 2rem;
        position: relative;
        text-align: left;
    }
    .action-item{
        padding: 0 .4rem;
        line-height: 2rem;
    }
    .action-item .iconfont{
        margin-left: 0;
        margin-right: .4rem;
        line-height: 2rem;
    }
    .album-name{
        text-overflow: ellipsis;
        width: auto;
        overflow: hidden;
        white-space: nowrap;
        flex-wrap: nowrap;
    }
</style>
