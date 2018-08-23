<template>
    <div id="music">
        <div class="loading-box" v-if="loading">
            <svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
        </div>
        <div class="music-list" ref="music-list" v-else>
            <div class="swiper-header">
                <div class="swiper-wrapper" v-if="banners">
                    <div  v-for="banner in banners" class="swiper-slide">
                        <img :src="banner.picUrl.replace('http://','https://')">
                    </div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
            <div class="label">热门歌单</div>
            <div class="row hot-diss" v-if="hotPlaylist && hotPlaylist.length > 0">
                <div class="col-33" v-for="item in hotPlaylist" @click="showList(item.id)">
                    <div class="img-box"><img :src="item.coverImgUrl" alt=""></div>
                    <p :title="item.name" class="diss-name">{{ item.name }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Swiper from './../swiper.js'

    export default {
        data (){
            return {
                banners: null,
                hotPlaylist: null,
                loading: true,
            }
        },
        created() {
            let that = this;
            that.getBanner();
            that.getPlayList();
        },
        methods:{
            getBanner(){
                let that = this;
                that.$api.banner()
                    .then(res => {
                        if(res.data.code === 200){
                            that.banners = res.data.banners;
                        }else{
                            that.banners = [];
                        }
                        that.$nextTick(function(){
                            let mySwiper = new Swiper('.swiper-header', {
                                autoplay: 2000,//可选选项，自动滑动
                                pagination : '.swiper-pagination',
                            });
                        });
                    })
            },
            //获取精品歌单
            getPlayList(){
                let that = this;
                that.loading = true;
                that.$api.playlistHighQuality()
                    .then(res => {
                        that.loading = false;
                        if(res.data.code === 200){
                            that.hotPlaylist = res.data.playlists;
                        }
                    });
            },
            showList(id){
                this.$router.push({name: 'dissList', params: {id: id}})
            }
        },
    };
</script>

<style>
    @import "../assets/css/swiper-3.4.2.min.css";
    .swiper-header{
        height: 8rem;
        position: relative;
        overflow: hidden;
    }
    .swiper-slide img{
        width: 100%;
        height: 100%;
        display: block;
    }
    .swiper-pagination-bullet-active{
        background: #fff;
    }

    .hot-diss{
        padding-bottom: .5rem;
        flex-wrap: wrap;
    }
    .hot-diss .col-33{
        margin-bottom: .5rem;
    }
    .hot-diss .img-box{
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        background: #cccccc url('http://o81tu7lli.bkt.clouddn.com/defaultCover.jpg') center center /contain no-repeat;
        display: block;
    }
    .img-box img{
        width: 100%;
        display: block;
    }
    .diss-name{
        margin: .3em .1em .1em .1em;
        font-size: .6rem;
        line-height: 1rem;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .music-list{
        width: 100%;
        height: 100%;
    }
</style>
