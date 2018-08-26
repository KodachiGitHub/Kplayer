<template>
    <div id="userList">
        <div class="user-list" v-if="userInfo">
            <div class="loading-box" v-if="loading">
                <svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
            </div>
            <div v-else ref="music-list" class="music-list">
                <ul>
                    <li class="flex rank-item" v-for="item in playlist" @click="showList(item.id)">
                        <div class="rank-media">
                            <img :src="item.coverImgUrl.replace('http://','https://')" alt="">
                        </div>
                        <div class="flex-1 rank-info">
                            <p class="list-name">{{ item.name }}</p>
                            <p class="list-number">{{ item.trackCount }}首</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="login-box" v-else>
            <p class="login-title">登陆网易云账号</p>
            <input class="phone" type="text" placeholder="请输入手机号" v-model="phone">
            <input class="password" type="password" placeholder="请输入密码" v-model="password">
            <div class="btn btn-login" @click="login">登陆</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading: false,
                phone:'',
                password:'',
                playlist: null
            }
        },
        created() {
            let that = this;
            if(that.userInfo){
                that.getPlayList();
            }
        },
        computed:{
            userInfo(){
                return this.$store.state.userInfo
            }
        },
        methods: {
            login(){
                let that = this;
                if(that.phone !== '' && that.password !== ''){
                    that.$api.login(that.phone,that.password)
                        .then(res => {
                            if(res.data.code === 200){
                                that.$store.commit('login',{
                                    account: res.data.account,
                                    profile: res.data.profile,
                                    bindings: res.data.bindings
                                });
                                that.getPlayList();
                            }
                        });
                }

            },
            getPlayList(){
                let that = this;
                that.loading = true;
                that.$api.userPlayList(that.userInfo.account.id)
                    .then(res => {
                        if(res.data.code === 200){
                            that.loading = false;
                            that.playlist = res.data.playlist;
                        }
                    })
            },
            showList(id){
                this.$router.push({name: 'dissList', params: {id: id}})
            }

        }
    }
</script>

<style scoped lang="scss">
    .btn{
        position: relative;
        display: inline-block;
        padding: 6px 12px;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-repeat: repeat-x;
        background-position: -1px -1px;
        background-size: 110% 110%;
        border: 1px solid rgba(27,31,35,0.2);
        border-radius: 0.25em;
        -webkit-appearance: none;
    }
    .login-box{
        height: 100%;
        padding-top: 2rem;
        background-color: #fff;
        text-align: center;
        font-size: .8rem;

        .phone,.password{
            width: 65%;
            display: block;
            margin: .6rem auto;
            min-height: 34px;
            padding: 10px;
            line-height: 20px;
            color: #24292e;
            vertical-align: middle;
            background-color: #fff;
            background-repeat: no-repeat;
            background-position: right 8px center;
            border: 1px solid #d1d5da;
            border-radius: 3px;
            outline: none;
            box-shadow:inset 0 1px 2px rgba(27,31,35,0.075);
        }
        .login-title{
            margin: 0 0 1rem 0;
        }
        .btn-login{
            width: 65%;
            margin: 0 auto;
            padding: 3px 10px;
            font-size: .7rem;
            line-height: 1.6em;
            color: #fff;
            background-color: #cc3b23;
            background-image: linear-gradient(-180deg, #cc3b23 0%, #cc3b23 90%);
        }
    }

    .user-list ul {
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
        font-size: .8rem;
    }

    .rank-item .rank-info .list-number {
        margin: .5em 0;
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