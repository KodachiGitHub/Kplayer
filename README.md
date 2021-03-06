# Kplayer

> 基于vue制作的网页音乐播放器


## Build Setup

``` bash
# 安装依赖
npm install

# 启动项目
npm run dev

# 打包
npm run build
```

##项目用到的api服务器

项目目前主要使用网易云音乐的api，服务器代码来自于 https://github.com/Binaryify/NeteaseCloudMusicApi。

启用流程：

``` bash
git clone git@github.com:Binaryify/NeteaseCloudMusicApi.git

cd NeteaseCloudMusicApi

npm install

node app.js
```


## 部分更新计划

1.添加代理服务器。因为现在有部分接口必须通过代理转接才能正常访问，所以计划将代理的代码整理出来一并放上去

2.将全屏的播放器抽出来做成一个路由页面，底部播放条依然是全局的组件

3.缓存处理，对路由添加keep-alive属性。

4.计划对项目进行pwa改造

5.做歌词分享功能，看到网易云音乐有这个功能，挺酷的。现在的思路是使用canvas去做

6.后期会将api迁移到网易云这里，添加登陆，收藏等功能，尽可能让这个项目更有实用价值