<template>
    <div id="search">
        <div class="flex bar-header">
            <span class="iconfont icon-back" @click="goBack"></span>
            <input class="flex-1" type="text" placeholder="输入关键词搜索" v-model.trim="key" @keyup.enter="search">
            <span class="iconfont icon-search" @click="search"></span>
        </div>
        <div class="rec-container" v-if="recommend !== null && showRec" @click="closeRec">
            <div class="recommend" @click.stop>
                <div class="type-title" v-if="recommend.singer"><span class="iconfont icon-singer"></span>歌手</div>
                <div class="rec-item" v-if="recommend.singer">
                    <div @click="toSinger(singer.mid)" class="flex rec-name" v-for="singer in recommend.singer.itemlist">{{ singer.name }}</div>
                </div>
                <div class="type-title" v-if="recommend.song"><span class="iconfont icon-song"></span>单曲</div>
                <div class="rec-item" v-if="recommend.song">
                    <div @click="playRec(song)" class="flex" v-for="song in recommend.song.itemlist"><span class="rec-name">{{ song.name }}</span><span class="singer">-{{ song.singer }}</span></div>
                </div>
                <div class="type-title" v-if="recommend.album"><span class="iconfont icon-album"></span>专辑</div>
                <div class="rec-item" v-if="recommend.album">
                    <div @click="toAlbum(album.id)" class="flex" v-for="album in recommend.album.itemlist"><span class="rec-name">{{ album.name }}</span><span class="singer">-{{ album.singer }}</span></div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="list-content" v-if="result.length !== 0">
                <div class="flex song-list" v-for="(song,index) in result" @click="playMusic(index)">
                    <div class="list-index">{{ index + 1 }}</div>
                    <div class="flex-1 music-info">
                        <p class="music-name">{{ song.songname }}</p>
                        <p class="music-singer">{{ song.singer[0].name }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'
    export default {
        data (){
            return {
                result:[],
                key:'',
                recommend:null,
                showRec:true,
                hotKeys:null,
                input:null,
            }
        },
        created(){

        },
        mounted(){
            let that = this;
            that.input = document.querySelector('.bar-header>input');
            that.input.focus();
            that.input.addEventListener('focus',function(){
                that.showRec = true;
            },false);
        },
        computed:{


        },
        methods:{
            goBack(){
                this.$router.go(-1);
            },
            search(){
                let that = this;
                if(that.input !== null){
                    that.input.blur();
                }
                that.showRec = false;
                if(that.key !== ''){
                    that.$api.neteaseSearch(that.key)
                        .then(res => {
                            console.log(res);
                        });
                    that.$api.searchSongs(that.key)
                        .then(response => {
                            // console.log(response.body);
                            that.result = response.body.data.song.list;
                        }, response => {
                            // error callback
                        });
                }
            },
            playMusic(index){
                let that = this;
                let currentMusic = that.result[index];
                let music = {
                    author:currentMusic.singer[0].name,
                    cover:"https://y.gtimg.cn/music/photo_new/T002R500x500M000" + currentMusic.albummid + ".jpg",
                    current:false,
                    id:currentMusic.songid,
                    name:currentMusic.songname,
                    mid:currentMusic.songmid,
                    albumname:currentMusic.albumname,
                    albummid:currentMusic.albummid,
                    albumid:currentMusic.albumid,
                    singerid:currentMusic.singer[0].id,
                    singermid:currentMusic.singer[0].mid
                };
                that.$store.commit('addAndPlay',music);
            },
            playRec(song){
                let that = this;
                that.showRec = false;
                that.$api.getSongDetail(song.mid)
                    .then(response => {
                        let data = response.body.data[0];
                        // console.log(data);
                        let music = {
                            author:data.singer[0].name,
                            cover:"https://y.gtimg.cn/music/photo_new/T002R500x500M000" + data.album.mid + ".jpg",
                            current:false,
                            id:data.id,
                            name:data.name,
                            mid:data.mid,
                            albumname:data.album.name,
                            albummid:data.album.mid,
                            albumid:data.album.id,
                            singerid:data.singer[0].id,
                            singermid:data.singer[0].mid
                        };
                        that.$store.commit('addAndPlay',music);
                    }, response => {
                        // error callback
                    });
            },
            closeRec(){
                this.showRec = false;
            },
            getAlbum(song){

            },
            toAlbum(id){
                this.$router.push({name: 'album', params: {id: id}})
            },
            toSinger(id){
                this.$router.push({name: 'singer', params: {id: id}})
            },
        },
        watch:{
            key: _.debounce(
                function () {
                    if(this.key === ''){
                        this.recommend = null;
                    }else{
                        this.$api.search(this.key)
                            .then(response => {
                                this.recommend = response.body.data;
                            }, response => {
                                // error callback
                            });
                    }

                },
                // 这是我们为用户停止输入等待的毫秒数
                300
            )
        }
    }
</script>

<style scoped>
    #search{
        width: 100%;
        position: fixed;
        top:0;
        left:0;
        background-color: #ccc;
    }
    .bar-header{
        width: 100%;
        padding: .3rem .25rem;
        color:#fff;
        position: absolute;
        top:0;
        left:0;
        z-index: 10;
        background-color: #C10D0C;
    }
    .bar-header .iconfont{
        color: #fff;
        font-size: .7rem;
    }
    .bar-header input{
        -webkit-appearance: none;
        height: 1.5rem;
        padding: 0;
        display: block;
        border:none;
        border-bottom: 1px solid #fff;
        background-color: #C10D0C;
        transition: all .4s cubic-bezier(.25,.8,.25,1);
        transition-property: font-size;
        color: #fff;
        line-height: 1.5rem;
        font-size: .7rem;
        outline:none;
    }
    .bar-header input::-webkit-input-placeholder { /* Chrome/Opera/Safari */
        color: #ccc;
    }

    .rec-container{
        width: 100%;
        position: absolute;
        top: 2.6rem;
        bottom:2.45rem;
        z-index: 20;
    }
    .recommend{
        padding: .2rem;
        position: absolute;
        left: 1.35rem;
        right: 1.35rem;
        background-color: #fff;
        box-shadow: 0px 0px 25px #ccc;
        z-index: 10;
        font-size: .7rem;
    }
    .recommend .iconfont{
        line-height: 1.3rem;
        color:#b8b8b8;
        font-size: .7rem;
    }
    .type-title{
        color: #b8b8b8;
        line-height: 1.5rem;
    }
    .rec-item{
        padding-left: 1.1rem;
        line-height: 1.5rem;
    }
    .recommend .singer{
        color: #b8b8b8;
        font-size: .65rem;
        flex-shrink: 0;
    }
    .recommend .rec-name{
        text-overflow: ellipsis;
        width: auto;
        overflow: hidden;
        white-space: nowrap;
        flex-wrap: nowrap;
    }

    .container{
        width: 100%;
        position: absolute;
        top:2.6rem;
        bottom:0;
        padding-bottom: 2.45rem;
        overflow: scroll;
        background-color: hsla(0, 0%, 90%, 1);
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
