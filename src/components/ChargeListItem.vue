<template>
  <li>
    <span class="spanItem">{{index+1}}</span>
    <span class="spanItem">{{item.nickName}}</span>
    <span class="spanItem">{{amount}}</span>
    <span v-if="item.payStatus==='YZF'" class="spanItem">成功</span>
    <span v-else class="spanItem">失败</span>
    <span class="spanItem">{{chargeType}}</span>
    <span class="spanItem">{{times}}</span>
    <span class="spanItem">{{item.createDate}}</span>
  </li>
</template>

<script>
export default {
  name: 'ChargeListItem',
  props: {
    item: { type: Object, default: () => ({
      nickname: '',
      detail: ' , , ',
      payStatus: '',
      createDate: ''
    })},
    index: { type: Number, default: () => 0 }
  },
  computed: {
    amount () {
      const tempObj = this.item.detail.split('，')
      return tempObj[2]
    },
    chargeType () {
      const tempObj = this.item.detail.split('，')
      return tempObj[0]
    },
    times () {
      const tempObj = this.item.detail.split('，')
      return tempObj[1]
    }
  }
}
</script>

<style>
.spanItem {
  flex: 1;
  text-align: center;
}
</style>