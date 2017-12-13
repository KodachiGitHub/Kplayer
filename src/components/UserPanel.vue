<template>
    <div id="user-panel">
        <transition name="fade">
            <div v-show="slideShow" class="wrap" @click="wrapClick"></div>
        </transition>
        <transition name="slide" @after-leave="afterLeave">
            <div v-show="slideShow" class="panel-container">
                <div class="panel-header" :style="{background:'url(http://p1.music.126.net/i0qi6mibX8gq2SaLF1bYbA==/2002210674180198.jpg) center center /cover no-repeat'}"></div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        props:['panelShow'],
        data (){
            return {
                slideShow:this.panelShow,
            }
        },
        methods:{
            wrapClick:function(){
                this.slideShow = false;
            },
            afterLeave:function(){
                this.$emit('wrapClick');
            }
        },
        watch:{
            panelShow:function(newValue){
                this.slideShow = newValue;
            }
        }
    }
</script>

<style scoped>
    #user-panel{
        width: 100%;
        height: 100%;
        position: absolute;
        top:0;
        left:0;
        z-index: 3000;
    }
    .wrap{
        width: 100%;
        height: 100%;
        position: absolute;
        top:0;
        background-color: rgba(0,0,0,.5);
    }
    .panel-container{
        width: 80%;
        height: 100%;
        position: absolute;
        top:0;
        left:0;
        background-color: #fff;
        /*background:url('../assets/bg-panel.jpg') center center /cover no-repeat;*/
    }

    .panel-header{
        width: 100%;
        height: 8.5rem;
    }


    .slide-enter-active {
        animation: panel-slide-in .5s;
    }
    .slide-leave-active {
        animation: panel-slide-out .5s;
    }
    @keyframes panel-slide-in {
        0% {
            transform: translate(-100%,0);
        }
        100% {
            transform: translate(0,0);
        }
    }
    @keyframes panel-slide-out {
        0% {
            transform: translate(0,0);
        }
        100% {
            transform: translate(-100%,0);
        }
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
    .fade-enter, .fade-leave-active {
        opacity: 0
    }
</style>
