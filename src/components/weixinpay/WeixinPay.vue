<template>
  <div>
    <!-- 支付方式 -->
    <div class="pay-ways">
      <div class="way-item" :class="{active: wayActive===1}" @click="changeToMonth">月卡</div>
      <div class="way-item" style="borderRight:1px solid #ccc" :class="{active: wayActive===2}" @click="changeToCount()">次卡</div>
    </div>
    <!-- 按月支付 -->
    <div class="container" v-if="wayActive===1">
      <PayItem
        v-for="(item, index) in monthPrices"
        :key="index"
        :item="item"
        @click.native="onActive(index)"
        @getCurrentPay="currentPay=$event"
        :active="index===currentIndex"
      ></PayItem>
    </div>
    <!-- 按次支付 -->
    <div class="container" v-if="wayActive===2">
      <PayItem
        v-for="(item, index) in countPrices"
        :key="index"
        :item="item"
        @click.native="onActive(4)"
        @getCurrentPay="currentPay=$event"
        :active="currentIndex===4"
      ></PayItem>
    </div>
    <!-- 选择的金额和支付方式 -->
    <div class="paycheck">
      <div>¥<span class="item_price">{{currentPay}}</span></div>
      <label>
        <div style="paddingBottom:7px">
          <input type="radio" checked>
          <span> 微信支付</span>
        </div>
      </label>
    </div>
  </div>
</template>

<script>
import PayItem from './PayItem.vue'
import { getPayConfig } from '@/api/weixinpay.js'
export default {
  name: 'WeixinPay',
  components: { PayItem },
  data () {
    return {
      originPrices: [], //获取的原始价格套餐
      currentIndex: 0, //当前选择的item
      currentPay: 200,
      wayActive: 1, //当前支付方式
      countPrices: [
        {time: '1次', price: 0, single: '¥10/次'},
      ],
      monthPrices: [
        {time: '1个月(30天)', price: 0, single: '¥200/月'},
        {time: '3个月(90天)', price: 0, single: '¥200/月'},
        {time: '6个月(180天)', price: 0, single: '¥200/月'},
        {time: '12个月(365天)', price: 0, single: '¥200/月'},
      ]
    }
  },
  methods: {
    changeToCount () {
      this.wayActive = 2
      this.currentIndex = 4
      this.currentPay = this.countPrices[0].price
      this.$emit('onGetFee', this.originPrices[4])
    },
    changeToMonth () {
      this.wayActive = 1
      this.currentIndex = 0
      this.currentPay = this.monthPrices[0].price
      this.$emit('onGetFee', this.originPrices[0])
    },
    initPrice (prices) {
      this.$set(this.monthPrices[0], 'price', (prices[0].price / 100))
      this.$set(this.monthPrices[0], 'single', '¥' + (prices[0].price / 100) + '/月')

      this.$set(this.monthPrices[1], 'price', prices[1].price / 100)
      this.$set(this.monthPrices[1], 'single', '¥' + (prices[1].price / 300).toFixed() + '/月')

      this.$set(this.monthPrices[2], 'price', prices[2].price / 100)
      this.$set(this.monthPrices[2], 'single', '¥' + (prices[2].price / 600).toFixed() + '/月')

      this.$set(this.monthPrices[3], 'price', prices[3].price / 100)
      this.$set(this.monthPrices[3], 'single', '¥' + (prices[3].price / 1200).toFixed() + '/月')

      this.$set(this.countPrices[0], 'price', (prices[4].price / 100))
      this.$set(this.countPrices[0], 'single', '¥' + (prices[4].price / 100) + '/次')
    },
    onActive (index) {
      this.currentIndex = index
      this.$emit('onGetFee', this.originPrices[index])
    }
  },
  async mounted () {
    const res = await getPayConfig()
    this.originPrices = res.data
    this.currentPay = res.data[0].price / 100
    // console.log('res', res)
    this.initPrice(res.data)
    this.$emit('onGetFee', this.originPrices[0])
  }
}
</script>

<style scoped lang="less">
.pay-ways {
  margin-top: -24px;
  margin-bottom: 20px;
  height: 30px;
  line-height: 32px;
  font-size: 20px;
  border-bottom: 1px solid #ccc;
  color: rgb(145, 143, 143);
  display: flex;
  justify-content: space-around;
  .active {
    border-bottom: 3px solid goldenrod;
    background-color: rgb(233, 231, 231);
  }
  .way-item {
    flex: 1;
    text-align: center;
    font-size: 16px;
  }
  .way-item:hover {
    cursor: default;
  }
}
.container {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.paycheck {
  margin-top: 10px;
  width: 180px;
  height: 60;
  box-sizing: content-box;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  .item_price {
    font-size: 30px;
    font-weight: bold;
    color: goldenrod;
  }
}
</style>