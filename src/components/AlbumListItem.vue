<template>
  <li class="list-item">
    <img :src="'/webfile'+albumItem.cover" alt="cover">
    <div class="item-detail">
      <div class="title" @click="toAlbum(albumItem.id)">{{albumItem.title}}</div>
      <div class="info">
        <span>{{albumItem.createDate}}</span>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: 'AlbumListItem',
  props: {
    albumItem: {
      type: Object,
      default: () => ({
        id: '',
        cover: '',
        title: '',
        createDate: '',
      })
    }
  },
  methods: {
    toAlbum (id) {
      let routeData = this.$router.resolve({path: '/product/albumdetail/' + id})
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
    img {
      width: 120px;
      height: 90px;
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
        line-height: 1.2;
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
