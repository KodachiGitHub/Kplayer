import Vue from 'vue'

import API from './config/api'

function apiFactory(api) {
    return (id = null) => Vue.http.jsonp(
        api.url,
        {
            params: api.params(id),
            jsonp: api.jsonp,
            jsonpCallback:api.jsonpCallback || ''
        }
    )
}

export default {
    getSongDetail(mid){
        return apiFactory(API.song_detail)(mid)
    },
    getRankSongs(id){
        return apiFactory(API.rank_songs)(id)
    },
    getSingerAlbum(mid){
        return apiFactory(API.singer_album)(mid)
    },
    getRankList({}){
        return apiFactory(API.rank_list)()
    },
    getAlbum(id){
        return apiFactory(API.album)(id)
    },
    getSingerInfo(id){
        return apiFactory(API.singer_info)(id)
    },
    getSingerSongs(id){
        return apiFactory(API.singer_songs)(id)
    },
    search(key){
        return apiFactory(API.search)(key)
    },
    searchSongs(key){
        return apiFactory(API.search_songs)(key)
    },
    getHotKey(){
        return apiFactory(API.hotkey)()
    },
    getRecommands({}){
        return apiFactory(API.first_page_data)()
    },
    getCdList(id){
        return apiFactory(API.cd)(id)
    },
    getLyric(mid){
        return apiFactory(API.lyric)(mid)
    },
    music_vKey(mid){
        return apiFactory(API.music_vKey)(mid)
    }
}
