<template>
    <div id="SongList">
        <div>
            <div class="flex bar-header">
                <span class="iconfont icon-back" @click="goBack"></span>
                <div class="flex-1 info" v-if="singer !== null">
                    <p class="list-title">{{ singer.name }}</p>
                    <!--<p class="list-name">{{ singer.singername }}</p>-->
                </div>
                <span></span>
            </div>
            <div class="container" v-if="hotSongs !== null">
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
                                <div @click="playList(-1)"><span class="iconfont icon-play"></span>播放全部 ({{ hotSongs.length }})</div>
                            </div>
                            <div class="flex song-list" v-for="(song,index) in hotSongs" @click="playList(index)">
                                <div class="list-index">{{ index + 1 }}</div>
                                <div class="flex-1 music-info">
                                    <p class="music-name">{{ song.name }}</p>
                                    <p class="music-singer"><span v-for="singer in song.al">{{ singer.name }} </span></p>
                                </div>
                            </div>
                        </div>
                    </transition>
                    <transition :name="transitionName">
                        <div v-show="currentTab === 'album'" class="list-content" v-if="albums">
                            <div class="flex song-list" v-for="(album,index) in albums" @click="toAlbum(album.id)">
                                <div class="album-cover"><img :src="album.picUrl.replace('http://','https://')" alt=""></div>
                                <div class="flex-1 music-info">
                                    <p class="music-name">{{ album.name }}</p>
                                    <p class="music-singer">{{ $t.timeFormat(album.publishTime,'yyyy-MM-dd') }} 歌曲{{album.size}}</p>
                                </div>
                            </div>
                        </div>
                    </transition>
                    <transition :name="transitionName">
                        <div v-show="currentTab === 'info'" class="list-content">
                            <div class="singer-desc">
                                <div class="label">歌手介绍</div>
                                <p>{{ singer.briefDesc }}</p>
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
                id:this.$route.params.id,
                singer:null,
                hotSongs:null,
                albums:null,
                currentTab:'music',
                transitionName:'left'
            }
        },
        created:function(){
            let that = this;

            that.$api.singerSongs(that.id)
                .then(res => {
                    if(res.data.code === 200){
                        that.hotSongs = res.data.hotSongs;
                        that.singer = res.data.artist;
                    }
                });

            //获取歌手的专辑
            that.$api.singerAlbums(that.id)
                .then(res => {
                    if(res.data.code === 200){
                        that.albums = res.data.hotAlbums;
                    }
                });
        },
        computed:{
            background(){
                if(this.singer){
                    let url = this.singer.picUrl.replace('http://','https://');
                    return `background:url("${url}") center center /cover no-repeat`;
                }
                return '';
            },
        },
        methods:{
            goBack(){
                this.$router.go(-1);
            },
            playList(index){
                let that = this;
                if(index !== -1){
                    that.$store.commit('addAndPlay',that.hotSongs[index]);
                }else{
                    this.$store.commit('replaceList',that.hotSongs);
                }
            },
            changeTab(tab){
                this.currentTab = tab;
            },
            toAlbum(id){
                this.$router.push({name: 'album', params: {id: id}})
            },
        },
        watch:{
            currentTab(to,from){
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
        background-color: hsla(0, 0%, 90%, 1);
    }
    .list-info{
        height: 12rem;
        background-color: #3c3f41;
    }

    .list-content{
        width: 100%;
        padding-bottom: 2.45rem;
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

    .tabs{
        width: 100%;
        position: relative;
        border-bottom: 1px solid #E5E5E5;
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
        white-space: pre-line;
    }
</style>
