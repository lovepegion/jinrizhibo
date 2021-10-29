<template>
  <div class="usercenter-attention">
    <ul class="data-list">
			<li v-for="(item, index) in list" :key="index" class="item">
				<img class="item-avatar" :src="'/webfile' + item.headImage" alt="avatar">
				<div class="item-name">{{ item.nickname }}</div>
				<a-button type="primary" @click="doAttention(1, item)" v-if="!item.followFlag"><a-icon type="heart" />关注</a-button>
				<a-button @click="doAttention(2, item)" v-if="item.followFlag"><a-icon type="heart" />取消关注</a-button>
			</li>
		</ul>
		<a-empty class="list-empty" v-if="list.length === 0" />
    <div class="pagination">
      <a-pagination v-model="pageNumber" :total="total" @change="onPageChange" :pageSize="pageSize" />
    </div>
  </div>
</template>

<script>
import { getAllFans, getAllFollow, follow } from '@/api/make'

export default {
	props: {
    mode: { // 0：关注，1：粉丝
      type: Number,
      default: 0
    }
  },
	data() {
		return {
			list: [],
			pageNumber: 1,
      pageSize: 6,
      total: 0,
		}
	},
	watch: {
    mode: function() {
      this.pageNumber = 1
      this.total = 0
      this.fetchData()
    }
  },
	mounted() {
		this.fetchData()
	},
	methods: {
		fetchData() {
      if (this.mode === 0) {
        this._getAllFollow()
      } else {
        this._getAllFans()
      }
    },
		doAttention(flag, item) {
			this._follow(flag, item)
		},	
    onPageChange(pageNumber) {
      this.pageNumber = pageNumber
      this.fetchData()
    },
		//  关注用户
    _follow(type, item) {
      const formData = new FormData()
      formData.append('followUserId', item.id)
      formData.append('type', type)
      follow(formData).then(res => {
        if (res.message && res.message.code === 0) {
					item.followFlag = type === 1 ? true : false
					this.$emit('updateUserinfo')
					this.pageNumber = 1
					this.fetchData()
        }
      })
    },
		//  获取用户关注列表
    _getAllFollow() {
      const params = {
        userId: this.$store.state.userInfo.id,
				pageNumber: this.pageNumber,
				pageSize: this.pageSize,
      }
      getAllFollow(params).then(res => {
        if (res.message && res.message.code === 0) {
          this.list = res.data.list.map(item => {
						item.followFlag = true
						return item
					})
          this.total = res.data.total
        }
      })
    },
		//  获取用户粉丝列表
    _getAllFans() {
      const params = {
        userId: this.$store.state.userInfo.id,
				pageNumber: this.pageNumber,
				pageSize: this.pageSize,
      }
      getAllFans(params).then(res => {
        if (res.message && res.message.code === 0) {
          this.list = res.data.list
          this.total = res.data.total
        }
      })
    },
	},
}
</script>

<style lang="less">
.usercenter-attention {
	padding: 20px 30px;
	.data-list {
    display: flex;
		flex-wrap: wrap;
    align-items: stretch;
    margin-left: -20px;
    margin-right: -20px;
		.item {
			width: 245px;
			height: 271px;
			background: #FFFFFF;
			border-radius: 4px;
			box-shadow: 0px 2px 12px rgba(126, 126, 20, 0.08);
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin: 0 10px 20px;
			.item-avatar {
				width: 80px;
				height: 80px;
				border-radius: 50%;
			}
			.ant-btn {
				width: 120px;
			}
			.item-name {
				font-size: 16px;
				font-weight: 600;
				color: #333333;
				line-height: 30px;
				margin-bottom: 30px;
			}
		}
	}
	.list-empty {
		margin: 100px 0;
	}
}
</style>