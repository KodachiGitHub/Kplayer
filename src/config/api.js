/**
 * Created by sioxa on 2016/12/25 0025.
 */
export default {
    rank_songs: {
        url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
        params: (id) => {
            return {
                g_tk: 5381,
                uin: 0,
                format: 'jsonp',
                inCharset: 'utf-8',
                outCharset: 'utf-8',
                notice: 0,
                platform: 'h5',
                needNewCode: 1,
                tpl: 3,
                page: 'detail',
                type: 'top',
                topid: id,
                _: new Date().getTime()
            }
        },
        jsonp: 'jsonpCallback'
    },
    rank_list: {
        url: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
        params: () => {
            return {
                format: 'jsonp',
                g_tk: 5381,
                uin: 0,
                inCharset: 'utf-8',
                outCharset: 'utf-8',
                notice: 0,
                platform: 'h5',
                needNewCode: 1,
                _: new Date().getTime()
            }
        },
        jsonp: 'jsonpCallback'
    },
    album: {
        url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg',
        params: (id) => {
            return {
                albumid: id,
                g_tk: 5381,
                loginUin: 0,
                hostUin: 0,
                format: 'jsonp',
                inCharset: 'utf8',
                outCharset: 'utf-8',
                notice: 0,
                platform: 'yqq',
                needNewCode: 0
            }
        },
        jsonp: 'jsonpCallback'
    },
    song_detail:{
        url:"https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg",
        params:(id) => {
            return {
                songmid:id,
                tpl:'yqq_song_detail',
                format:'jsonp',
                callback:'getOneSongInfoCallback',
                g_tk:2121795121,
                jsonpCallback:'getOneSongInfoCallback',
                loginUin:0,
                hostUin:0,
                inCharset:'utf8',
                outCharset:'utf-8',
                notice:0,
                platform:'yqq',
                needNewCode:0,
            }
        },
    },
    singer_info: {
        url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
        params: (id) => {
            return {
                order: 'listen',
                begin: 0,
                num: 8,
                singermid: id,
                g_tk: 5381,
                uin: 0,
                format: 'jsonp',
                inCharset: 'utf-8',
                outCharset: 'utf-8',
                notice: 0,
                platform: 'h5page',
                needNewCode: 1,
                from: 'h5',
                _: new Date().getTime()
            }
        },
        jsonp: 'jsonpCallback'
    },
    singer_songs:{
        url:'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
        params:(id) => {
            return {
                g_tk:2121795121,
                loginUin:0,
                hostUin:0,
                format:'jsonp',
                inCharset:'utf8',
                outCharset:'utf-8',
                notice:0,
                platform:'yqq',
                needNewCode:0,
                singermid:id,
                order:'listen',
                begin:0,
                num:100,
                songstatus:1
            }
        },
        jsonp: 'jsonpCallback'
    },
    singer_album:{
        url:'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_album.fcg',
        params:(mid) => {
            return {
                g_tk:2121795121,
                format:'jsonp',
                loginUin:0,
                hostUin:0,
                inCharset:'utf8',
                outCharset:'utf-8',
                notice:0,
                platform:'yqq',
                needNewCode:0,
                singermid:mid,
                order:'time',
                begin:0,
                num:100,
                exstatus:1,
            }
        },
        jsonp: 'jsonpCallback'
    },
    search: {
        url: 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg',
        params: (key) => {
            return {
                is_xml: 0,
                format: 'jsonp',
                key: key,
                g_tk: 5381,
                loginUin: 0,
                hostUin: 0,
                inCharset: 'utf8',
                outCharset: 'utf-8',
                notice: 0,
                platform: 'yqq',
                needNewCode: 0
            }
        },
        jsonp: 'jsonpCallback'
    },
    search_songs:{
        url:'https://c.y.qq.com/soso/fcgi-bin/client_search_cp',
        params:(key) => {
            return {
                ct:24,
                qqmusic_ver:1298,
                remoteplace:'txt.yqq.song',
                t:0,
                aggr:1,
                cr:1,
                catZhida:1,
                lossless:0,
                flag_qc:0,
                p:1,
                n:40,
                w:key,
                g_tk:5381,
                loginUin:0,
                hostUin:0,
                format:'jsonp',
                inCharset:'utf8',
                outCharset:'utf-8',
                notice:0,
                platform:'yqq',
                needNewCode:0,
            }
        },
        jsonp: 'jsonpCallback'
    },
    hotkey: {
        url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
        params: () => {
            return {
                g_tk: 5381,
                loginUin: 0,
                hostUin: 0,
                format: 'jsonp',
                inCharset: 'utf8',
                outCharset: 'utf-8',
                notice: 0,
                platform: 'yqq',
                needNewCode: 0
            }
        },
        jsonp: 'jsonpCallback'
    },
    home_page_data: {
        url: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
        params: () => {
            return {
                g_tk: 5381,
                uin: 0,
                format: 'jsonp',
                inCharset: 'utf-8',
                outCharset: 'utf-8',
                notice: 0,
                platform: 'h5',
                needNewCode: 1,
                _: new Date().getTime()
            }
        },
        jsonp: 'jsonpCallback'
    },
    lyric: {
        url: 'http://66.112.218.34:8090/getLyric',
        params: (mid) => {
            return {
                url: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
                pcachetime:Date.parse(new Date()),
                songmid:mid,
                g_tk:1837373724,
                loginUin:0,
                hostUin:0,
                inCharset:'utf8',
                outCharset:'utf-8',
                notice:0,
                platform:'yqq',
                needNewCode:0,
                format:'jsonp',
                callback:'MusicJsonCallback_lrc'
            }
        },
        jsonp: 'jsonpCallback',
        jsonpCallback:'MusicJsonCallback_lrc'
    },
    cd:{
        url:'http://66.112.218.34:8090/cdlist',
        params:(id)=>{
            return {
                url:'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
                type:1,
                json:1,
                onlysong:0,
                disstid:id,
                format:'jsonp',
                g_tk:5381,
                uin:0,
                loginUin:0,
                hostUin:0,
                inCharset:'utf-8',
                outCharset:'utf-8',
                notice:0,
                platform:'yqq',
                needNewCode:0,
            }
        },
        jsonp: 'jsonpCallback',
        jsonpCallback:'cdlistCaallback'
    },
    first_page_data:{
        url:"https://c.y.qq.com/v8/fcg-bin/fcg_first_yqq.fcg",
        params(){
            return{
                format:'jsonp',
                tpl:'v12',
                page:'other',
                rnd:0,
                g_tk:new Date().getTime(),
                loginUin:0,
                hostUin:0,
                inCharset:'utf8',
                outCharset:'GB2312',
                notice:0,
                platform:'yqq',
                needNewCode:0
            }
        },
        jsonp: 'jsonpCallback'
    },
    mv_list:{
        url:'https://c.y.qq.com/v8/fcg-bin/getmv_by_tag',
        params:(tag) => {
            return{
                g_tk:5381,
                loginUin:0,
                hostUin:0,
                format:'jsonp',
                inCharset:'utf8',
                outCharset:'GB2312',
                notice:0,
                platform:'yqq',
                needNewCode:0,
                cmd:'shoubo',
                lan:tag,
            }
        },
        jsonp: 'jsonpCallback'
    },
    music_vKey:{
        url:'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg',
        params:(mid) => {
            return {
                g_tk:1278911659,
                hostUin:0,
                inCharset:'utf8',
                outCharset:'utf-8',
                notice:0,
                platform:'yqq',
                needNewCode:0,
                cid:205361747,
                uin:0,
                songmid:mid,
                filename:'C400' + mid + '.m4a',
                guid:3655047200
            }
        },
    }

}
