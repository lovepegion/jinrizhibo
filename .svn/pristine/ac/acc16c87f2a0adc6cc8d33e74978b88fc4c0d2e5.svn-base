<template>
  <div class="usercenter-product">
    <ul class="list">
      <li class="item" v-for="item in list" :key="item.id">
        <div v-if="item.coverUrl && item.coverUrl.length === 1" class="item-card1">
          <!-- 通过审核 -->
          <div v-if="item.status==='1'" class="item-image-container imgcursor"  @click="toDetail(item.id)">
            <div class="item-image" alt="cover" :style="{backgroundImage: 'url(' + '/webfile' + item.coverUrl[0] + ')'}" />
            <i class="inner-play"></i>
          </div>
          <!-- 待审核 -->
          <div v-if="item.status==='3'" class="item-image-container">
            <div class="item-image" alt="cover" :style="{backgroundImage: 'url(' + '/webfile' + item.coverUrl[0] + ')'}" />
            <i class="inner-play"></i>
            <div class="item-image waitingcheck_wrap">已下架,请联系管理员...</div>
          </div>
          <!-- 右侧内容 -->
          <div class="item-content">
            <div class="item-content-title" :title="item.title">{{ item.title }}</div>
            <div class="item-content-info">
              <span style="margin-right: 20px;">{{ item.nickname }}</span>
              <span>{{ item.createDate }}</span>
              <!-- plus0_delete -->
              <button class="plus0_delete" @click="onDel(item.id)">删除视频</button>
            </div>
          </div>
        </div>
        <div v-else class="item-card2">
          <div class="item-content-title">{{ item.title }}</div>
          <div v-if="item.coverUrl && item.coverUrl.length === 3" class="item-images">
            <div @click="toDetail(item.id)" class="item-image" alt="cover" :style="{backgroundImage: 'url(' + '/webfile' + item.coverUrl[0] + ')'}" />
            <div @click="toDetail(item.id)" class="item-image" alt="cover" :style="{backgroundImage: 'url(' + '/webfile' + item.coverUrl[1] + ')'}" />
            <div @click="toDetail(item.id)" class="item-image" alt="cover" :style="{backgroundImage: 'url(' + '/webfile' + item.coverUrl[2] + ')'}" />
          </div>
          <div class="item-content-info">
            <span style="margin-right: 20px;">{{ item.nickname }}</span>
            <span>{{ item.createDate }}</span>
            <!-- plus0_delete -->
            <button class="plus0_delete" @click="onDel(item.id)">删除视频</button>
          </div>
        </div>
      </li>
      <a-empty class="list-empty" v-if="list.length === 0" />
    </ul>
    <div class="pagination">
      <a-pagination v-model="pageNumber" :total="total" @change="onPageChange" :pageSize="pageSize" />
    </div>
  </div>
</template>

<script>
import { getProductByUserId, getProductByCollectionUserId } from '@/api/make'
import { deleteWork } from '@/api/update.js'
export default {
  props: {
    mode: { // 0：用户作品，1：收藏作品
      type: Number,
      default: 0
    }
  },
	data() {
		return {
			list: [],	//	作品列表
			pageNumber: 1,
      pageSize: 4,
      total: 0,
		}
	},
	mounted() {
    this.fetchData()
	},
  watch: {
    mode: function() {
      this.pageNumber = 1
      this.total = 0
      this.fetchData()
    }
  },
	methods: {
    fetchData() {
      if (this.mode === 0) {
        this._getProductByUserId()
      } else {
        this._getProductByCollectionUserId()
      }
    },
    //  跳转详情
    toDetail(id) {
      this.$router.push(`/product/detail/${id}`)
    },
    onPageChange(pageNumber) {
      this.pageNumber = pageNumber
      this.fetchData()
    },
		//  获取用户作品列表
    _getProductByUserId() {
      const params = {
        userId: this.$store.state.userInfo.id,
				type: 1,
				pageNumber: this.pageNumber,
				pageSize: this.pageSize,
      }
      getProductByUserId(params).then(res => {
        if (res.message && res.message.code === 0) {
          this.list = res.data.list
          this.total = res.data.total
          console.log('自己的作品', this.list)
        }
      })
    },
		_getProductByCollectionUserId() {
      const params = {
        userId: this.$store.state.userInfo.id,
				pageNumber: this.pageNumber,
				pageSize: this.pageSize,
      }
      getProductByCollectionUserId(params).then(res => {
        if (res.message && res.message.code === 0) {
          this.list = res.data.list
          this.total = res.data.total
        }
      })
    },
    // 删除视频
    async onDel (id) {
      let check = confirm("确认删除该视频吗？")
      if (check) {
        await deleteWork (id)
        location.reload()
      }
      return
    }
	},
}
</script>

<style lang="less">
.usercenter-product {
  padding: 20px;
  .list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    .item {
      width: 100%;
      display: flex;
      border-bottom: 1px solid #EEEEEE;
      margin-bottom: 21px;
      cursor: default;
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
        width: 196px;
        height: 112px;
        border-radius: 6px;
        background: #000 no-repeat 50%;
        background-size: cover;
        transition: all .5s ease-out .1s;
      }
      .item-content-info {
        color: #999999;
        font-size: 12px;
      }
      .item-card1 {
        display: flex;
        width: 100%;
        margin-bottom: 30px;
        .imgcursor { // 审核通过的图片才显示可以点击
          cursor: pointer;
        }
        .item-image-container {
          position: relative;
          .waitingcheck_wrap { // 待审核遮罩层
            background-color: rgba(0, 0, 0, 0.5);
            line-height: 160px;
            color: #fff;
            position: absolute;
            top: 0;
            left: 0;
          }
        }
        .item-image {
          width: 281px;
          height: 161px;
          border-radius: 6px;
          background: #000 no-repeat 50%;
          background-size: cover;
          transition: all .5s ease-out .1s;
        }
        .item-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          margin-left: 20px;
        }
      }
      .item-card2 {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        margin-bottom: 30px;
        cursor: pointer;
        .item-images {
          display: flex;
          margin-bottom: 20px;
          .item-image {
            margin-right: 10px;
          }
        }
        .item-content-info {
          display: flex;
          justify-content: center;
          align-items: center;
          .plus0_delete {
            margin-top: 0;
            margin-left: 20px;
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
        background: url('../../assets/icon/play.png');
        background-size: contain;
      }
    }
    .list-empty {
      margin: 100px 0;
      width: 100%;
      text-align: center;
    }
  }
}
// plus0_delete按钮
.plus0_delete {
  display: block;
  margin-top: 40px;
  border: none;
  outline: none;
  padding: 5px;
  font-size: 14px;
  border-radius: 5px;
  transition: 0.2s;
}
.plus0_delete:hover {
  background-color: red;
  color: #fff;
  cursor: pointer;
}
.plus0_delete:active {
  transform: scale(0.9);
}
</style>