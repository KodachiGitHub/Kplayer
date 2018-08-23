<template>
    <div id="SongList">
        <!--<div style="height: 100%;">
            <div class="flex bar-header" :class="headerClass">
                <span class="iconfont icon-back" @click="goBack"></span>
                <div class="flex-1 info">
                    <p class="list-title">排行榜</p>
                    <p v-if="topList.topinfo" class="list-name">{{ topList.topinfo.ListName }}</p>
                </div>
                <span></span>
            </div>
            <div class="container">
                <div class="list-info"  :style="{ backgroundColor:color }" style="transition: background 1s">
                    <canvas id="header-bg" class="background"></canvas>
                    <div class="albumPic"><img v-if="topList.topinfo" :src="topList.topinfo.MacListPicUrl" alt=""></div>
                </div>
                <div class="loading-box" v-if="loading">
                    <svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
                </div>
                <div class="list-content" v-show="!loading">
                    <div class="flex list-header">
                        <div @click="playList(-1)"><span class="iconfont icon-play"></span>播放全部</div>
                    </div>
                    <div class="flex song-list" v-for="(song,index) in topList.songlist" @click="playList(index)">
                        <div class="list-index">{{ index + 1 }}</div>
                        <div class="flex-1 music-info">
                            <p class="music-name">{{ song.data.songname }}</p>
                            <p class="music-singer">{{ song.data.singer[0].name }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>-->
    </div>
</template>

<script>
    import stackBlur from './../stackBlur.js'
    export default {
        data (){
            return {
                listId:this.$route.params.id,
                topList:{
                    color:'#000',
                },
                color:'#000',
                headerClass:'',
                loading:true,
            }
        },
        created:function(){
            return;
            let that = this;
            that.loading = true;
            that.$api.getRankSongs(that.listId)
                .then(response => {
                    that.loading = false;
                    that.topList = response.body;
                    let fixed = '00000' + this.topList.color.toString(16);
                    that.color = '#' + fixed.substr(fixed.length - 6);
                }, response => {
                    // error callback
                });
        },
        mounted:function(){
            return;
            let that = this;
            //that.initCanvas();

            let list = document.querySelector('.list-content');
            let container = document.querySelector('#SongList');
            container.onscroll = function(){
                if(list.getBoundingClientRect().top <= 60){
                    that.headerClass = 'header-fiexd';
                }else{
                    that.headerClass = '';
                }
            }
        },
        computed:{
            musicList:function(){
                let that = this;
                let list = [];
                if(that.topList.songlist){
                    for(let i = 0; i < that.topList.songlist.length; i ++){
                        let data = that.topList.songlist[i].data;
                        list.push({
                            name:data.songname,
                            author:data.singer[0].name,
                            cover:'https://y.gtimg.cn/music/photo_new/T002R500x500M000' + data.albummid + '.jpg',
                            current:false,
                            id:data.songid,
                            mid:data.songmid,
                            albumname:data.albumname,
                            albummid:data.albummid,
                            albumid:data.albumid,
                            singerid:data.singer[0].id,
                            singermid:data.singer[0].mid
                        });
                    }
                    return list;
                }
            },
        },
        methods:{
            initCanvas(){
                let that = this;
                that.playerBackground = document.querySelector('#player-background');

                that.windowRatio = document.body.clientWidth/document.body.clientHeight;
                let canvas = that.playerBackground;
                canvas.width = document.body.clientWidth;
                canvas.height = document.body.clientHeight;
                that.drawBackground();
            },
            drawBackground(){
                let that = this;
                let ratio = that.windowRatio;
                let canvas = that.playerBackground;
                let ctx = canvas.getContext('2d');

                let img = document.createElement('img');
                img.crossOrigin = '';
                img.src = that.music.cover.replace('http://','https://');

                img.onload = function(){
                    ctx.clearRect( 0, 0, canvas.width, canvas.height );
                    ctx.drawImage(img,(500 - ratio * 500)/2,0,ratio * 500,500,0,0,canvas.width,canvas.height);
                    stackBlur.stackBlurCanvasRGB('player-background',0,0,canvas.width,canvas.height,150);
                };
            },
            goBack:function(){
                this.$router.go(-1);
            },
            getAlbum:function(id){
                this.$api.getAlbum(id)
                    .then(response => {
                        console.log(response);
                    }, response => {
                        // error callback
                    });
            },
            playList:function(index){
                let that = this;
                if(index !== -1){
                    that.$store.commit('addAndPlay',that.musicList[index]);
                }else{
                    this.$store.commit('replaceList', this.musicList);
                }

            }
        }
    }
</script>
<!--https://y.gtimg.cn/music/photo_new/T002R500x500M000{{topList.songlist[index].data.albummid}}-->
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
        position: fixed;
        top:0;
        left:0;
        z-index: 10;
        background-color: rgba(255,255,255,.4);
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
    .header-fiexd{
        background-color: #fff;
    }
    .header-fiexd .icon-back,.header-fiexd .list-title{
        color:#2c3e50;
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
        position: relative;
        background-color: #3c3f41;
    }
    .background{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: .6;
    }
    .albumPic{
        width: 6rem;
        height: 6rem;
        background: #cccccc url('https://o81tu7lli.bkt.clouddn.com/defaultCover.jpg') center center /contain no-repeat;
    }
    .albumPic img{
        width: 100%;
        height: 100%;
        display: block;
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
</style>
