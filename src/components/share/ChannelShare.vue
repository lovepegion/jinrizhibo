<template>
    <div class="wrap">
        <div class="title">分享到： </div>
        <ul class="common-share">
            <li v-for="(item, index) in channelShareApis" :key="index">
                <ShareApiitem
                    :itemName="item.title"
                    :itemIconClass="item.iconClass"
                    :apiUrl="item.url"
                    :shareUrl="videoUrl"
                    :shareTitle="title"
                    :videoId="videoId"
                ></ShareApiitem>
            </li>
        </ul>
        <div class="weixin-share" ref="weixinShare">
            <!-- t1_1视频动态二维码 -->
            <div ref="qrCodeDiv" title="微信扫码分享"></div>
            <!-- t1_2微信分享标题 -->
            <!-- <span class="t1_2_title">微信分享</span> -->
        </div>
    </div>
</template>

<script>
import { videoPlayUrl } from '@/api/visit_base_url.js'
import ShareApiitem from './components/ShareApiitem.vue'
import QRCode from 'qrcodejs2'
import {channelShareApis} from '@/utils/common_info.js'
export default {
    name: 'ChannelShare',
    components: { ShareApiitem },
    props: ['videoUrl', 'title', 'videoId', 'isAlbum'],
    data () {
        return {
            playUrl: this.isAlbum ? videoPlayUrl + 'albumdetail/' + this.videoId : videoPlayUrl + 'detail/' + this.videoId,
            channelShareApis,
            scanImage: ''
        }
    },
    watch: {
        videoId () {
            for (let i = 0; i < this.$refs.weixinShare.getElementsByTagName('img').length; i++) {
                this.$refs.weixinShare.getElementsByTagName('img')[i].style.display = "none"
            }
            new QRCode(this.$refs.qrCodeDiv, {
                text: videoPlayUrl + 'detail/' + this.videoId,
                width: 65,
                height: 55,
                colorDark: "#333333", //二维码颜色
                colorLight: "#eee", //二维码背景色
                correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
            })
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
            width: 65,
            height: 55,
            colorDark: "#333333", //二维码颜色
            colorLight: "#eee", //二维码背景色
            correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
        })
    }
}
</script>

<style scoped lang="less">
.wrap {
    width: 320px;
    padding: 10px;
    color: #000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // 0_1普通分享
    .common-share {
        width: 150px;
        display: flex;
        justify-content: space-around;
    }
}
</style>