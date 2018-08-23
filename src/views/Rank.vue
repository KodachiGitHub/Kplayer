<template>
    <div class="rank">
        <div class="loading-box" v-if="loading">
            <svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
        </div>
        <div v-else ref="music-list" class="music-list">
            <ul >
                <li class="flex rank-item" v-for="item in topList" @click="showRank(item.id)">
                    <div class="rank-media">
                        <img :src="item.picUrl.replace('http://','https://')" alt="">
                        <span class="listen-count">{{item.listenCount | listenCount}}</span>
                    </div>
                    <div class="flex-1 rank-info">
                        <p class="rank-songs" v-for="(song,index) in item.songList">
                            {{index+1}}{{song.songname}}<span class="rank-singername">-{{song.singername}}</span>
                        </p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                topList: null,
                loading:true,
            }
        },

        methods: {
            showRank: function (id) {
                this.$router.push({name: 'rankList', params: {id: id}})
            }
        },
        created: function () {
            let that = this;
            that.loading = true;
            that.$api.getRankList({})
                .then(response => {
                    that.loading = false;
                    that.topList = response.body.data.topList;
                    that.$nextTick(() => {
                    });
                }, response => {
                    // error callback
                });
        },
        filters: {
            listenCount: num => {
                return Math.round(num / 1000) / 10 + '万'
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .rank ul {
        margin: 0;
        padding: .5rem;
        list-style: none;
        background-color: hsla(0, 0%, 90%, 1);
    }

    .rank-item{
        height: 5rem;
        background: #fff;
        margin-bottom: .5rem;
        box-shadow: 0 0 .5rem #DDD;
        border-radius: .25rem;
        overflow: hidden;
    }
    .rank-item:nth-last-child(1){
        margin: 0;
    }

    .rank-item .rank-media {
        width: 5rem;
        height: 5rem;
        position: relative;
    }

    .rank-item .rank-media img {
        width: 100%;
        height: 100%;
        display: block;
        border-bottom-left-radius: 5px;
        border-top-left-radius: 5px;
        z-index: 0;
    }

    .rank-item .rank-media .listen-count {
        position: absolute;
        bottom: .15rem;
        left: .15rem;
        color: #fff;
        font-size: .6rem;
    }

    .rank-item .rank-info {
        padding: .25rem .5rem;
        overflow: hidden;
    }

    .rank-item .rank-info .rank-songs {
        margin: .7em 0;
        font-size: .7rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .rank-item .rank-info .rank-singername {
        color: #8f8f8f;
    }

    .music-list{
        width: 100%;
        height: 100%;
    }
</style>
