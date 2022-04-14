<template>
  <div class="price-menu">
      <div>
        <h1 class="header-title">当前充值设置：</h1>
        <div class="current-set">
          <div style="width:250px;marginBottom:10px">
            <span class="second-title">次卡：</span>
            <span style="paddingLeft:28px">1次 ¥ <span class="priceItem">{{priceMenu[4].price / 100}}</span></span>
          </div>
          <div class="month-set">
            <span class="second-title">月卡：</span>
            <span>1个月 ¥ <span class="priceItem">{{priceMenu[0].price / 100}}</span></span>
            <span>3个月 ¥ <span class="priceItem">{{priceMenu[1].price / 100}}</span></span>
            <span>6个月 ¥ <span class="priceItem">{{priceMenu[2].price / 100}}</span></span>
            <span>12个月 ¥ <span class="priceItem">{{priceMenu[3].price / 100}}</span></span>
          </div>
        </div>
      </div>
      <div>
        <p class="header-title">修改充值设置：</p>
        <div class="menu-setting">
          <div style="width:250px;marginBottom:6px">
            <span class="second-title">次卡：</span>
            <span style="paddingLeft:18px">1次 ¥ <input type="text" v-model.number="countPrice"> <button @click="onUpdatePayConfig({id:'87922cfa51ab4d4cb202d682176b229a',price:countPrice*100})">修改</button></span>
          </div>
          <div class="month-setting">
            <span class="second-title" style="lineHeight:20px">月卡：</span>
            <span>1个月 ¥ <input type="text" v-model.number="mPrice1"> <button @click="onUpdatePayConfig({id:'0bd4ee85faf44029ba5d92bbc6695da3',price:mPrice1*100})">修改</button></span>
            <span>3个月 ¥ <input type="text" v-model.number="mPrice3"> <button @click="onUpdatePayConfig({id:'56452a34f0bf4384b09ed70f99d9adce',price:mPrice3*100})">修改</button></span>
            <span>6个月 ¥ <input type="text" v-model.number="mPrice6"> <button @click="onUpdatePayConfig({id:'78361c3bb5f54c4fad78726377c9c8b7',price:mPrice6*100})">修改</button></span>
            <span>12个月 ¥ <input type="text" v-model.number="mPrice12"> <button @click="onUpdatePayConfig({id:'7fee30280f5f4f7fad274c1c89dbd9a8',price:mPrice12*100})">修改</button></span>
          </div>
        </div>
        <div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPayConfig, updatePayConfig } from '@/api/weixinpay.js'
export default {
  name: 'ChargeSetting',
  data () {
    return {
      priceMenu: [
        {price: 0},
        {price: 0},
        {price: 0},
        {price: 0},
        {price: 0}
      ],
      countPrice: '', // 单次价格
      mPrice1: '', // 1个月价格
      mPrice3: '',
      mPrice6: '',
      mPrice12: ''
    }
  },
  methods: {
    async onUpdatePayConfig ({id, price}) {
      const res = await updatePayConfig({id, price})
      if (res.data && res.data === 'ok') {
        this.$message.success('修改成功!')
        const getRes = await getPayConfig()
        this.priceMenu = getRes.data
      }
    },
  },
  async mounted () {
    const res = await getPayConfig()
    this.priceMenu = res.data
  }
}
</script>

<style scoped lang="less">
.price-menu {
  padding: 30px;
  font-size: 14px;
  text-align: left;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .priceItem {
    color: blue;
    font-size: 16px;
    font-weight: bold;
  }
  .header-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .second-title {
    font-size: 16px;
    font-weight: bold;
  }
  .current-set {
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    .month-set {
      width: 500px;
      display: flex;
      justify-content: space-between;
    }
  }
  .menu-setting {
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    input {
      width: 60px;
      padding: 3px;
      outline: none;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    .month-setting {
      margin-top: 5px;
      width: 760px;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>