<template>
    <div class="wrap">
        <!-- 0_左侧部分 -->
        <div class="t0_wrap">
            <!-- 0_1普通分享 -->
            <ul class="t0_1_ul">
                <li v-for="(item, index) in shareApis" :key="index">
                    <Apiitem
                        :itemName="item.title"
                        :itemIconClass="item.iconClass"
                        :apiUrl="item.url"
                        :shareUrl="videoUrl"
                        :shareTitle="title"
                        :videoId="videoId"
                    ></Apiitem>
                </li>
            </ul>
            <!-- 0_2地址分享 -->
            <div class="t0_2_wrap">
                <!-- 0_2_1视频链接 -->
                <input class="t0_2_1_url" :value="playUrl" readonly ref="videoUrl">
                <!-- 0_2_2复制按钮 -->
                <button class="t0_2_2_button" @click="onCopy">复制视频链接</button>
            </div>
        </div>
        <!-- 1_右侧 -->
        <div class="t1_wrap">
            <!-- t1_1视频动态二维码 -->
            <div ref="qrCodeDiv"></div>
            <!-- t1_2微信分享标题 -->
            <span class="t1_2_title">微信分享</span>
        </div>
    </div>
</template>

<script>
import { videoPlayUrl } from '@/api/visit_base_url.js'
import Apiitem from './components/Apiitem.vue'
import QRCode from 'qrcodejs2'
export default {
    name: 'Share',
    components: { Apiitem },
    props: ['videoUrl', 'title', 'videoId', 'isAlbum'],
    data () {
        return {
            playUrl: this.isAlbum ? videoPlayUrl + 'albumdetail/' + this.videoId : videoPlayUrl + 'detail/' + this.videoId,
            shareApis: [
                { title: 'QQ', url: 'http://connect.qq.com/widget/shareqq/index.html', iconClass: 'icon-QQ' },
                { title: 'QQ空间', url: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey', iconClass: 'icon-QQkongjian' },
                { title: '微博', url: 'http://v.t.sina.com.cn/share/share.php', iconClass: 'icon-icon_xinlang-chunselogo' },
                { title: '豆瓣', url: 'http://www.douban.com/recommend/', iconClass: 'icon-douban' },
                { title: '贴吧', url: 'http://tieba.baidu.com/f/commit/share/openShareApi', iconClass: 'icon-social-tieba' }
            ]
        }
    },
    methods: {
        // 操作剪切板
        onCopy () {
            const videoUrl = this.$refs.videoUrl
            videoUrl.select()
            document.execCommand("Copy","false",null)
            videoUrl.unselect()
        }
    },
    mounted () {
        new QRCode(this.$refs.qrCodeDiv, {
            text: this.playUrl,
            width: 100,
            height: 80,
            colorDark: "#333333", //二维码颜色
            colorLight: "#ffffff", //二维码背景色
            correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
        })
    }
}
</script>

<style scoped lang="less">
.wrap {
    background-color: #2a2a32;
    width: 450px;
    height: 100px;
    padding: 10px;
    color: #fff;
    display: flex;
}
// 0_左侧部分
.t0_wrap {
    width: 290px;
    border-right: 1px solid #ccc;
    // 0_1普通分享
    .t0_1_ul {
        width: 290px;
        display: flex;
        justify-content: space-around;
    }
}
// 0_2地址分享
.t0_2_wrap {
    margin-top: 20px;
    display: flex;
    align-items: center;
    // 0_2_1视频链接
    .t0_2_1_url {
        outline: none;
        border: none;
        margin-left: 12px;
        background-color: black;
        color: #8ea09d;
        font-size: 14px;
        width: 160px;
        overflow: hidden;
    }
    // 0_2_2复制按钮
    .t0_2_2_button {
        width: 100px;
        outline: none;
        border: none;
        background-color: skyblue;
        color: #fff;
        font-size: 14px;
        padding: 2px;
        border-radius: 4px;
    }   
}
// 1_右侧
.t1_wrap {
    margin-top: 22px;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // t1_2微信分享标题
    .t1_2_title {
        line-height: 24px;
        font-size: 14px;
    }
}
</style>