<template>
  <div class="item" :class="{active: active}" @click="$emit('getCurrentPay', item.price)">
    <span>{{item.time}}</span>
    <span>¥<span class="item_price">{{item.price}}</span></span>
    <span>{{item.single}}</span>
  </div>
</template>

<script>
export default {
  name: 'PayItem',
  props: {
    item: { type: Object },
    active: { type: Boolean }
  }
}
</script>

<style scoped lang="less">
.item {
  // background-color: blue;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 130px;
  height: 110px;
  color: rgb(56, 56, 56);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  .item_price {
    font-size: 30px;
    font-weight: bold;
  }
}
.item:hover {
  border-color: rgb(105, 105, 105);
  cursor: pointer;
}
.active {
  background-color: black;
  color: goldenrod;
}
</style>