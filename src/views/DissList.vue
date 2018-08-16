<template>
    <div id="SongList">
        <div class="flex bar-header" :style="{ backgroundColor:color }">
            <span class="iconfont icon-back" @click="goBack"></span>
            <div class="flex-1 info" v-if="playlist">
                <p class="list-title">{{ playlist.name }}</p>
                <p class="list-name">{{ playlist.creator.nickname }}</p>
            </div>
            <span></span>
        </div>
        <div class="container" v-if="playlist">
            <div class="list-info"  :style="{ backgroundColor:color }" style="transition: background 1s">
                <img :src="playlist.coverImgUrl" alt="" class="albumPic">
                <p class="short-text">{{ playlist.description }}</p>
            </div>
            <div class="loading-box" v-if="loading">
                <svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
            </div>
            <div class="list-content" v-else>
                <div class="flex list-header">
                    <div @click="playList(-1)"><span class="iconfont icon-play"></span>播放全部 ({{ playlist.tracks.length }})</div>
                </div>
                <div class="flex song-list" v-for="(music,index) in playlist.tracks" @click="playList(index)">
                    <div class="list-index">{{ index + 1 }}</div>
                    <div class="flex-1 music-info">
                        <p class="music-name">{{ music.name }}</p>
                        <p class="music-singer"><span v-for="singer in music.ar">{{ singer.name }} </span></p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import Vue from 'vue'
    export default {
        data (){
            return {
                listId: this.$route.params.id,
                playlist: null,
                loading: true,
                color: '#3c3f41'
            }
        },
        created:function(){
            let that = this;
            that.getListDetail();
        },
        computed:{
            musicList(){
                let that = this;
                if(that.playList){
                    return that.playlist.tracks;
                }
            },
        },
        methods:{
            getListDetail(){
                //获取歌单详情
                let that = this;
                that.loading = true;
                that.$api.playlistDetail(that.$route.params.id)
                    .then(res => {
                        that.loading = false;
                        if(res.data.code === 200){
                            that.playlist = res.data.playlist;
                        }
                    });
            },
            goBack(){
                this.$router.go(-1);
            },
            playList(index){
                let that = this;
                if(index !== -1){
                    that.$store.commit('addAndPlay',that.musicList[index]);
                }else{
                    that.$store.commit('replaceList',that.musicList);
                }

            }
        }
    }
</script>
<style scoped>
    #list-index{
        width: 100%;
        position: absolute;
        top:0;
        left:0;
    }
    .bar-header{
        width: 100%;
        padding: .3rem .25rem;
        color:#fff;
        position: absolute;
        top:0;
        left:0;
        z-index: 10;
    }
    .bar-header .iconfont{
        color: #fff;
    }
    .bar-header .info{
        margin-left: .3rem;
    }
    .bar-header p{
        margin: 0;
        color:#fff;
    }
    .bar-header .list-name{
        color:#ccc;
    }
    .info{
        margin-right: .3rem;
        overflow: hidden;
    }
    .bar-header p{
        margin: 0;
        color: #fff;
    }
    .list-title {
        font-size: .75rem;
        margin: 0 0 .35rem 0;
        text-overflow: ellipsis;
        width: auto;
        overflow: hidden;
        white-space: nowrap;
        flex-wrap: nowrap;
    }
    .list-name{
        font-size: .6rem;
    }

    .container{
        width: 100%;
        min-height: 100%;
        top:0;
        bottom:0;
        padding-bottom: 2.45rem;
        background-color: #fff;
    }
    .list-info{
        padding: 3rem .5rem .4rem .5rem;
        background-color: #3c3f41;
        overflow: hidden;
    }
    .albumPic{
        width: 6rem;
        height: 6rem;
        float: left;
    }
    .short-text{
        margin: 0 0.3rem 0 6.7rem;
        color:#fff;
        text-align: left;
        font-size: .6rem;
        line-height: 1.5em;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        overflow: hidden;
    }

    .list-content{
        width: 100%;
    }
    .list-header{
        padding-left: .5rem;
        font-size: .8rem;
        position: relative;
    }
    .list-header .icon-play{
        color: #000;
        padding-right: .5rem;
    }
    .list-header:after{
        left: 0!important;
    }
    .song-list{
        padding: .25rem 0;
        position: relative;
        overflow: hidden;
    }
    /*.song-list:after,.list-header:after{
        content: '';
        position: absolute;
        left: 2.1rem;
        bottom: 0;
        background: #ccc;
        width: 100%;
        height: 1px;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
    }*/
    .list-index {
        width: 2.1rem;
        padding: .3rem .5rem;
        text-align: center;
        flex-shrink: 0;
        font-size: .6rem;
        color: #ccc;
    }
    .music-info{
        margin-right: .3rem;
        position: relative;
        overflow: hidden;
    }
    .music-name{
        font-size: .7rem;
        line-height: 1rem;
        margin: 0;
        text-overflow: ellipsis;
        width: auto;
        overflow: hidden;
        white-space: nowrap;
        flex-wrap: nowrap;
    }
    .music-singer{
        margin: .2em 0 0 0;
        color: #c0c0c0;
        font-size: 12px;
    }

    .loading-box{
        position: relative;
    }
    .loading-box .circular {
        margin: 3rem auto 0 auto;
        display: block;
        position: relative;
        top:auto;
        left:auto;
    }
</style>
