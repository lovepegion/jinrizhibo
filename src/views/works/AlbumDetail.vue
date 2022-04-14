<template>
  <div class="detail-container">
    <div class="top">
      <img class="cover-img" :src="'/webfile/'+albumInfo.cover">
      <div class="top-right">
        <h1 class="top-title">{{albumInfo.title}}</h1>
        <div class="describe">{{albumInfo.content}}</div>
        <div class="button-group">
          <a-button type="primary" @click="playAlbum()"><a-icon type="play-circle"/>全部播放</a-button>
          <div>
            <span style="lineHeight:32px">企业：{{albumInfo.synopsis}}</span>
          </div>
          <!-- <a-button><a-icon type="star" />收藏</a-button>
          <a-button><a-icon type="facebook" />分享</a-button> -->
        </div>
      </div>
    </div>
    <div class="bottom">
      <h1 class="bottom-title">全部视频</h1>
      <ul class="work-list">
        <li class="work-item-title odd-bg-color">
          <span style="flex:1">序号</span>
          <span style="flex:2">封面</span>
          <span style="flex:4">标题</span>
          <span style="flex:2">频道</span>
          <span style="flex:2">作者</span>
          <span style="flex:2">专辑</span>
        </li>
        <WorkItem
          v-for="(work, index) in products"
          :key="index"
          :albumTitle="albumInfo.title"
          :work="work"
          :index="index"
          class="work-item"
          :class="{'odd-bg-color':index%2}"
        ></WorkItem>
      </ul>
    </div>
  </div>
</template>

<script>
import { getAlbumDetail } from '@/api/album.js'
import { getProductDetail } from '@/api/make.js'
import WorkItem from '@/components/WorkItem.vue'
export default {
  name: 'AlbumDetail',
  data () {
    return {
      albumInfo: {}, //专辑除视频外的信息
      products: [], //专辑视频信息
    }
  },
  components: { WorkItem },
  methods: {
    playAlbum () {
      console.log('playAlbum')
      let routeData = this.$router.resolve({path: `/product/detail/${this.products[0].id}/album/${this.albumInfo.id}/0`})
      window.open(routeData.href, '_blank')
    },
    async onGetAlbumDetail () {
      const { data: { album, productInfo: { list } }} = await getAlbumDetail({ albumId: this.$route.params.id, pageNumber: 1, pageSize: 999 })
      this.albumInfo = album
      const https = list.map(listItem => getProductDetail({id: listItem.id}))
      const allres = await Promise.all(https)
      allres.forEach(res => this.products.push(res.data))
      console.log('orderproducts', this.products)
    } 
  },
  mounted () {
    this.onGetAlbumDetail()
  }
}
</script>

<style scoped lang="less">
  .detail-container {
    .top {
      margin-top: 30px;
      display: flex;
      justify-content: left;
      .cover-img {
        width: 300px;
        height: 200px;
      }
      .top-right {
        text-align: left;
        padding-left: 40px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .top-title {
          color: #303133;
          font-size: 30px;
          font-weight: bold;
        }
        .describe {
          color: #606266;
          font-size: 14px;
        }
        .button-group {
          width: 300px;
          display: flex;
          justify-content: space-between;
        }
      }
    }
    .bottom {
      .bottom-title {
        color: #303133;
        font-size: 28px;
        margin: 30px 0;
        text-align: left;
      }
      .work-list {
        .work-item-title {
          height: 50px;
          line-height: 50px;
          padding: 0 20px;
          color: #909399;
          display: flex;
          justify-content: space-between;
        }
        .work-item {
          height: 50px;
          line-height: 50px;
          padding: 0 20px;
          font-size: 14px;
          color: #303133;
          display: flex;
          justify-content: space-between;
        }
        .work-item:hover {
          background-color: rgb(209, 207, 207);
        }
        .odd-bg-color {
          background-color: #e6e3e3;
        }
      }
    }
  }
</style>