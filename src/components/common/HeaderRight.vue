<template>
  <div class="common-header-right">
    <!-- plus0_侵权投诉 -->
    <div class="add-product" @click="$router.push('/warning')">
      <span class="iconfont icon-qinquan"></span><span style="marginRight: 18px; marginLeft: 4px">侵权投诉</span>
    </div>
    <div class="add-product" @click="toAddProduct">
      <a-icon type="plus-circle" /><span style="margin-left: 4px;">发布作品</span>
    </div>
    <div class="btn cert-btn" @click="toCompanyCert">
      企业认证
    </div>
    <div v-if="userInfo.token">
      <a-popover placement="bottomRight">
        <template slot="content">
          <div style="text-align: center; line-height: 30px;"><a @click="usercenter" style="color: #333;">个人中心</a></div>
          <div style="text-align: center; line-height: 30px;"><a @click="logOut" style="color: #333;">退出登录</a></div>
        </template>        
        <a-icon type="user" /><span style="margin-left: 4px;">{{ userInfo.nickname }}</span>
      </a-popover>
    </div>
    <a v-else class="btn login-btn" @click="toCompanyCert">
      登录
    </a>
  </div>
</template>

<script>
export default {
  name: 'CommonHeaderRight',
  data() {
    return {
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  methods: {
    toAddProduct() {
      this.$router.push('/product/make')
    },
    toCompanyCert() {
      if (this.userInfo && this.userInfo.checkFlag === '0') {
        this.$router.push('/company/cert')
      } else {
        this.$router.push('/usercenter?to=4&tab=2')
      }
    },
    usercenter() {
      this.$router.push('/usercenter')
    },
    logOut() {
      this.$store.commit('LOG_OUT', {})
      if (this.$route.meta.requiresAuth) {
        this.$router.push('/user/login')
      }
    },
  },
}
</script>

<style lang="less">
.common-header-right {
  display: flex;
  align-items: center;
  .add-product {
    cursor: pointer;
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
</style>