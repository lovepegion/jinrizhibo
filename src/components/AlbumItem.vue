<template>
  <div class="album-card1">
    <!-- 左侧封面 -->
    <div class="album-image-container" @click="toAlbumDetail()">
      <div class="album-image" alt="cover" :style="{backgroundImage: 'url(' + '/webfile' + album.cover + ')'}"></div>
    </div>
    <!-- 右侧介绍 -->
    <div class="item-content">
      <!-- 大标题 -->
      <div class="item-content-title" :title="album.title" style="cursor:pointer">{{ album.title }}</div>
      <!-- 中间label -->
      <div class="item-content-info">
        <span v-if="true" style="margin-right: 20px; color: #E4373A;">置顶</span>
        <span style="margin-right: 20px;">{{ '今日智播' }}</span>
        <span>{{ album.createDate }}</span>
      </div>
      <div class="t313c_wrap">
        <span style="fontSize:16px;color:goldenrod">视频专辑</span>
        <span class="iconfont icon-fenxiang t313c_share hover-blue">分享</span>
        <div class="t313c_1_wrap">
          <Share :title="album.title" :videoId="album.id" :isAlbum="true"></Share>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Share from '@/components/share/Share.vue'
export default {
  name: 'AlbumItem',
  components: { Share },
  props: {
    album: {
      type: Object
    }
  },
  methods: {
    toAlbumDetail () {
      // this.$router.push('/product/albumdetail')
      let routeData = this.$router.resolve({path: '/product/albumdetail/' + this.album.id})
      window.open(routeData.href, '_blank')
    }
  }
}
</script>

<style scoped lang="less">
.album-card1 {
  display: flex;
  width: 100%;
  margin-bottom: 30px;
  .album-image-container {
    width: 281px;
    height: 161px;
    background: url('../assets/image/folder.png');
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    .album-image {
      cursor: pointer;
      width: 225px;
      height: 129px;
      border-radius: 6px;
      background: #000 no-repeat 50%;
      background-size: cover;
      transition: all .5s ease-out .1s;
    }
  }
  .item-content {
    flex: 1;
    margin-left: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    // 312b_1_阅读数量和点击数量
    .t312b_1_com_number { // 点赞评论等下发的数字
      font-size: 12px;
      margin: 0 2px;
    }
    // 313c下载和分享
    .t313c_wrap {
      color: #999999;
      margin-top: 40px;
      span {
        cursor: pointer;
        margin-right: 10px;
      }
      // 313c_1分享弹窗
      .t313c_1_wrap {
        width: 450px;
        height: 120px;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.5);
        background-color: #2a2a32;
        transform-origin: top left;
        transform: scale(0);
        transition: 0.2s;
        position: absolute;
        z-index: 2;
        top: 113px;
        left: 110px;
      }
      .t313c_share:hover ~ .t313c_1_wrap {
        transform: scale(1);
      }
      .t313c_1_wrap:hover {
        transform: scale(1);
      }
    }
  }
}
</style>