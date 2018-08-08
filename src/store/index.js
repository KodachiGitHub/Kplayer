/**
 * Created by JK on 2017/6/24.
 */
import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex);

function filter(arr,item,key){
    for(let i = 0; i < arr.length; i ++){
        if(arr[i][key] === item[key]){
            return i;
        }
    }
    return -1;
}


export default new Vuex.Store({
    state:{
        musicList:[],
        playing:false,
        action:'',
        index:-1,
        loginInfo:null,
        pageRouter:'forward'
    },
    getters: {
        newMusicList: state => {
            let len = state.musicList.length;
            let list = state.musicList;
            for(let i = 0; i < len; i++){
                if(list[i].cover.indexOf('http://66.112.218.34:8090/img?url=') === -1){
                    list[i].cover = 'http://66.112.218.34:8090/img?url=' + list[i].cover;
                }
            }
            return list;
        },
    },
    mutations:{
        pageNav(state,pageRouter){
            state.pageRouter = pageRouter;
        },
        deleteMusic(state,index){
            state.musicList.splice(index,1);
        },
        clearList(state){
            state.musicList.splice(0,state.musicList.length);
            state.playing = false;
            state.index = -1;
            state.action = 'clear';
        },
        clearAction(state){
            state.action = '';
        },
        replaceList(state,list){
            state.musicList.splice(0,state.musicList.length);
            if(list.index !== undefined){
                state.musicList.push(...list.list);
                state.index = list.index;
            }else{
                state.musicList.push(...list);
                state.index = 0;
            }
            state.action = 'playList';
            state.playing = true;
        },
        addAndPlay(state,music){
            let index = filter(state.musicList,music,'id');
            if(index === -1){
                state.musicList.splice(state.index + 1,0,music);
                state.index += 1;
            }else{
                state.index = index;
            }
            console.log('yes');
            state.playing = true;
        },
        addMusic(state,music){
            state.musicList.splice(state.index + 1,0,music);
        },
        changePlayState(state,playing){
            state.playing = playing;
        },
        changeIndex(state,index){
            state.index = index;
        }
    },
});