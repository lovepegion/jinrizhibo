<template>
  <div>
    <div class="common-header-right">
      <div v-if="!isPhone && !$store.state.userInfo.company" class="add-product" @click="checkPay=true">
        <a-icon type="pay-circle" /><span style="marginLeft:4px;color:goldenrod">我要充值</span>
      </div>
      <div v-if="!isPhone" class="add-product" @click="toWarning">
        <span class="iconfont icon-qinquan"></span><span style="marginLeft: 4px">侵权投诉</span>
      </div>
      <div v-if="!isPhone" class="add-product" @click="toAddProduct">
        <a-icon type="plus-circle" /><span style="marginLeft: 4px;">发布作品</span>
      </div>
      <div v-if="!isPhone" class="add-product" @click="toAlbumMake">
        <a-icon type="plus-circle" /><span style="margin:0 4px;">专辑制作</span>
      </div>
      <!-- <div v-if="!isPhone" class="btn cert-btn" @click="toCompanyCert">
        单位认证
      </div> -->
      <div v-if="userInfo.token">
        <a-popover placement="bottomRight">
          <template slot="content">
            <div style="text-align: center; line-height: 30px;"><a @click="usercenter" style="color: #333;">用户中心</a></div>
            <div style="text-align: center; line-height: 30px;"><a @click="logOut" style="color: #333;">退出登录</a></div>
          </template>        
          <a-icon type="user" /><span style="margin-left: 4px;">{{ userInfo.nickname }}</span>
        </a-popover>
      </div>
      <a v-else class="btn login-btn" @click="toCompanyCert">
        登录
      </a>
    </div>
    <a-modal
      title="普通用户只能免费发布2次，请选择充值选项"
      destroyOnClose
      :visible="checkPay"
      :maskClosable="false"
      :ok-button-props="{props:{disabled:isDisabled}}"
      width="600px"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirm-loading="confirmLoading"
    >
      <WeixinPay v-if="pricesShow" @onGetFee="feeMenu=$event"></WeixinPay>
      <div v-show="boxShow" style="paddingLeft:190px">
        <div id="qrcode" ref="qrcode" style="paddingLeft:190"></div>
        <p style="paddingLeft:15px">扫描二维码支付 ¥ {{feeMenu.price / 100}}</p>
      </div>
      <div v-if="succeedShow" class="succeed-show">
        <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" style="fontSize:40px;marginRight:10px" />
        <span>支付成功, 即将跳转... ...</span>
      </div>
      <div v-if="wrongShow" class="succeed-show">
        <a-icon type="close-circle" theme="twoTone" two-tone-color="red" style="fontSize:40px;marginRight:10px" />
        <span class="succeedShow">支付失败, 请稍后重试！</span>
      </div>
    </a-modal>
  </div>
</template>

<script>
import WeixinPay from '@/components/weixinpay/WeixinPay.vue'
import QRCode from 'qrcodejs2'
import { setItem, getItem } from '@/utils/cache.js'
import { mapMutations } from 'vuex'
import { wxCharge, getPayRechargeByOutTradeNo } from '@/api/weixinpay.js'
import { getUserInfo } from '@/api/user.js'
export default {
  name: 'CommonHeaderRight',
  components: { WeixinPay },
  data () {
    return {
      isDisabled: false, // model中按钮是否禁用
      feeMenu: {}, //支付价格
      checkPay: false, //充值弹框
      pricesShow: true, //默认显示价格菜单
      boxShow: false, //显示二维码控制
      succeedShow: false, //支付成功
      wrongShow: false, //支付出错
      publishedCount: 3, //模拟已经发布的作品数量
      confirmLoading: false, //模拟
      pathname: '',
      isPhone: false
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  methods: {
    ...mapMutations({ setUserInfo: 'SET_USERINFO' }),
    toWarning () {
      let routeData = this.$router.resolve({path: '/warning'})
      window.open(routeData.href, '_blank')
    },
    toAddProduct() {
      const userInfo = getItem('userInfo')
      //判断会员是否过期
      if (userInfo.company) {
        // this.$router.push('/product/make')
        let routeData = this.$router.resolve({path: '/product/make'})
        window.open(routeData.href, '_blank')
        return
      } else if (userInfo.memberExpire) {
        const d = new Date()
        const dateNow = d.getTime()
        const isExpired = dateNow > userInfo.memberExpire
        // console.log('isExpired', isExpired)
        if (!isExpired || userInfo.publishTime > 0) {
          // this.$router.push('/product/make')
          setItem('toMakepage', 'makepage')
          let routeData = this.$router.resolve({path: '/product/make'})
          window.open(routeData.href, '_blank')
          return
        }
      } else if (userInfo.publishTime > 0) {
        // this.$router.push('/product/make')
        setItem('toMakepage', 'makepage')
        let routeData = this.$router.resolve({path: '/product/make'})
        window.open(routeData.href, '_blank')
        return
      }
      this.checkPay = true
    },
    toAlbumMake () {
      const userInfo = getItem('userInfo')
      if (userInfo.id && !userInfo.company) this.$info({title: '非企业用户不能发布专辑！'})
      else {
        let routeData = this.$router.resolve({path: '/product/albummake'})
        window.open(routeData.href, '_blank')
      }
    },
    toCompanyCert() {
      if (this.$store.state.userInfo && this.$store.state.userInfo.checkFlag === '0') {
        // this.$router.push('/company/cert')
        let routeData = this.$router.resolve({path: '/company/cert'})
        window.open(routeData.href, '_blank')
      } else {
        // this.$router.push('/usercenter?to=4&tab=2')
        // this.$router.push('/user/login?pathname='+this.pathname)
        let routeData = this.$router.resolve({path: '/user/login?pathname='+this.pathname})
        window.open(routeData.href, '_blank')
      }
    },
    usercenter() {
      // this.$router.push('/usercenter')
      let routeData = this.$router.resolve({path: '/usercenter'})
      window.open(routeData.href, '_blank')
    },
    logOut() {
      this.$store.commit('LOG_OUT', {})
      if (this.$route.meta.requiresAuth) {
        this.$router.push('/user/login')
      }
    },
    async handleOk(e) {
      setItem('toMakepage', '')
      this.confirmLoading = true;
      // console.log('feeMenu', this.feeMenu)
      const res = await wxCharge({userId: this.userInfo.id, payId: this.feeMenu.id})
      // console.log('weixinpayres', res)
      if (res.message && res.message.message && res.message.message === 'success') {
        this.boxShow = true
        this.pricesShow = false
        this.confirmLoading = false;
        this.isDisabled = true
        new QRCode(this.$refs.qrcode, {
          width: 170,                     //二维码的宽度
          height: 170,                    //二维码的高度
          textAlign: 'center',
          text:res.data['code_url'],     //需要生成二维码的支付链接
          colorDark: '#000',              //二维码颜色
          colorLight: '#fff',             //二维码底色
        })
        this.getOrderstate(res.data['out_trade_no'])
      }
      else {
        this.$message.error('获取订单失败，请稍后再试')
        this.confirmLoading = false
      }
    },
    closeBoxShowPrices () {
      this.boxShow = false
      this.pricesShow = true
      this.isDisabled = false
      if (this.timer) clearInterval(this.timer)
      this.confirmLoading = false
      const qrcode = this.$refs.qrcode
      // console.log('children', qrcode.children)
      qrcode.removeChild(qrcode.children[1])
    },
    closeBoxShowWrong () {
      this.boxShow = false
      this.wrongShow = true
      if (this.timer) clearInterval(this.timer)
      const qrcode = this.$refs.qrcode
      // console.log('children', qrcode.children)
      qrcode.removeChild(qrcode.children[1])
    },
    closeBoxShowSuccess () {
      this.boxShow = false
      this.succeedShow = true
      if (this.timer) clearInterval(this.timer)
      const qrcode = this.$refs.qrcode
      // console.log('children', qrcode.children)
      qrcode.removeChild(qrcode.children[1])
    },
    handleCancel(e) {
      setItem('toMakepage', '')
      // console.log('Clicked cancel button');
      if (this.timer) clearInterval(this.timer)
      if (this.boxShow) {
        this.closeBoxShowPrices()
        return
      }
      if (this.wrongShow) {
        this.wrongShow = false
        this.pricesShow = true
        return
      }
      this.checkPay = false;
    },
    getOrderstate (outTradeNo) {
      let num = 0
      this.timer = setInterval(() => {
        num ++
        getPayRechargeByOutTradeNo(outTradeNo).then(res => {
          // console.log('checkpayres', res)
          if (res.data && res.data.payStatus === 'YZF') {
            this.closeBoxShowSuccess()
            getUserInfo().then(userres => this.setUserInfo({...this.$store.state.userInfo, ...userres.data}))
            setTimeout(() => {
              this.succeedShow = false
              this.pricesShow = true
              this.checkPay = false
              return
            }, 3000)
          } else if (res.data && res.data.payStatus === 'DFK') return 
            else this.closeBoxShowWrong()
        }).catch(error => this.closeBoxShowWrong())
      }, 1500)
      if (num === 500) {
        this.closeBoxShowPrices()
      }
    },
    checkPayShow () {
      if (getItem('toMakepage') === 'makepage' && this.$store.state.userInfo.publishTime <= 2 && !(this.$store.state.userInfo.company)) this.checkPay = true
    }
  },
  mounted () {
    this.checkPayShow()
    this.pathname = encodeURIComponent(window.location.pathname)
    if (window.innerWidth < 700) {
      this.isPhone = true
    }
  }
}
</script>

<style lang="less">
.succeed-show {
  font-size: 25px;
  text-align: center;
}
.common-header-right {
  position: relative;
  display: flex;
  align-items: center;
  .add-product {
    cursor: pointer;
    margin-left: 10px;
  }
  .btn {
    border: 1px solid #EEEEEE;
    cursor: pointer;
    border-radius: 18px;
    padding: 4px 20px;
  }
  .cert-btn {
    margin: 0 20px;
  }
  .login-btn {
    background: #EEEEEE;
  }
}
// plus0_2侵权警告
.plus0_2_warn {
  position: absolute;
  font-size: 12px;
}
// plus_1_天气预报
/* .plus1_bordcast {
  position: absolute;
  top: 0;
  left: -280px;
} */
</style>