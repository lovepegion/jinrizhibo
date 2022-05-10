<template>
  <div class="charge-data">
		<a-tabs @change="tabChange" :activeKey="activeKey">
      <a-tab-pane :key="1" tab="月卡">
        <div class="my-data-head">
          <div class="avatar-box">
            <img :src="require('../../assets/image/monthcard.png')" alt="month" class="avatar">
          </div>
        </div>
        <!-- 当前设置 -->
        <div class="current-set">
          <h2 class="base-data title-color">当前设置</h2>
          <ul class="current-ul">
            <li class="current-li">
              <span><span class="li-price">{{currentPrices[0].price/100}}</span><span class="li-yuan">元</span></span>
              <span class="li-month">1月卡</span>
            </li>
            <li class="current-li">
              <span><span class="li-price">{{currentPrices[1].price/100}}</span><span class="li-yuan">元</span></span>
              <span class="li-month">3月卡</span>
            </li>
            <li class="current-li">
              <span><span class="li-price">{{currentPrices[2].price/100}}</span><span class="li-yuan">元</span></span>
              <span class="li-month">6月卡</span>
            </li>
           <li class="current-li">
              <span><span class="li-price">{{currentPrices[3].price/100}}</span><span class="li-yuan">元</span></span>
              <span class="li-month">12月卡</span>
            </li>
          </ul>
        </div>
        
        <!-- 修改设置 -->
        <h2 class="base-data" style="marginBottom:10px">修改设置</h2>
        <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" labelAlign="left">
          <a-form-model-item label="1月卡">
            <div style="display:flex">
              <a-input v-model="form.mPrice1" />
              <a-button type="primary" style="borderRadius:10px;marginLeft:10px" @click="onUpdatePayConfig({id:'0bd4ee85faf44029ba5d92bbc6695da3',price:form.mPrice1,index:0})">修改</a-button>
            </div>
          </a-form-model-item>
          <a-form-model-item label="3月卡">
            <div style="display:flex">
              <a-input v-model="form.mPrice3" />
              <a-button type="primary" style="borderRadius:10px;marginLeft:10px" @click="onUpdatePayConfig({id:'56452a34f0bf4384b09ed70f99d9adce',price:form.mPrice3,index:1})">修改</a-button>
            </div>
          </a-form-model-item>
          <a-form-model-item label="6月卡">
            <div style="display:flex">
              <a-input v-model="form.mPrice6" />
              <a-button type="primary" style="borderRadius:10px;marginLeft:10px" @click="onUpdatePayConfig({id:'78361c3bb5f54c4fad78726377c9c8b7',price:form.mPrice6,index:2})">修改</a-button>
            </div>
          </a-form-model-item>
          <a-form-model-item label="12月卡">
            <div style="display:flex">
              <a-input v-model="form.mPrice12" />
              <a-button type="primary" style="borderRadius:10px;marginLeft:10px" @click="onUpdatePayConfig({id:'7fee30280f5f4f7fad274c1c89dbd9a8',price:form.mPrice12,index:3})">修改</a-button>
            </div>
          </a-form-model-item>
        </a-form-model>
      </a-tab-pane>
      <a-tab-pane :key="2" tab="次卡">
        <div class="my-data-head">
          <div class="avatar-box">
            <img :src="require('../../assets/image/count.png')" alt="count" class="avatar">
          </div>
        </div>
        <!-- 当前设置 -->
        <div class="current-set">
          <h2 class="base-data">当前设置</h2>
          <ul class="current-ul">
            <li class="current-li">
              <span><span class="li-price">{{currentPrices[4].price/100}}</span><span class="li-yuan">元</span></span>
              <span class="li-month">1次</span>
            </li>
          </ul>
        </div>
        
        <!-- 修改设置 -->
        <h2 class="base-data" style="marginBottom:10px">修改设置</h2>
        <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" labelAlign="left">
          <a-form-model-item label="1次">
            <div style="display:flex">
              <a-input v-model="form.countPrice" />
              <a-button type="primary" style="borderRadius:10px;marginLeft:10px" @click="onUpdatePayConfig({id:'87922cfa51ab4d4cb202d682176b229a',price:form.countPrice,index:4})">修改</a-button>
            </div>
          </a-form-model-item>
        </a-form-model>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { getPayConfig, updatePayConfig } from '@/api/weixinpay.js'
export default {
  name: 'ChargeSetting',
  data() {
    return {
      activeKey: 1,
      labelCol: { span: 3 },
      wrapperCol: { span: 12 },
      currentPrices: [
        {price: '0'},
        {price: '0'},
        {price: '0'},
        {price: '0'},
        {price: '0'}
      ],
      form: {
        countPrice: '',
        mPrice1: '',
        mPrice3: '',
        mPrice6: '',
        mPrice12: ''
      }
    }
  },
  methods: {
    tabChange(key) {
      this.activeKey = key
    },
    async onUpdatePayConfig ({id, price, index}) {
      const res = await updatePayConfig({id, price: (price*100).toFixed()})
      const originPrice = this.currentPrices[index].price
      this.$set(this.currentPrices[index], 'price', price*100)
      if (res.data && res.data === 'ok') {
        this.$message.success('修改成功!')
        const getRes = await getPayConfig()
        this.currentPrices = getRes.data
      } else this.$set(this.currentPrices[index], 'price', originPrice)
    }
  },
  async mounted () {
    const res = await getPayConfig()
    this.currentPrices = res.data
  }
}
</script>

<style scoped lang="less">
.charge-data {
  max-width: 966px;
  box-sizing: content-box;
  padding: 30px;
  text-align: left;
  /deep/ .ant-form-item-label > label {
    color: #999;
  }
  .current-set {
    width: 700px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .current-ul {
      width: 600px;
      display: flex;
      justify-content: space-between;
      .current-li {
        width: 120px;
        height: 80px;
        background-color: rgb(214, 240, 250);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .li-yuan {
          color: rgb(77, 197, 245);
          font-size: 18px;
        }
        .li-price {
          font-size: 30px;
          font-weight: bold;
          color: rgb(6, 177, 245);
        }
        .li-month {
          font-size: 16px;
          color: rgb(122, 120, 120);
        }
      }
    }
  }
  .my-data-head {
    padding-top: 15px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .avatar-box {
      width: 126px;
      height: 126px;
      position: relative;
      .avatar {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        background-size: cover;
        background-color: #eee;
      }
    }
  }
  .base-data {
    color: #999;
    font-size: 16px;
    height: 50px;
    line-height: 80px;
    font-weight: 600;
  }
  .ant-form-item-label {
    font-weight: normal;
  }
  .modify-item {
    font-size: 16px;
  }
}
</style>