<template>
  <header class="header">
    <div class="header-content">
      <img :src="logo" alt="logo" class="header-logo" @click="toHome">
      <div class="header-right">
        <common-header-right />
      </div>
    </div>
  </header>
</template>

<script>
import CommonHeaderRight from '../common/HeaderRight.vue'
import logo from '@/assets/image/logo.png'
export default {
  name: 'Header',
  components: {
    CommonHeaderRight
  },
  data() {
    return {
      logo,
    }
  },
  methods: {
    toAddProduct() {
      this.$router.push('/product/make')
    },
    toHome() {
      this.$router.push('/')
    },
  },
}
</script>

<style lang="less">
.header {
  background: #FFFFFF;
  border-bottom: 1px solid #e8e8e8;
  // box-shadow: 0px 2px 8px 0px rgba(42, 0, 1, 0.08);
  .header-content {
    flex: 0 0 auto;
    width: 1200px;
    height: 60px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .header-logo {
      width: 141px;
      height: 44px;
      cursor: pointer;
    }
    .header-right {
      display: flex;
      align-items: center;
    }
  }
}
</style>