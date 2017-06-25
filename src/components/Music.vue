<template>
    <div id="music">
        <div class="loading-box" v-if="loading">
            <svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
        </div>
        <template v-else>
            <div class="swiper-header">
                <div class="swiper-wrapper" v-if="data !== null">
                    <div  v-for="item in data.focus" class="swiper-slide">
                        <img :src="item.pic" :alt="item.title">
                    </div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
            <div class="label">热门歌单</div>
            <div class="row hot-diss" v-if="data !== null">
                <div class="col-33" v-for="item in data.hotdiss.list" @click="showList(item.dissid)">
                    <div class="img-box"><img :src="item.imgurl" alt=""></div>
                    <p :title="item.dissname" class="diss-name">{{ item.dissname }}</p>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import Swiper from './../swiper.js'
    import {mapMutations, mapState, mapGetters} from 'vuex'

    export default {
        data (){
            return {
                data:null,
                loading:true,
            }
        },
        created: function () {
            let that = this;
            that.loading = true;
            that.$api.getRecommands({})
                .then(response => {
                    that.loading = false;
                    that.data = response.body.data;
                    that.$nextTick(function(){
                        let mySwiper = new Swiper('.swiper-header', {
                            autoplay: 2000,//可选选项，自动滑动
                            pagination : '.swiper-pagination',
                        })
                    })
                }, response => {
                    that.loading = false;
                });

        },
        mounted:function(){

        },
        methods:{
            showList: function (id) {
                this.$router.push({name: 'dissList', params: {id: id}})
            }
        },
        computed:{
            ...mapState(['musicList','playing','action','index'])
        }
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
        padding-bottom: 2.45rem;
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
</style>
