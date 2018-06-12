<template>
    <div id="SongList">
        <div>
            <div class="flex bar-header">
                <span class="iconfont icon-back" @click="goBack"></span>
                <div class="flex-1 info" v-if="singer !== null">
                    <p class="list-title">{{ singer.singer_name }}</p>
                    <!--<p class="list-name">{{ singer.singername }}</p>-->
                </div>
                <span></span>
            </div>
            <div class="container" v-if="songs !== null">
                <div class="list-info"  :style="background">
                </div>
                <div class="flex tabs" :class="currentTab">
                    <div class="flex-1" @click="changeTab('music')">单曲</div>
                    <div class="flex-1" @click="changeTab('album')">专辑</div>
                    <div class="flex-1" @click="changeTab('info')">歌手介绍</div>
                    <div class="tab-border"></div>
                </div>
                <div class="tab-container">
                    <transition :name="transitionName">
                        <div v-show="currentTab === 'music'" class="list-content">
                            <div class="flex list-header">
                                <div @click="playList(-1)"><span class="iconfont icon-play"></span>播放全部 ({{ songs.length }})</div>
                            </div>
                            <div class="flex song-list" v-for="(song,index) in songs" @click="playList(index)">
                                <div class="list-index">{{ index + 1 }}</div>
                                <div class="flex-1 music-info">
                                    <p class="music-name">{{ song.musicData.songname }}</p>
                                    <p class="music-singer">{{ song.musicData.singer[0].name }}</p>
                                </div>
                            </div>
                        </div>
                    </transition>
                    <transition :name="transitionName">
                        <div v-show="currentTab === 'album'" class="list-content">
                            <div class="flex song-list" v-for="(album,index) in albums" @click="toAlbum(album.albumID)">
                                <div class="album-cover"><img :src="album.picUrl" alt=""></div>
                                <div class="flex-1 music-info">
                                    <p class="music-name">{{ album.albumName }}</p>
                                    <p class="music-singer">{{ album.pubTime }}</p>
                                </div>
                            </div>
                        </div>
                    </transition>
                    <transition :name="transitionName">
                        <div v-show="currentTab === 'info'" class="list-content">
                            <div class="singer-desc">
                                <div class="label">歌手介绍</div>
                                <p>{{ singer.SingerDesc }}</p>
                            </div>
                        </div>
                    </transition>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
    export default {
        data (){
            return {
                singermid:this.$route.params.id,
                singer:null,
                songs:null,
                albums:null,
                currentTab:'music',
                transitionName:'left'
            }
        },
        created:function(){
            let that = this;
            //获取歌手基本信息
            that.$api.getSingerInfo(that.singermid)
                .then(response => {
                    console.log();
                    that.singer = response.body.data;
                }, response => {
                    // error callback
                });
            //获取歌手最热门的100首歌曲，按播放量排序
            that.$api.getSingerSongs(that.singermid)
                .then(response => {
                    that.songs = response.body.data.list;
                }, response => {
                    // error callback
                });
            //获取歌手的专辑
            that.$api.getSingerAlbum(that.singermid)
                .then(response => {
                    that.albums = response.body.data.list;
                    for(let i = 0,len = that.albums.length; i < len; i++ ){
                        that.albums[i].picUrl = "//y.gtimg.cn/music/photo_new/T002R300x300M000" + that.albums[i].albumMID + ".jpg"
                    }
                }, response => {
                    // error callback
                });
        },
        computed:{
            background:function(){
                return 'background:url("' + 'https://y.gtimg.cn/music/photo_new/T001R500x500M000' + this.singer.singer_mid + '.jpg") center center /cover no-repeat';
            },
            musicList:function(){
                let that = this;
                let list = [];
                if(that.songs){
                    for(let i = 0; i < that.songs.length; i ++){
                        let data = that.songs[i].musicData;
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
                            singermid:that.singer.singer_mid
                        });
                    }
                    return list;
                }
            },
        },
        methods:{
            goBack:function(){
                this.$router.go(-1);
            },
            playList:function(index){
                let that = this;
                if(index !== -1){
                    that.$store.commit('addAndPlay',that.musicList[index]);
                }else{
                    this.$store.commit('replaceList', this.musicList);
                }
            },
            changeTab:function(tab){
                this.currentTab = tab;
            },
            toAlbum:function(id){
                this.$router.push({name: 'album', params: {id: id}})
            },
        },
        watch:{
            currentTab:function(to,from){
                let that = this;
                if(to === 'music' || ( to === 'album' && from === 'info' )){
                    that.transitionName = 'right';
                    return;
                }
                if((to === 'album' && from === 'music') || to === 'info'){
                    that.transitionName = 'left';
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
        top:0;
        bottom:0;
        padding-bottom: 2.45rem;
        background-color: hsla(0, 0%, 90%, 1);
    }
    .list-info{
        height: 12rem;
    }

    .list-content{
        width: 100%;
        padding-bottom: 2.45rem;
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

    .left-enter-active{
        animation:slide-left-in .3s
    }
    .left-leave-active{
        animation:slide-right-out .3s
    }
    .right-enter-active{
        animation:slide-right-in .3s
    }
    .right-leave-active{
        animation:slide-left-out .3s
    }
    .tabs{
        width: 100%;
        position: relative;
    }
    .tabs div{
        text-align: center;
        font-size: .75rem;
        line-height: 1.8rem;
        background-color: #fff;
    }
    .tab-border{
        width: 33.3333333333332%;
        height: 2px;
        position: absolute;
        bottom:0;
        background-color: #C10D0C!important;
        transition: transform .3s;
    }
    .tab-container{
        width: 100%;
        position: relative;
    }
    .list-content{
        position: absolute;
        top:0;
        left:0;
    }
    .music .tab-border{
        transform: translate3d(0,0,0);
    }
    .album .tab-border{
        transform: translate3d(100%,0,0);
    }
    .info .tab-border{
        transform: translate3d(200%,0,0);
    }

    .album-cover{
        width: 2rem;
        height: 2rem;
        margin-left: .5rem;
        margin-right: .3rem;
    }
    .album-cover img{
        width: 100%;
        height: 100%;
        display: block;
    }
    .singer-desc{
        padding: 0 .5rem;
    }
    .singer-desc p{
        font-size: .7rem;
        line-height: 1.1rem;
        margin-top: .5em;
    }
</style>
