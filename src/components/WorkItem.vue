<template>
  <li>
    <span style="flex:1">{{index + 1}}</span>
    <div style="flex:2;">
      <img :src="(JSON.parse(work.cover)[0].indexOf('http') != -1) ? JSON.parse(work.cover)[0] : '/webfile'+JSON.parse(work.cover)[0]" class="imgcover" @click="toDetail(work.id)">
    </div>
    <div style="flex:4" class="no-wrap">{{work.title}}</div>
    <span style="flex:2">{{work.channelName}}</span>
    <span style="flex:2">{{work.nickname}}</span>
    <span style="flex:2">{{albumTitle}}</span>
  </li>
</template>

<script>
export default {
  name: 'WorkItem',
  props: {
    work: {
      type: Object
    },
    index: {
      type: Number
    },
    albumTitle: {
      type: String
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
.imgcover {
  margin-top: 3px;
  width: 45px;
  height: 45px;
  border-radius: 5px;
  cursor: pointer;
}
.no-wrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>