<template>
    <div id="SongList">
        <div>
            <div class="flex bar-header" :style="{ backgroundColor:color }">
                <span class="iconfont icon-back" @click="goBack"></span>
                <div class="flex-1 info" v-if="album !== null">
                    <p class="list-title">专辑</p>
                    <!--<p class="list-name">{{ album.singername }}</p>-->
                </div>
            </div>
            <div class="container" v-if="album !== null">
                <div class="flex list-info"  :style="{ backgroundColor:color }" style="transition: background 1s">
                    <img :src="cover" alt="" class="albumPic">
                    <div>
                        <p class="album-name">{{ album.name }}</p>
                        <p>发行时间：{{ album.aDate }}</p>
                        <p>歌手：{{ album.singername }}</p>
                    </div>
                </div>
                <div class="list-content">
                    <div class="flex list-header">
                        <div @click="playList(-1)"><span class="iconfont icon-play"></span>播放全部 ({{ album.list.length }})</div>
                    </div>
                    <div class="flex song-list" v-for="(song,index) in album.list" @click="playList(index)">
                        <div class="list-index">{{ index + 1 }}</div>
                        <div class="flex-1 music-info">
                            <p class="music-name">{{ song.songname }}</p>
                            <p class="music-singer">{{ song.singer[0].name }}</p>
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
                albumid:this.$route.params.id,
                album:null,
            }
        },
        created:function(){
            let that = this;
            that.$api.getAlbum(that.albumid).then(response => {
                console.log(response.body.data);
                that.album = response.body.data;
            }, response => {
                // error callback
            });
        },
        computed:{
            cover:function(){
                return 'https://y.gtimg.cn/music/photo_new/T002R500x500M000' + this.album.mid + '.jpg';
            },
            musicList:function(){
                let that = this;
                let list = [];
                if(that.album.list){
                    for(let i = 0; i < that.album.list.length; i ++){
                        let data = that.album.list[i];
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
            color: function () {
                if (this.album !== null) {
                    let fixed = '00000' + this.album.color.toString(16);
                    return '#' + fixed.substr(fixed.length - 6)
                } else {
                    return '#ffffff'
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
