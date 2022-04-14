<template>
  <div class="usercenter-charege">
    <ul class="list">
      <li class="item" style="fontWeight:bold">
        <span class="spanItem">序号</span>
        <span class="spanItem">用户</span>
        <span class="spanItem">金额</span>
        <span class="spanItem">状态</span>
        <span class="spanItem">类型</span>
        <span class="spanItem">次数/月数</span>
        <span class="spanItem">时间</span>
      </li>
      <ChargeListItem class="item" v-for="(item, index) in list" :key="item.id" :index="index" :item="item"></ChargeListItem>
      <a-empty class="list-empty" v-if="list.length === 0" />
    </ul>
    <div class="pagination">
      <a-pagination v-model="pageNumber" :total="total" @change="onPageChange" :pageSize="pageSize" />
    </div>
  </div>
</template>

<script>
import { getAllPayRecharge, getUserPayRecharge } from '@/api/weixinpay.js'
import ChargeListItem from '@/components/ChargeListItem.vue'
export default {
  name: 'Charge',
  components: { ChargeListItem },
	data() {
		return {
			list: [],	//	充值记录
      countPrice: '', // 单次价格
      mPrice1: '', // 1个月价格
      mPrice3: '',
      mPrice6: '',
      mPrice12: '',
      pageNumber: 1,
      pageSize: 10,
      total: 9
		}
	},
  methods: {
    onPageChange () {
      this.onGetAllPayRecharge()
    },
    async onGetAllPayRecharge () {
      const listres = await getAllPayRecharge({
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
        // payStatus: 'YZF'
      })
      this.list = listres.data.list
      this.total = listres.data.total
      console.log('listres', listres)
    }
  },
  mounted () {
    this.onGetAllPayRecharge()
  }
}
</script>

<style scoped lang="less">
.usercenter-charege {
  padding: 20px;
  .list {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    .item {
      width: 100%;
      border-bottom: 1px solid #EEEEEE;
      margin-bottom: 21px;
      cursor: default;
      display: flex;
      justify-content: space-between;
      .spanItem {
        flex: 1;
        text-align: center;
      }
    }
    .list-empty {
      margin: 100px 0;
      width: 100%;
      text-align: center;
    }
  }
}
</style>