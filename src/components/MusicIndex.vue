<template>
    <!--歌单页面-->
    <div id="list-index">
        <div class="flex bar-header">
            <span class="iconfont icon-back"></span>
            <div class="flex-1 info">
                <p class="music-name">专辑页面</p>
                <p class="author">专辑作者</p>
            </div>
            <span>{{ id }}</span>
        </div>
    </div>
</template>

<script>
    let coverImg = require('./../assets/cover_01.jpg');
    export default {
        data (){
            return {
                cover:coverImg,
                name:'歌单名称',
                id:this.$route.params.id
            }
        }
    };
</script>

<style scoped>
    #list-index{
        width: 100%;
        position: absolute;
        top:0;
        left:0;
    }
    .icon-back{
        color:#fff;
    }
</style>
