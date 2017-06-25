<template>
    <div id="SongList">
        <div>
            <div class="flex bar-header" :style="{ backgroundColor:color }">
                <span class="iconfont icon-back" @click="goBack"></span>
                <div class="flex-1 info" v-if="cdList !== null">
                    <p class="list-title">{{ cdList.dissname }}</p>
                    <p class="list-name">{{ cdList.nickname }}</p>
                </div>
                <span></span>
            </div>
            <div class="container" v-if="cdList !== null">
                <div class="list-info"  :style="{ backgroundColor:color }" style="transition: background 1s">
                    <img :src="cdList.logo" alt="" class="albumPic">
                </div>
                <div class="list-content">
                    <div class="flex list-header">
                        <div @click="playList(-1)"><span class="iconfont icon-play"></span>播放全部 ({{ cdList.songlist.length }})</div>
                    </div>
                    <div class="flex song-list" v-for="(song,index) in cdList.songlist" @click="playList(index)">
                        <div class="list-index">{{ index + 1 }}</div>
                        <div class="flex-1 music-info">
                            <p class="music-name">{{ song.name }}</p>
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
                listId:this.$route.params.id,
                cdList:null,
            }
        },
        created:function(){
            let that = this;
            that.$api.getCdList(that.listId).then(response => {
                let list = response.body;
                if(list.cdlist.length > 0){
                    that.cdList = list.cdlist[0];
                }

            }, response => {
                // error callback
            });
        },
        computed:{
            musicList:function(){
                let that = this;
                let list = [];
                if(that.cdList.songlist){
                    for(let i = 0; i < that.cdList.songlist.length; i ++){
                        let data = that.cdList.songlist[i];
                        list.push({
                            name:data.name,
                            author:data.singer[0].name,
                            cover:'https://y.gtimg.cn/music/photo_new/T002R500x500M000' + data.album.mid + '.jpg',
                            current:false,
                            id:data.id,
                            src:'http://ws.stream.qqmusic.qq.com/' + data.id + '.m4a?fromtag=46',
                            albumname:data.album.name,
                            albummid:data.album.mid,
                            albumid:data.album.id,
                            singerid:data.singer[0].id,
                            singermid:data.singer[0].mid,
                        });
                    }
                    return list;
                }
            },
            color: function () {
                if (this.cdList !== null) {
                    let fixed = '00000' + this.cdList.uin.toString(16);
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
        background-color: #fff;
    }
    .list-info{
        padding: 3rem .5rem .4rem .5rem;
    }
    .albumPic{
        width: 6rem;
        height: 6rem;
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
