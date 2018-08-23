import Vue from 'vue'
import axios from 'axios'

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

const neteaseBaseUrl = 'http://kodachi.cn';

export default {
    //网易云音乐banner轮播图
    banner(){
        return axios.get(neteaseBaseUrl + '/banner')
    },
    //网易云音乐精品歌单
    playlistHighQuality(){
        return axios.get(neteaseBaseUrl + '/top/playlist/highquality?limit=30')
    },
    //网易云音乐歌单详情
    playlistDetail(id){
        return axios.get(neteaseBaseUrl + `/playlist/detail?id=${id}`)
    },
    //网易云，歌词接口
    lyric(id){
        return axios.get(neteaseBaseUrl + `/lyric?id=${id}`)
    },
    //网易云，音乐url
    musicUrl(id){
        return axios.get(neteaseBaseUrl + `/music/url?id=${id}`)
    },
    //网易云，搜索接口
    neteaseSearch(key){
        return axios.get(neteaseBaseUrl + `/search?keywords=${key}&limit=50`)
    },
    //专辑详情接口，传专辑id
    neteaseAlbum(id){
        return axios.get(neteaseBaseUrl + `/album?id=${id}`)
    },
    //歌手热门单曲和部分基本信息
    singerSongs(id){
        return axios.get(neteaseBaseUrl + `/artists?id=${id}`)
    },
    //歌手专辑列表
    singerAlbums(id){
        return axios.get(neteaseBaseUrl + `/artist/album?id=${id}&limit=50`)
    },
    //专辑详情
    album(id){
        return axios.get(neteaseBaseUrl + `/album?id=${id}`)
    },
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
