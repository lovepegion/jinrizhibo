<template>
  <div class="count-down">
    {{ number }} 秒
  </div>
</template>

<script>
export default {
  name: 'CountDown',
  data() {
    return {
      number: 120,
      countdownTimer: '',
    }
  },
  mounted() {
    this.countdownTimer = setInterval(()=>{
      this.number --
      if (this.number === 0) {
        clearInterval(this.countdownTimer)
        this.$emit('doneCountdown')
        this.number = 120
      }
    }, 1000)
  },
  beforeDestroy () {
    if (this.countdownTimer !== '') {
      clearInterval(this.countdownTimer)
      this.countdownTimer = ''
    }
  },
}
</script>

<style lang="less" scoped>
.count-down {
  color: #BBBBBB;
}
</style>