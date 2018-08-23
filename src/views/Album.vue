<template>
    <div id="SongList">
        <div>
            <div class="flex bar-header">
                <span class="iconfont icon-back" @click="goBack"></span>
                <div class="flex-1 info" v-if="album !== null">
                    <p class="list-title">专辑</p>
                    <!--<p class="list-name">{{ album.singername }}</p>-->
                </div>
            </div>
            <div class="container" v-if="album !== null">
                <div class="flex list-info" style="transition: background 1s">
                    <img :src="album.picUrl.replace('http://','https://')" alt="" class="albumPic">
                    <div>
                        <p class="album-name">{{ album.name }}</p>
                        <p>发行时间：{{ $t.timeFormat(album.publishTime,'yyyy-MM-dd') }}</p>
                        <p>歌手：{{ album.artists[0].name }}</p>
                    </div>
                </div>
                <div class="list-content" v-if="songs">
                    <div class="flex list-header">
                        <div @click="playList(-1)"><span class="iconfont icon-play"></span>播放全部 ({{ songs.length }})</div>
                    </div>
                    <div class="flex song-list" v-for="(song,index) in songs" @click="playList(index)">
                        <div class="list-index">{{ index + 1 }}</div>
                        <div class="flex-1 music-info">
                            <p class="music-name">{{ song.name }}</p>
                            <p class="music-singer"><span v-for="singer in song.ar">{{ singer.name }} </span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        data (){
            return {
                id:this.$route.params.id,
                album:null,
                songs:null,
            }
        },
        created(){
            let that = this;
            that.getData();
        },
        methods:{
            getData(){
                let that = this;
                that.$api.album(that.id)
                    .then(res => {
                        if(res.data.code === 200){
                            that.album = res.data.album;
                            that.songs = res.data.songs;
                        }
                    });
            },
            goBack(){
                this.$router.go(-1);
            },
            playList(index){
                let that = this;
                if(index !== -1){
                    that.$store.commit('addAndPlay',that.songs[index]);
                }else{
                    this.$store.commit('replaceList', that.songs);
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
        top:0;
        bottom:0;
        padding-bottom: 2.45rem;
    }
    .list-info{
        padding: 3rem .5rem .4rem .5rem;
        background-color: #3c3f41;
        align-items: flex-start;
    }
    .list-info p{
        color:#fff;
        font-size: .6rem;
        margin: .5em 0;
    }
    .album-name{
        margin: .7em 0!important;
        text-overflow: ellipsis;
        width: auto;
        overflow: hidden;
        white-space: nowrap;
        flex-wrap: nowrap;
        font-size: .75rem!important;
    }
    .albumPic{
        width: 6rem;
        height: 6rem;
        margin-right: .4rem;
    }

    .list-content{
        width: 100%;
        background-color: #fff;
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
