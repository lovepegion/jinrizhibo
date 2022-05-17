<template>
  <li class="list-item">
    <div class="image-container" @click="$emit('changeCurrentVideo', videoItem)">
      <img :src="(videoItem.coverUrl[0].indexOf('http') != -1) ? videoItem.coverUrl[0] : '/webfile'+videoItem.coverUrl[0]" alt="cover">
      <i class="inner-play"></i>
    </div>
    <div class="item-detail">
      <div class="title" @click="toDetail(videoItem.id)">{{videoItem.title}}</div>
      <div class="info">
        <span>{{videoItem.createDate}}</span>
        <span>点击{{videoItem.clicks}}</span>
        <span>收藏{{videoItem.collect}}</span>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: 'VideoListItem',
  props: {
    videoItem: {
      type: Object,
      default: () => ({
        coverUrl: [],
        id: '',
        title: '',
        createDate: '',
        clicks: 0,
        collect: 0
      })
    }
  },
  methods: {
    toDetail (id) {
      let routeData = this.$router.resolve({path: `/product/detail/${id}`})
      window.open(routeData.href, '_blank')
    }
  }
}
</script>

<style scoped lang="less">
  .list-item {
    width: 303px;
    height: 110px;
    color: #fff;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    .image-container {
      cursor: pointer;
      position: relative;
      img {
        width: 120px;
        height: 90px;
      }
      .inner-play {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 30px;
        height: 30px;
        background: url('../assets/icon/play.png');
        background-size: contain;
      }
    }
    .item-detail {
      width: 130px;
      height: 90px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
        font-size: 12px;
        color: #ccc;
        text-align: left;
        line-height: 1.5;
      }
      .title:hover {
        cursor: pointer;
        color: aqua;
        text-decoration: underline;
      }
      .info {
        font-size: 12px;
        color: #666;
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
