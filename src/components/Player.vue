<template>
    <div id="music-player">
        <!--迷你底部播放器-->
        <div class="flex player-bottom">
            <div class="cover" @click="fullScreen"><img :src="music.cover" alt=""></div>
            <div class="flex-1 info" @click="fullScreen">
                <p class="music-name">{{ music.name }}</p>
                <p class="author">{{ music.author }}</p>
            </div>
            <div class="controls">
                <span class="iconfont icon-list" @click="openList"></span>
                <span class="iconfont" :class="{ 'icon-play': !playing, 'icon-pause': playing }" @click="play"></span>
                <span class="iconfont icon-next" @click="playNext(true)"></span>
            </div>
            <div class="progress" :style="{ width : progress + '%'}"></div>
            <audio id="player" :src="music.src" :loop="circleMode === 'single'"></audio>
        </div>
        <!--迷你底部播放器结束-->

        <!--全屏的播放器-->
        <transition name="swipe">
            <div class="player-full" v-show="isFullScreen">
                <canvas class="background" id="player-background"></canvas>
                <div class="player-container">
                    <div class="flex bar-header">
                        <span @click="closeFull" class="iconfont icon-back"></span>
                        <div class="flex-1 info">
                            <p class="music-name">{{ music.name }}</p>
                            <p class="author">{{ music.author }}</p>
                        </div>
                        <span v-if="music.id !== -1" class="iconfont icon-operation" @click="openActionSheet"></span>
                    </div>
                    <div class="cover-big rotate" :class="{ 'animate-paused': !playing }" v-if="!showLyric">
                        <img :src="music.cover" alt="" class="">
                    </div>
                </div>
                <div class="control-box">
                    <div class="flex time-bar">
                        <div class="time">{{ formatTime }}</div>
                        <div  class="flex-1 progress-bar">
                            <div class="progress" :style="{ width : progress + '%'}"></div>
                            <div class="time-point" :style="{ left: progress + '%' }"></div>
                        </div>
                        <div class="time">{{ formatDuration }}</div>
                    </div>
                    <div class="btn-box">
                        <div class="btn-play iconfont" :class="{ 'icon-play': !playing, 'icon-pause': playing }" @click="play"></div>
                        <span class="btn-next iconfont icon-next" @click="playNext(true)"></span>
                        <span class="btn-pre iconfont icon-pre" @click="playPre"></span>
                        <span class="btn-circle iconfont" :class="'icon-circle-' + circleMode" @click="modeChange"></span>
                        <span class="btn-list iconfont icon-list" @click="openList"></span>
                    </div>
                </div>
                <div class="showLyric" @click="toggleLyric"></div>
                <div class="lyric" :style="lyricOpacity" @click="toggleLyric">
                    <div class="lyric-list" :style="lyricScroll" v-if="lyric !== null">
                        <p v-for="(text,index) in lyric" :class="{on : lyricIndex === index}">{{ text.text }}</p>
                    </div>
                </div>
            </div>
        </transition>
        <p id="lyricFix" v-if="lyric !== null">{{ lyric[lyricIndex].text }}</p>  <!--校准用，始终显示方便获取高度，对用户不可见-->
        <!--全屏的播放器结束-->

        <!--播放列表-->
        <transition name="fade" >
            <div class="list-container" v-show="showList">
                <div class="list-wrap" v-if="showList" @click="closeList"></div>
                <transition name="slide">
                    <div class="music-list" v-show="showList">
                        <div class="flex list-head border-bottom">
                            <div @click="modeChange">
                                <span class="iconfont" :class="'icon-circle-' + circleMode"></span> {{ circleModeText }}({{ listLength }})
                            </div>
                            <div class="flex-1"></div>
                            <div @click="clearList">
                                <span class="iconfont icon-clear"></span>清空
                            </div>
                        </div>
                        <ul>
                            <li v-for="(music,indexOflist) in musicList" class="border-bottom" :class="{ current:indexOflist === index }" @click="changeMusic(indexOflist)">
                                <div class="flex music-info"><span class="music-name">{{ music.name }}</span><span class="flex-1 author">-{{ music.author }}</span></div>
                                <div @click.stop="deleteMusic(indexOflist)" class="iconfont icon-delete"></div>
                            </li>
                        </ul>
                    </div>
                </transition>
            </div>
        </transition>
        <!--播放列表结束-->
        <!--操作菜单-->
        <transition name="fade" >
            <action-sheet v-if="showActionSheet" @closeAction="closeActionSheet"  @closePlayer="closeFull" :music="music"></action-sheet>
        </transition>
        <!--操作菜单结束-->

    </div>
</template>

<script>
    import ActionSheet from './ActionSheet.vue'
    import stackBlur from './../stackBlur.js'
    function _utf8_decode(utftext)  {
        let string = "";
        let i = 0;
        let c = 0;
        let c3 = 0;
        let c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }

    export default {
        components:{
            ActionSheet
        },
        data () {
            return {
                showList:false,
                music:{
                    id:-1,
                    name:'music player',
                    author:'Kodachi',
                    cover:'http://onpnulig2.bkt.clouddn.com/cover.jpg?imageView2/0/w/500',
                    src:'',
                    current:false,
                },
                duration:0,
                progress:0,
                currentTime:0, //当前的播放时间
                player:null,
                isFullScreen:false,
                circleMode:'list', //列表循环模式,  list : 列表循环  single : 单曲循环  random :  随机播放
                rotateAngle:0,
                randomIndex:0,//随机列表的下标
                interval:null,
                rotation:null,
                lyric:null,
                showLyric:false,
                lyricIndex:0,
                initScrollHeight:document.querySelector('body').offsetHeight / 2 - 25,
                windowHeight:null,
                lyricScroll:null,
                scrollHeightFix:0, //有些歌词可能会占据超过两行的空间，用这个校准
                showActionSheet:false,
                playerBackground:null,
                windowRatio:0,
                rotateClass:''
            }
        },
        computed:{
            lyricOpacity:function(){
                if(this.showLyric){
                    return 'opacity:1'
                }else{
                    return 'opacity:0'
                }
            },
            playing:function(){
                return this.$store.state.playing //当前的播放状态
            },
            index:function(){
                return this.$store.state.index
            },
            action:function(){
                return this.$store.state.action
            },
            musicList:function(){
                return this.$store.getters.newMusicList;
            },
            //返回格式化的时间
            formatTime:function(){
                let that = this;
                if(!that.currentTime) return '00:00';
                let time = parseInt(that.currentTime);
                let s = time % 60;
                let m = parseInt(time/60);
                return that.format([m,s]).join(':');
            },
            formatDuration:function(){
                let that = this;
                if(!that.duration) return '00:00';
                let time = parseInt(that.duration);
                let s = time % 60;
                let m = parseInt(time/60);
                return that.format([m,s]).join(':');
            },
            listLength:function(){
                return this.musicList.length;
            },
            //随机排序后的播放列表，存储随机的数组下标
            randomList:function(){
                let that = this;
                let random = [];
                for(let i = 0;i < that.musicList.length;i ++){
                    random[i] = i;
                }
                for (let i = random.length-1; i >=0; i--) {
                    let randomIndex = Math.floor(Math.random()*(i+1));
                    let itemAtIndex = random[randomIndex];
                    random[randomIndex] = random[i]; random[i] = itemAtIndex;
                }
                that.randomIndex = random.indexOf(that.index);
                return random;
            },
            circleModeText:function(){
                let text = {
                    list:'列表循环',
                    single:'单曲循环',
                    random:'随机播放'
                };
                return text[this.circleMode];
            }
        },
        mounted:function(){
            let that = this;
            /*计算窗口的高度*/
            that.windowHeight = document.querySelector('body').offsetHeight;

            //mounted时获取audio元素，更改player.player属性
            // 监听audio的play事件，更新播放进度数据
            that.player = document.querySelector('#player');
            that.player.addEventListener('loadedmetadata',function(){
                let player = that.player;
                that.duration = player.duration;
            },false);

            function getTime(timeStr){
                let arr = timeStr.split(':');
                return parseInt(arr[0]) * 60 + parseInt(arr[1]);
            }

            //触发播放事件时更新进度，封面旋转角度等数据
            that.player.addEventListener('play',function(e){
                let player = that.player;
                clearInterval(that.interval);
                cancelAnimationFrame(that.rotation);

                that.interval = setInterval(function(){
                    if(!that.duration || that.duration === 0){
                        that.duration = player.duration;
                    }
                    that.progress = player.currentTime / player.duration * 100;
                    that.currentTime = player.currentTime;

                    if(that.lyric !== null){
                        /*滚动歌词*/
                        let height = 0;
                        if(that.lyric[that.lyricIndex + 1] && getTime(that.lyric[that.lyricIndex + 1].time) <= that.currentTime){
                            that.lyricIndex += 1;
                            if(document.querySelector('#lyricFix')){
                                that.scrollHeightFix += document.querySelector('#lyricFix').offsetHeight - 35;
                            }
                            height = parseInt(that.initScrollHeight- 35 * that.lyricIndex - that.scrollHeightFix);
                            that.lyricScroll =  'transition: -webkit-transform 0.1s ease-out;transform:translate3d(0,'+ height +'px,0)';
                        }
                    }

                },500);
                let st = new Date();
                let coverRoting = function(){
                    if(new Date() - st >= 1000/40 && that.playing){
                        st = new Date();
                        that.rotateAngle >= 360 ? that.rotateAngle = 0.5 : that.rotateAngle += 0.5;
                    }
                    that.rotation = requestAnimationFrame(coverRoting);
                };
                coverRoting();
            },false);
            that.player.addEventListener('ended',function(){
                that.lyricIndex = 0;
                that.playNext();
            },false);

            //如果播放列表里有歌曲就默认读取第一首歌
            if(that.musicList.length > 0){
                that.music = that.musicList[0];
                that.index = 0;
            }

            this.initCanvas();

        },
        methods:{
            initCanvas(){
                let that = this;
                that.playerBackground = document.querySelector('#player-background');

                that.windowRatio = document.body.clientWidth/document.body.clientHeight;
                let canvas = that.playerBackground;
                canvas.width = document.body.clientWidth;
                canvas.height = document.body.clientHeight;
                that.drawBackground();
            },
            drawBackground(){
                let that = this;
                let ratio = that.windowRatio;
                let canvas = that.playerBackground;
                let ctx = canvas.getContext('2d');

                let img = document.createElement('img');
                img.crossOrigin = '';
                img.src = that.music.cover;

                img.onload = function(){
                    ctx.clearRect( 0, 0, canvas.width, canvas.height );
                    ctx.drawImage(img,(500 - ratio * 500)/2,0,ratio * 500,500,0,0,canvas.width,canvas.height);
                    stackBlur.stackBlurCanvasRGB('player-background',0,0,canvas.width,canvas.height,150);
                };
            },
            play:function(){
                if(this.musicList.length > 0){
                    this.$store.commit('changePlayState',!this.playing);
                }
            },
            initPlayer:function(){
                let that = this;
                clearInterval(that.interval);
                cancelAnimationFrame(that.rotation);
                that.currentTime = 0;
                that.duration = 0;
                that.progress = 0;
                that.music = {
                    id:-1,
                    name:'music player',
                    author:'Kodachi',
                    cover:'http://o81tu7lli.bkt.clouddn.com/cover.jpg',
                    src:'',
                    current:false,
                };
            },
            format:function(num){
                for(let i = 0;i < num.length; i ++){
                    if(num[i] < 10){
                        num[i] = '0' + num[i];
                    }
                }
                return num;
            },

            //切换播放模式
            modeChange:function(){
                let that = this;
                let modeList = ['list','single','random'];
                let index = modeList.indexOf(that.circleMode);
                index === modeList.length - 1 ? index = 0 : index += 1;
                that.circleMode = modeList[index];
            },

            //几种常见的列表播放模式，单曲循环，列表循环，随机播放
            //随机播放需要考虑到音乐重复播放的问题
            //manual 是否是由用户手动点击下一曲。手动：下一曲 自动切换：按照循环模式切换
            playNext:function(){
                let that = this;
                that.player.currentTime = 0;
                that.progress = 0;
                that.rotateAngle = 0;
                that.$store.commit('changePlayState',false);

                that.$nextTick(function(){
                    if(that.listLength > 0){
                        if(that.circleMode === 'list' || that.circleMode === 'single'){
                            that.index === that.musicList.length - 1 ? that.$store.commit('changeIndex',0) : that.$store.commit('changeIndex',that.index + 1);
                            that.music = that.musicList[that.index];
                            that.randomIndex = that.randomList.indexOf(that.index);
                        }else{
                            that.randomIndex === that.randomList.length - 1 ? that.randomIndex = 0 : that.randomIndex += 1;
                            that.$store.commit('changeIndex',that.randomList[that.randomIndex]);
                            that.music = that.musicList[that.index];
                        }
                    }

                    that.$store.commit('changePlayState',true);
                });
            },
            //上一首
            playPre:function(){
                let that = this;
                that.currentTime = 0;
                that.progress = 0;
                that.rotateAngle = 0;
                if(that.listLength > 0){
                    if(that.circleMode === 'list' || that.circleMode === 'single'){
                        that.index === 0 ? that.$store.commit('changeIndex',that.listLength - 1) : that.$store.commit('changeIndex',that.index - 1);
                        that.music = that.musicList[that.index];
                        that.randomIndex = that.randomList.indexOf(that.index);
                    }else{
                        that.randomIndex === 0 ? that.randomIndex = that.randomList.length - 1 : that.randomIndex -= 1;
                        that.$store.commit('changeIndex',that.randomList[that.randomIndex]);
                        that.music = that.musicList[that.index];

                    }
                }
            },
            //点击播放列表中的歌曲，切换歌曲
            changeMusic:function(index){
                let that = this;
                if(index !== that.index){
                    that.currentTime = 0;
                    that.progress = 0;
                    that.rotateAngle = 0;
                    that.$store.commit('changeIndex',index);
                    that.music = that.musicList[that.index];
                }
            },
            //从播放列表中删除一首歌
            deleteMusic:function(index){
                let that = this;
                if(index === that.index){
                    this.$store.commit('deleteMusic', index);
                    if(that.musicList.length === 0){
                        that.initPlayer();
                        that.$store.commit('changeIndex',-1);
                    }else if(index === that.musicList.length){
                        that.$store.commit('changeIndex',that.index - 1);
                        that.playNext();
                    }else{
                        that.music = that.musicList[index];
                    }
                }else if(index < that.index){
                    this.$store.commit('deleteMusic', index);
                    that.$store.commit('changeIndex',that.index - 1);
                }else if(index > that.index){
                    this.$store.commit('deleteMusic', index);
                }
            },
            clearList:function(){
                this.$store.commit('clearList');
            },
            openList:function(){
                this.showList = true;
            },
            closeList:function(){
                this.showList = false;
            },
            fullScreen:function(){
                this.isFullScreen = true;
            },
            closeFull:function(){
                this.isFullScreen = false;
            },
            toggleLyric:function () {
                this.showLyric = !this.showLyric;
            },
            openActionSheet:function(){
                this.showActionSheet = true;
            },
            closeActionSheet:function(){
                this.showActionSheet = false;
            }
        },
        watch:{
            index:function(to,from){
                this.music = this.musicList[to];
            },
            //检测playing值得变化，调用audio的播放，暂停功能
            playing:function(newValue,oldValue){
                let that = this;
                if(newValue){
                    if(!that.music.id){
                        that.music = that.musicList[that.index];
                    }
                    this.player.play();
                }else{
                    this.player.pause();
                }
            },
            //music指向列表中的一首歌，指向发生变化时更改audio.src属性
            music:function(newValue,oldValue){
                let that = this;
                if(newValue.id !== oldValue.id){
                    that.drawBackground();

                    that.$api.music_vKey(newValue.mid)
                        .then(res => {
                            console.log(res.body);
                            let musicData = res.body.data.items[0];
                            let musicUrl = `http://dl.stream.qqmusic.qq.com/${musicData.filename}?vkey=${musicData.vkey}&guid=3655047200&fromtag=66`;
                            that.player.src = '';
                            that.player.src = musicUrl;
                            console.log('yes');

                            if(that.playing){
                                setTimeout(function(){
                                    that.player.play();
                                },300);
                            }
                        });

                    that.lyric = null;
                    that.$api.getLyric(newValue.mid)
                        .then(response => {
                            let lyric = _utf8_decode(atob(response.body.lyric)).split('\n');
                            if(lyric[0].indexOf('[0') !== 0){
                                lyric.splice(0,5);
                            }
                            let obj = [];
                            for(let i = 0;i< lyric.length;i++){
                                if(lyric[i].slice(10,lyric[i].length).toString().trim() !== ''){
                                    obj.push ({
                                        time:lyric[i].slice(1,9),
                                        text:lyric[i].slice(10,lyric[i].length).toString()
                                    });
                                }
                            }
                            that.lyric = Array.from(obj);
                            that.lyricIndex = 0;
                            that.scrollHeightFix = 0;
                            that.$nextTick(function(){
                                that.lyricScroll = 'transition: -webkit-transform 0.1s ease-out;transform:translate3d(0,'+ that.initScrollHeight +'px,0)';
                            });
                        }, response => {
                            // error callback
                        });

                    //播放器背景
                    that.$nextTick(() => {
                        let playerBackgroundImage = document.querySelector('#player-background');
                        playerBackgroundImage.onload = function(){
                            // console.log(playerBackgroundImage.src,playerBackgroundImage.naturalWidth,playerBackgroundImage.naturalHeight);
                        };
                    });
                }
            },
            action:function(to,from){
                let that = this;
                if(to === 'playList' && that.musicList.length > 0){
                    that.player.currentTime = 0;
                    that.music = that.musicList[that.index];
                    that.$store.commit('clearAction');
                    return;
                }
                if(to === 'clear'){
                    that.initPlayer();
                    that.$store.commit('clearAction');
                }
            }
        }
    }
</script>

<style scoped>
    .player-bottom{
        width: 100%;
        height: 2.5rem;
        padding-top: .15rem;
        position: fixed;
        bottom: 0;
        left:0;
        background-color: rgba(255,255,255,.9);
        z-index: 1000;
    }
    .cover{
        width: 2.1rem;
        height: 2.1rem;
        margin: -3px 7px 0 5px;
        flex-shrink: 0;
        background-color: #fff;
    }
    .cover img{
        display: block;
        width: 100%;
        height: 100%;
        flex-shrink: 0;
    }
    .progress{
        height: .1rem;
        background-color: #C10D0C;
        position: absolute;
        bottom: 0;
        left:0;
    }
    .info{
        margin-right: .3rem;
        overflow: hidden;
    }
    .music-name{
        font-size: .7rem;
        line-height: 1rem;
        margin: 0 0 .35rem 0;
        text-overflow: ellipsis;
        width: auto;
        overflow: hidden;
        white-space: nowrap;
        flex-wrap: nowrap;
    }
    .author{
        margin: .4em 0 0 0;
        color: #c0c0c0;
        font-size: 12px;
    }
    .controls{
        flex-shrink: 0;
        margin-right: .25rem;
    }
    .controls .iconfont{
        font-size: 1rem;
    }

    /*播放列表*/
    .list-container{
        width: 100%;
        height: 100%;
        position: fixed;
        top:0;
        left:0;
        overflow: hidden;
        z-index: 1200;
    }
    .list-wrap{
        width: 100%;
        height: 100%;
        position: absolute;
        top:0;
        left:0;
        background-color: rgba(0,0,0,.5);
    }
    .music-list{
        width: 100%;
        height: 65%;
        position: absolute;
        bottom: 0;
        background-color: #fff;
        font-size: .75rem;
    }
    .slide-enter-active {
        animation: slide-in .5s;
    }
    .slide-leave-active {
        animation: slide-out .5s;
    }
    @keyframes slide-in {
        0% {
            transform: translate(0,100%);
        }
        100% {
            transform: translate(0,0);
        }
    }
    @keyframes slide-out {
        0% {
            transform: translate(0,0);
        }
        100% {
            transform: translate(0,100%);
        }
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
    .fade-enter, .fade-leave-active {
        opacity: 0
    }
    .list-head{
        padding: 0 .5rem;
        line-height: 2.2rem;
        position: relative;
        text-align: left;
    }
    .list-head .iconfont{
        margin-left: 0;
        position: relative;
        left: 0;
        color: #000;
        font-size: .8rem;
    }
    /*.border-bottom:after{
        content: '';
        position: absolute;
        left: 0;
        bottom:0;
        background: #ccc;
        width: 100%;
        height: 1px;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
    }*/
    .music-list ul{
        width: 100%;
        margin: 0;
        padding: 0;
        position: absolute;
        top:2.2rem;
        bottom: 0;
        list-style: none;
        overflow: scroll;
    }
    .current{
        color:#C10D0C;
    }
    .music-list li{
        padding: 0 .5rem;
        line-height: 1.7rem;
        position: relative;
    }
    .music-info{
        width: 90%;
    }

    .icon-delete{
        color:#ccc;
        font-size: .6rem;
        padding: 0 .25rem;
        line-height: 1.7rem;
        position: absolute;
        top:0;
        right:0;
    }
    .music-list .music-name{
        max-width: 65%;
        margin-bottom: 0;
    }
    .music-list .author{
        margin-top: 0;
        font-size: .5rem;
        color:#ccc;
        text-overflow: ellipsis;
        width: auto;
        overflow: hidden;
        white-space: nowrap;
        flex-wrap: nowrap;
    }

    /*全屏播放组件*/
    .player-full{
        width: 100%;
        height: 100%;
        position: fixed;
        top:0;
        left:0;
        background-color: #3c3f41;
        z-index: 1100;
    }
    .background{
        width: 100%;
        height: 100%;
        position: absolute;
        top:0;
        left:0;
        opacity: .6;
    }
    .player-container{
        width: 100%;
        height: 100%;
        position: absolute;
        overflow: hidden;
    }
    .bar-header{
        padding: 8px .25rem;
    }
    .bar-header .iconfont{
        font-size: .8rem;
    }
    .bar-header .info{
        margin-left: .3rem;
    }
    .bar-header p{
        margin: 0;
        color:#fff;
    }
    .bar-header .author{
        color:#ccc;
    }
    .player-full .iconfont{
        color:#fff;
    }
    .cover-big{
        position: relative;
        margin-top: 1rem;
        left: 20%;
        width: 60%;
        height: 0;
        overflow: hidden;
        padding-bottom: 60%;
    }
    .cover-big img{
        width: 100%;
        height: 100%;
        display: block;
        position: absolute;
        top:0;
        left:0;
        border-radius: 50%;
    }
    .control-box{
        width: 100%;
        padding-bottom: 1rem;
        position: absolute;
        bottom: 0;
    }
    .time-bar{
        padding: 0 .5rem;
        margin-bottom: .75rem;
    }
    .progress-bar{
        height: .14rem;
        background-color: #ccc;
        position: relative;
    }
    .progress-bar .progress{
        height: 100%;
    }
    .time{
        margin: 0 .4rem;
        color:#ccc;
        font-size: .5rem;
    }
    .time-point{
        width: .4rem;
        height: .4rem;
        margin-left: -.2rem;
        position: absolute;
        top:-.13rem;
        border-radius: 50%;
        background-color: #fff;
    }

    .swipe-enter-active {
        animation: swipe-in .6s;
    }
    .swipe-leave-active {
        animation: swipe-out .6s;
    }
    @keyframes swipe-in {
        0% {
            transform: translate(100%,0);
        }
        100% {
            transform: translate(0,0);
        }
    }
    @keyframes swipe-out {
        0% {
            transform: translate(0,0);
        }
        100% {
            transform: translate(100%,0);
        }
    }
    .btn-box{
        text-align: center;
    }
    .btn-play{
        font-size: 2.3rem;
        margin: 0 auto;
        display: inline-block;
        text-align: center;
        line-height: 2.3rem;
    }
    .btn-list,.btn-next,.btn-pre,.btn-circle{
        font-size: 1.4rem;
        line-height: 2.3rem;
        position: absolute;
    }
    .btn-next{
        left:50%;
        margin-left: 2.2rem;
    }
    .btn-pre{
        right:50%;
        margin-right: 2.2rem;
    }
    .btn-list{
        font-size: 1.2rem;
        right: 1.5rem;
    }
    .btn-circle{
        font-size: 1.2rem;
        left: 1.5rem;
    }

    /*歌单主页*/
    .list-index .icon-back{
        color:#fff;
    }

    /*主页*/
    .main-container{
        width: 100%;
        height: 100%;
        position: absolute;
        top:0;
        left:0;
    }

    /*歌词*/
    .lyric,.showLyric{
        width: 100%;
        padding: 0 .5rem;
        position: absolute;
        top:3rem;
        bottom:6.5rem;
        overflow: hidden;
        color: #fff;
        text-align: center;
        font-size: .7rem;
    }
    .lyric .on{
        color:#C10D0C;
    }
    .lyric-list{
        transform: translate3d(0,250px,0);
    }
    .lyric-list p,#lyricFix{
        padding: .6em 0;
        margin: 0;
        line-height: 1rem;
        font-size: .7rem;
    }

    .rotate{
        animation: coverRotate 25s linear infinite;
    }
    @keyframes coverRotate {
        from{
            transform: rotate(0deg);
        }
        to{
            transform: rotate(360deg);
        }
    }
    .animate-paused{
        -webkit-animation-play-state: paused; /* Safari 4.0 - 8.0 */
        animation-play-state: paused;
    }
</style>
