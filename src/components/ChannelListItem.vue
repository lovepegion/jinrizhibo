<template>
  <li
    :class="channelItem.company.trim().length<=4 ? 'channelitem1': (channelItem.company.trim().length>5 ? 'channelitem3': 'channelitem2')"
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
  .channelitem1 {
    color: #fff;
    height: 45px;
    min-width: 110px;
    padding: 0 20px;
    text-align: center;
    line-height: 45px;
    font-size: 17px;
  }
  .channelitem2 {
    color: #fff;
    height: 45px;
    min-width: 140px;
    padding: 0 20px;
    text-align: center;
    line-height: 45px;
    font-size: 17px;
  }
  .channelitem3 {
    color: #fff;
    height: 45px;
    min-width: 160px;
    padding: 0 20px;
    text-align: center;
    line-height: 45px;
    font-size: 17px;
  }
  .channelitem1:hover {
    cursor: pointer;
  }
  .channelitem2:hover {
    cursor: pointer;
  }
  .channelitem3:hover {
    cursor: pointer;
  }
</style>
