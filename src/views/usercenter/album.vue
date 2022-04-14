<template>
  <div class="usercenter-product">
    <ul class="list">
      <li class="item" v-for="item in list" :key="item.id">
        <p>我是album组件</p>
      </li>
      <a-empty class="list-empty" v-if="list.length === 0" />
    </ul>
    <button @click="onDeleteAlbum()">删除专辑</button>
    <!-- <div class="pagination">
      <a-pagination v-model="pageNumber" :total="total" @change="onPageChange" :pageSize="pageSize" />
    </div> -->
  </div>
</template>

<script>
import { deleteAlbum } from '@/api/album.js'
export default {
  name: 'album',
	data() {
		return {
			list: [],	//	作品列表
		}
	},
  methods: {
    onDeleteAlbum () {
      // await deleteAlbum('1345f94fd1d1479baae385772070a38f')
      deleteAlbum('fdc924581d894425864a12f14f814fe2')
    }
  }
}
</script>

<style lang="less">
.usercenter-product {
  padding: 20px;
  .list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    .item {
      width: 100%;
      display: flex;
      border-bottom: 1px solid #EEEEEE;
      margin-bottom: 21px;
      cursor: default;
    }
    .list-empty {
      margin: 100px 0;
      width: 100%;
      text-align: center;
    }
  }
}
</style>