<template>
  <li
    class="channel-item"
    @click="$emit('getCompanyWorks', (channelItem.company==='全部' ? '' : channelItem.company))"
  >{{channelItem.company}} </li>
</template>

<script>
export default {
  name: 'ChannelListItem',
  props: {
    channelItem: {
      type: Object,
      default: () => ({
        company: ''
      })
    }
  }
}
</script>

<style scoped lang="less">
  .channel-item {
    color: #fff;
    height: 45px;
    padding: 0 20px;
    text-align: center;
    line-height: 45px;
    font-size: 17px;
  }
  .channel-item:hover {
    cursor: pointer;
  }
</style>
