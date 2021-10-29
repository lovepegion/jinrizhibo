<template>
  <div class="content-layout">
    <Header />
    <div class="layout-body">
      <router-view class="router"></router-view>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from './Header.vue'
import Footer from './Footer.vue'
export default {
  components: {
    Header,
    Footer
  },
  data() {
    return {}
  }
}
</script>

<style lang="less">
.content-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  background: #F2F2F2;
  .layout-body {
    flex: 1 0 auto;
    .router {
      max-width: 1000px;
      margin: 0 auto;
    }
  }
}
</style>