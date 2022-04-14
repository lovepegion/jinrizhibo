<template>
  <li class="album-card1">
    <div class="album-image-container" @click="toAlbumDetail()">
      <div class="album-image" alt="cover" :style="album.cover ? {backgroundImage: 'url(' + '/webfile' + album.cover + ')'} : ''"></div>
    </div>
    <div class="item-content">
      <div class="item-content-title" :title="album.title">{{ album.title }}</div>
      <div class="item-content-info">
        <span style="margin-right: 20px;">{{album.synopsis}}</span>
        <span>{{ album.createDate }}</span>
      </div>
      <div class="t313c_wrap flex-align">
        <button class="plus0_delete button-info" @click="toAlbumUpdate">修改专辑</button>
        <button class="plus0_delete button-info" @click="onDeleteAlbum">删除专辑</button>
      </div>
    </div>
  </li>
</template>

<script>
import { deleteAlbum } from '@/api/album.js'
export default {
  name: 'UserAlbumItem',
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
    },
    async onDeleteAlbum () {
      let check = confirm("确认删除该视频吗？")
      if (check) {
        await deleteAlbum(this.album.id)
        location.reload()
      }
      return
    },
    toAlbumUpdate () {
      let routeData = this.$router.resolve({path: '/product/albumupdate/' + this.album.id})
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
    .flex-align {
      width: 150px;
      display: flex;
      justify-content: space-between;
    }
    .item-content-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 32px;
      overflow: hidden;
      display: -webkit-box;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      letter-spacing: 0;
      word-break: break-all;
      -webkit-box-orient: vertical;
      line-height: 20px;
    }
    .item-image {
      width: 196px;
      height: 112px;
      border-radius: 6px;
      background: #000 no-repeat 50%;
      background-size: cover;
      transition: all .5s ease-out .1s;
    }
    .item-content-info {
      color: #999999;
      font-size: 12px;
    }
    .button-info {
      color: #999999;
      font-size: 14px;
    }
    .button-info:hover {
      color: #fff;
    }
  }
}
</style>