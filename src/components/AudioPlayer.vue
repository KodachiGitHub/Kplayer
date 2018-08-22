<template>
    <div>
        <audio :src="src" ref="player" :loop="loop"></audio>
    </div>
</template>

<script>
    export default {
        props:['src','loop'],
        data() {
            return {
                playPromise:null,
                player:null
            }
        },
        mounted(){
            let that = this;
            that.player  = that.$refs.player;

            that.player.addEventListener('loadedmetadata',function(){
                that.$emit('loadedmetadata',that.player.duration);
            },false);

            that.player.addEventListener('play',function(){
                that.$emit('play');
            },false);
        },
        methods:{
            play(){
                let that = this;
                if(that.player.src && that.player.src !== ''){
                    that.playPromise = that.player.play();
                }
            },
            pause(){
                let that = this;
                if(that.playPromise){
                    that.playPromise.then(() => {
                        that.player.pause();
                    });
                }else{
                    that.player.pause();
                }
            }
        }
    }
</script>

<style scoped>

</style>
