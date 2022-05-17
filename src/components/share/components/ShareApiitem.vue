<template>
    <div class="channel-share-item">
        <!-- 0_图片链接 -->
        <a :href="`${apiUrl}?title=${shareTitle}&url=${playUrl}`" target="_blank">
            <span class="t0_icon iconfont" :class="itemIconClass" :title="itemName"></span>
        </a>
        <!-- 1_图片标题 -->
        <!-- <span class="t1_name">{{itemName}}</span> -->
    </div>
</template>

<script>
import { videoPlayUrl } from '@/api/visit_base_url.js'
export default {
    name: 'ShareApiitem',
    props: ['itemName', 'itemIconClass', 'apiUrl', 'shareUrl', 'shareTitle', 'videoId'],
    data () {
        return {
            playUrl: videoPlayUrl + this.videoId
        }
    }
}
</script>

<style scoped lang="less">
.channel-share-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
// 0_图片链接
.t0_icon {
    font-size: 26px;
    color: #aaa;
}
// 1_图片标题
.t1_name {
    line-height: 24px;
    font-size: 14px;
}
</style>