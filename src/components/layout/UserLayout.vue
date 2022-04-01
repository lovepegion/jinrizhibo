<template>
  <div class="user-layout">
    <h1 class="user-layout-header">
      <img :src="logo" alt="logo" class="header-logo" @click="toHome">
    </h1>
    <div class="user-layout-body">
      <router-view class="router"></router-view>
    </div>
  </div>
</template>

<script>
import logo from '@/assets/image/logo.png'
export default {
  data() {
    return {
      isPhone: false,
      logo,
    }
  },
  methods: {
    toHome() {
      this.$router.push('/')
    }
  },
  mounted () {
    if (window.innerWidth < 700) {
      this.isPhone = true
    }
  }
}
</script>

<style scoped lang="less">
.user-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: url('../../assets/image/logo-bak.png');
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: 100% 240px;
  overflow: auto;
  .user-layout-header {
    padding: 56px 15% 80px;
    text-align: left;
    .header-logo {
      width: 210px;
      height: 64px;
      cursor: pointer;
    }
  }
  .user-layout-body {
    width: 100%;
    height: 100%;
  }
}
</style>