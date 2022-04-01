<template>
  <div class="scrutinyitem">
    <div v-if="item.coverUrl && item.coverUrl.length < 3" class="item-card1">
      <!-- 3_1_1左侧封面 -->
      <div class="item-image-container">
        <!-- <div class="item-image" alt="cover" :style="{backgroundImage: 'url(' + '/webfile' + item.coverUrl[0] + ')'}" /> -->
        <div class="item-image" alt="cover">
          <a :href="playbase + item.id" target="_blank"><img :src="'/webfile' + item.coverUrl[0]"></a>
        </div>
        <i class="inner-play"></i>
      </div>
      <!-- 3_1_2右侧内容 -->
      <div class="item-content">
        <!-- 312a大标题 -->
        <div class="item-content-title" :title="item.title">{{ item.title }}</div>
        <!-- 312b中间label -->
        <div class="item-content-info">
          <span v-if="item.topDate" style="margin-right: 20px; color: #E4373A;">置顶</span>
          <span style="margin-right: 20px;">{{ item.nickname }}</span>
          <span>{{ item.createDate }}</span>
          <!--312b_1_阅读数量和点击数量 -->
          <div class="t311b_1_wrap">
            <!-- 312b_1_1阅读数量 -->
            <!-- <div class="just_flex">
              <span class="iconfont icon-yuedu"><span class="t312b_1_com_number">阅读</span></span>
              <span class="t312b_1_com_number">50</span>
            </div> -->
            <!-- 312b_1_1_2点击数量 -->
            <div class="common_flex">
              <!-- <span class="iconfont icon-dianji"><span class="t312b_1_com_number">点击</span></span> -->
              <span class="t312b_1_com_number">点击</span>
              <span class="t312b_1_com_number">{{item.clicks}}</span>
            </div>
            <!-- 312b_1_1_3关注 -->
            <!-- <div class="common_flex">
              <span class="t312b_1_com_number">关注</span>
              <span class="t312b_1_com_number">{{item.follow}}</span>
            </div> -->
            <!-- 312b_1_1_4收藏 -->
            <div class="common_flex">
              <!-- <span class="iconfont icon-shoucangxiao"><span class="t312b_1_com_number">收藏</span></span> -->
              <span class="t312b_1_com_number">收藏</span>
              <span class="t312b_1_com_number">{{item.collect}}</span>
            </div>
            <!-- 312b_1_1_5点赞 -->
            <div class="common_flex">
              <!-- <span class="iconfont icon-dianzan"><span class="t312b_1_com_number">点赞</span></span> -->
              <span class="t312b_1_com_number">点赞</span>
              <span class="t312b_1_com_number">{{item.like}}</span>
            </div>
            <!-- 312b_1_1_6评论 -->
            <!-- <div class="common_flex" @click="comment++">
              <span class="iconfont icon-pinglun"><span class="t312b_1_com_number">评论</span></span>
              <span class="t312b_1_com_number">{{comment}}</span>
            </div> -->
          </div>
        </div>
        <!-- 313c下载和分享 -->
        <!-- <div class="t313c_wrap">
          <span class="iconfont icon-xiazai" @click="downVideo(item.videoUrl)">下载</span>
          <span class="iconfont icon-fenxiang t313c_share">分享</span>
          <div class="t313c_1_wrap">
            <Share :videoUrl="item.videoUrl" :title="item.title" :videoId="item.id"></Share>
          </div>
        </div> -->
        <!-- 314上下架 -->
        <div class="t314_wrap">
          <div class="t314a_status">
            <b>状态：</b>
            <span v-if="status==='1'" class="t314a_status_item" style="backgroundColor: #37a100;">已上架</span>
            <span v-if="status==='2'" class="t314a_status_item" style="backgroundColor: #649af0;">待审核</span>
            <span v-if="status==='3'" class="t314a_status_item" style="backgroundColor: #fe0002;">已下架</span>
            <span v-if="isRecommended" class="t314a_status_item" style="backgroundColor:#37a100;marginLeft:5px">已推荐</span>
            <span v-else class="t314a_status_item" style="backgroundColor:coral;marginLeft:5px">未推荐</span>
            <span v-if="isTopped" class="t314a_status_item" style="backgroundColor:#37a100;marginLeft:5px">已置顶</span>
            <span v-else class="t314a_status_item" style="backgroundColor:coral;marginLeft:5px">未置顶</span>
          </div>
          <button @click="onUpshelf" v-if="status==='3'" class="cursorItem">
          <span class="iconfont icon-xiangshang4"></span>上架
          </button>
          <button @click="onDownshelf" v-if="status==='1'" class="cursorItem">
          <span class="iconfont icon-xiangxia4"></span>下架
          </button>
          <button v-if="isRecommended" class="cursorItem" @click="onUpdateRecommend(item.id, 0)">取消推荐</button>
          <button v-else class="cursorItem" @click="onUpdateRecommend(item.id, 1)">开启推荐</button>
          <button v-if="isTopped" class="cursorItem" @click="onUpdateTop(0)">取消置顶</button>
          <button v-else class="cursorItem" @click="onUpdateTop(1)">开启置顶</button>
          <!-- plus视频插入进度显示 -->
          <div class="plus_updating">
            <a-button type="primary" :loading="updating" v-if="updating">{{ '操作中,稍后...' }}</a-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="item-card2">
      <div class="item-content-title">{{ item.title }}</div>
      <div v-if="item.coverUrl && (item.coverUrl.length === 3 || item.coverUrl.length === 4)" class="item-images">
        <!-- <div class="item-image" alt="cover" :style="{backgroundImage: 'url(' + '/webfile' + item.coverUrl[0] + ')'}" />
        <div class="item-image" alt="cover" :style="{backgroundImage: 'url(' + '/webfile' + item.coverUrl[1] + ')'}" />
        <div class="item-image" alt="cover" :style="{backgroundImage: 'url(' + '/webfile' + item.coverUrl[2] + ')'}" /> -->
        <a :href="playbase + item.id" target="_blank"><img :src="'/webfile' + item.coverUrl[0]"></a>
        <a :href="playbase + item.id" target="_blank"><img :src="'/webfile' + item.coverUrl[1]"></a>
        <a :href="playbase + item.id" target="_blank"><img :src="'/webfile' + item.coverUrl[2]"></a>
      </div>
      <div class="item-content-info">
        <span style="margin-right: 20px;">{{ item.nickname }}</span>
        <span>{{ item.createDate }}</span>
        <!--312b_1_阅读数量和点击数量 -->
        <div class="t311b_1_wrap">
          <!-- 312b_1_1阅读数量 -->
          <!-- <div class="just_flex">
            <span class="iconfont icon-yuedu"><span class="t312b_1_com_number">阅读</span></span>
            <span class="t312b_1_com_number">50</span>
          </div> -->
          <!-- 312b_1_1_2点击数量 -->
          <div class="common_flex">
            <!-- <span class="iconfont icon-dianji"><span class="t312b_1_com_number">点击</span></span> -->
            <span class="t312b_1_com_number">点击</span>
            <span class="t312b_1_com_number">{{item.clicks}}</span>
          </div>
          <!-- 312b_1_1_3关注 -->
          <!-- <div class="common_flex">
            <span class="t312b_1_com_number">关注</span>
            <span class="t312b_1_com_number">{{item.follow}}</span>
          </div> -->
          <!-- 312b_1_1_4收藏 -->
          <div class="common_flex">
            <!-- <span class="iconfont icon-shoucangxiao"><span class="t312b_1_com_number">收藏</span></span> -->
            <span class="t312b_1_com_number">收藏</span>
            <span class="t312b_1_com_number">{{item.collect}}</span>
          </div>
          <!-- 312b_1_1_5点赞 -->
          <div class="common_flex">
            <!-- <span class="iconfont icon-dianzan"><span class="t312b_1_com_number">点赞</span></span> -->
            <span class="t312b_1_com_number">点赞</span>
            <span class="t312b_1_com_number">{{item.like}}</span>
          </div>
          <!-- 312b_1_1_6评论 -->
          <!-- <div class="common_flex" @click="comment++">
            <span class="iconfont icon-pinglun"><span class="t312b_1_com_number">评论</span></span>
            <span class="t312b_1_com_number">{{comment}}</span>
          </div> -->
        </div>
        <!-- 314上下架 -->
        <div class="t314_wrap">
          <div class="t314a_status">
            <b>状态：</b>
            <span v-if="status==='1'" class="t314a_status_item" style="backgroundColor: #37a100;">已上架</span>
            <span v-if="status==='2'" class="t314a_status_item" style="backgroundColor: #649af0;">待审核</span>
            <span v-if="status==='3'" class="t314a_status_item" style="backgroundColor: #fe0002;">已下架</span>
            <span v-if="isRecommended" class="t314a_status_item" style="backgroundColor:#37a100;marginLeft:5px">已推荐</span>
            <span v-else class="t314a_status_item" style="backgroundColor:coral;marginLeft:5px">未推荐</span>
            <span v-if="isTopped" class="t314a_status_item" style="backgroundColor:#37a100;marginLeft:5px">已置顶</span>
            <span v-else class="t314a_status_item" style="backgroundColor:coral;marginLeft:5px">未置顶</span>
          </div>
          <button @click="onUpshelf" :disabled="status==='1'" class="cursorItem">
          <span class="iconfont icon-xiangshang4"></span>上架
          </button>
          <button @click="onDownshelf" :disabled="status==='3'" class="cursorItem">
          <span class="iconfont icon-xiangxia4"></span>下架
          </button>
          <button v-if="isRecommended" class="cursorItem" @click="onUpdateRecommend(item.id, 0)">取消推荐</button>
          <button v-else class="cursorItem" @click="onUpdateRecommend(item.id, 1)">开启推荐</button>
          <button v-if="isTopped" class="cursorItem" @click="onUpdateTop(0)">取消置顶</button>
          <button v-else class="cursorItem" @click="onUpdateTop(1)">开启置顶</button>
          <!-- plus视频插入进度显示 -->
          <div class="plus_updating">
            <a-button type="primary" :loading="updating" v-if="updating">{{ '操作中,稍后...' }}</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { videoPlayUrl } from '@/api/visit_base_url.js'
import { upShelf, downShelf, updateRecommend, updateTopProduct } from '@/api/update.js'
export default {
  name: 'ScrutinyItem',
  props: ['item'],
  data () {
    return {
      isTopped: false, // 是否置顶
      playbase: videoPlayUrl, // 线上播放基准地址
      status: '1', // 上下架状态
      updating: false, // 上下架操作状态
      isRecommended: false // 是否已推荐
    }
  },
  methods: {
    //置顶或取消置顶
    async onUpdateTop (status) {
      this.isTopped = !this.isTopped
      const res = await updateTopProduct(this.item.id, status)
      if (res.message && res.message.message === 'success') return
      else this.isTopped = !this.isTopped
    },
    async onUpdateRecommend (id, status) {
      this.isRecommended = !this.isRecommended
      const res = await updateRecommend(id, status)
      if (res.message && res.message.status === 200) {
        return
      } else this.isRecommended = !this.isRecommended
    },
    // 上架产品
    async onUpshelf () {
      this.updating = true
      const res = await upShelf(this.item.id)
      if (res.data === 'success') {
        this.status = '1'
        this.updating = false
      }
    },
    // 下架产品
    async onDownshelf () {
      this.updating = true
      const res = await downShelf(this.item.id)
      if (res.data === 'success') {
        this.status = '3'
        this.updating = false
      }
    }
  },
  mounted () {
    this.status = this.item.status
    this.isRecommended = this.item.recommend
    this.isTopped = this.item.topDate
  }
}
</script>

<style scoped lang="less">
.scrutinyitem {
  .item-content-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 32px;
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  letter-spacing: 0;
  word-break: break-all;
  -webkit-box-orient: vertical;
  line-height: 20px;
  }
  .item-image {
    width: 281px;
    height: 161px;
    border-radius: 6px;
    background: #000 no-repeat 50%;
    background-size: cover;
    transition: all .5s ease-out .1s;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .item-content-info {
    color: #999999;
    font-size: 12px;
    display: flex;
    align-items: flex-end;
  }
  .item-card1 {
    display: flex;
    width: 100%;
    margin-bottom: 30px;
    // 3_1_2右侧内容
    // 312b中间label
    .t311b_1_wrap {
      display: flex;
      font-size: 16px;
      .just_flex {
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        span {
          margin-top: 3px;
        }
      }
      .common_flex {
        margin-left: 20px;
        transition: 0.5s;
        span {
          margin-top: 3px;
        }
      }
      .common_flex:hover {
        cursor: default;
      }
    }
    // 312b_1_阅读数量和点击数量
    .t312b_1_com_number { // 点赞评论等下发的数字
      font-size: 12px;
      margin: 0 2px;
    }
    // 313c下载和分享
    .t313c_wrap {
      color: #999999;
      margin-top: 40px;
      span {
        cursor: pointer;
        margin-right: 10px;
      }
      // 313c_1分享弹窗
      .t313c_1_wrap {
        width: 450px;
        height: 120px;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.5);
        background-color: #2a2a32;
        transform-origin: top left;
        transform: scale(0);
        transition: 0.2s;
        position: absolute;
        z-index: 2;
        top: 113px;
        left: 130px;
      }
      .t313c_share:hover ~ .t313c_1_wrap {
        transform: scale(1);
      }
      .t313c_1_wrap:hover {
        transform: scale(1);
      }
    }
    // 314下架和上架
    .t314_wrap {
      display: flex;
      align-items: center;
      color: #999999;
      margin-top: 40px;
      position: relative;
      .plus_updating { // 操作进度显示
        position: absolute;
        bottom: 0;
        right: -150px;
      }
      .t314a_status {
        margin-right: 40px;
        .t314a_status_item { // 状态的每一项
          padding: 5px;
          color: #FFFFFF;
          border-radius: 5px;
        }
      }
      .cursorItem {
        cursor: pointer;
        margin-right: 20px;
      }
    }
    .item-image-container {
      position: relative;
    }
    .item-image {
      cursor: pointer;
      width: 281px;
      height: 161px;
      border-radius: 6px;
      background: #000 no-repeat 50%;
      background-size: cover;
      transition: all .5s ease-out .1s;
    }
    .item-content {
      flex: 1;
      margin-left: 20px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }
  }
  .item-card2 {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 30px;
    cursor: pointer;
    // 312b中间label
    .t311b_1_wrap {
      display: flex;
      font-size: 14px;
      .just_flex {
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        span {
          margin-top: 3px;
        }
      }
      .common_flex {
        margin-left: 20px;
        transition: 0.5s;
        span {
          margin-top: 3px;
        }
      }
      .common_flex:hover {
        cursor: default;
      }
    }
    .item-images {
      display: flex;
      margin-bottom: 20px;
      img {
        margin-right: 10px;
        width: 258px;
        height: 170px;
        border-radius: 5px;
      }
    }
    // 314下架和上架
    .t314_wrap {
      font-size: 16px;
      display: flex;
      align-items: center;
      color: #999999;
      margin-top: 40px;
      margin-left: 30px;
      position: relative;
      .plus_updating { // 操作进度显示
        position: absolute;
        bottom: 0;
        right: -150px;
      }
      .t314a_status {
        margin-right: 40px;
        .t314a_status_item { // 状态的每一项
          padding: 5px;
          color: #FFFFFF;
          border-radius: 5px;
        }
      }
      .cursorItem {
        cursor: pointer;
        margin-right: 20px;
      }
    }
  }
  .inner-play {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 40px;
    height: 40px;
    background: url('../../../assets/icon/play.png');
    background-size: contain;
  }
}
</style>
