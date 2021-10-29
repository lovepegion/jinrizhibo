<template>
  <div class="commentitem">
    <!-- 0_左侧用户头像 -->
    <div class="t0_avatar">
      <img src="@/assets/image/defaultHeadCover.png" alt="">
    </div>
    <!-- 1右侧信息 -->
    <div>
      <!-- 1_1用户名 -->
      <span style="fontSize:12px;color:#6c634f">{{userName}}</span>
      <!-- 1_2评论内容 -->
      <div style="fontSize:14px;color:#221d16;margin:10px 0">{{content}}</div>
      <!-- 1_3_评论发布事件 -->
      <span style="fontSize:12px;color:#af9b7c">{{createDate}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentItem',
  props: ['userName', 'content', 'createDate']
}
</script>

<style scoped lang="less">
.commentitem {
  display: flex;
  align-items: center;
}
// 0_左侧用户头像
.t0_avatar {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 14px;
  overflow: hidden;
  img {
    width: 100%;
  }
}
</style>
