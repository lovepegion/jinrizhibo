<template>
  <div class="scrutiny">
    <!-- 0_顶部搜索栏_12月3日添加 -->
    <KeySearch @getSearchList="getSearchList($event)"></KeySearch>
    <!-- 1_主导航栏 -->
    <ul class="channel-list1">
      <li class="channel-item" :class="{'channel-item-active': activeChannelIndex === 0}" @click="onRecommend()">智播推荐</li>
      <li class="channel-item" :class="{'channel-item-active': activeChannelIndex === index+1}" v-for="(item, index) in channelOptions.slice(1, 10)" :key="item.id" @click="checkChannel(index+1)">{{ item.name }}</li>
      <a-popover title="" trigger="hover" placement="bottomRight">
        <template slot="content">
          <li class="channel-item" :class="{'channel-item-active': activeChannelIndex === index+10}" v-for="(item, index) in channelOptions.slice(10)" :key="item.id" @click.prevent="checkChannel(index+10)">{{ item.name }}</li>
        </template>
        <li class="channel-item" v-if="channelOptions.length > 10">更多</li>
      </a-popover>
    </ul>
    <!-- 2_次导航栏 -->
    <ul v-if="isSearching" class="company-list">
      <li class="inputSearchKey">您正在搜索: "{{inputSearchKey}}"</li>
    </ul>
    <ul v-else class="company-list">
      <li class="company-item company-item-first" :class="{'company-item-active': activeCompanyIndex === -1 }" @click="checkCompany(-1)">全部</li>
      <li class="company-item" :class="{'company-item-active': activeCompanyIndex === index }" v-for="(item, index) in companys.slice(0, 20)" :key="item.id" @click="checkCompany(index)">{{ item.company }}</li>
      <a-popover title="" trigger="hover" placement="bottomRight">
        <template slot="content">
          <li class="company-item" :class="{'company-item-active': activeCompanyIndex === index+20}" v-for="(item, index) in companys.slice(20)" :key="item.id" @click.prevent="checkCompany(index+20)">{{ item.company }}</li>
        </template>
        <li class="company-item" v-if="companys.length > 20">更多</li>
      </a-popover>
    </ul>
    <!-- 3_视频列表和右侧登陆显示区 -->
    <div class="product-list">
      <!-- 3_1_视频列表 -->
      <ul
        class="list"
        v-scroll="handleListOnLoad"
        scroll-disabled="scrollloading"
        scroll-distance="10"
      >
        <li class="item" v-for="item in products" :key="item.id">
          <ScrutinyItem :item="item" :currentChannel="currentChannel"></ScrutinyItem>
        </li>
        <a-empty class="list-empty" v-if="products.length === 0" />
      </ul>
      <!-- 3_2_底部页码导航 -->
      <div class="t3_2_warp">
        <div class="pagination">
          <a-pagination v-model="checkpageNumber" :total="checktotal" @change="onPageChange" :pageSize="checkpageSize" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Share from '@/components/share/Share.vue'
import shoucang from '@/assets/icon/shoucang.png'
import fensi from '@/assets/icon/fensi.png'
import guanzhu from '@/assets/icon/guanzhu.png'
import { getAllChannel, getCount, getChannelCompany, getProductDetail } from '@/api/make'
import { getProductByPageWithAdmin, getRecommend, getHotSearch } from '@/api/update.js'
import ScrutinyItem from './components/scrutinyItem.vue'
import KeySearch from './components/KeySearch.vue'
export default {
  name: 'Scrutiny',
  components: { ScrutinyItem, KeySearch },
  /* components: {
    Share
  }, */
  data () {
    return {
      isSearching: false,
      checkpageNumber: 1, // 当前切换页
      checkpageSize: 20,
      checktotal: 200,
      currentChannel: '智播推荐', // 12月2日添加-当前频道，用于底部页码根据不同频道切换
      searchToggle: false, // 搜索切换控制
      baseUrl: process.env.VUE_APP_ZB_DOMAIN_FILE,
      follow: 1, // 关注数量
      collection: 1, // 收藏数量
      like: 1, // 点赞数量
      comment: 1, // 评论
      shoucang,
      fensi,
      guanzhu,
      channelOptions: [],
      activeChannelIndex: 0,
      activeCompanyIndex: -1,
      pageNumber: 1,
      // pageSize: 20,
      companys: [],
      products: [], // 主页左侧展示的视频列表
      // hotSearchList: [],
      count: {
        collectionCount: 0,
        fansCount: 0,
        followCount: 0,
      },
      scrollFinished: false,  // 滚动列表加载完成
      scrollloading: true,  // 滚动列表加载中
    }
  },
  computed: {
    avatar() {
      return this.$store.state.userInfo.headImage
    },
    nickname() {
      return this.$store.state.userInfo.nickname
    },
    token() {
      return this.$store.state.userInfo.token
    },
  },
  mounted() {
    this._getAllChannel()
    // this._getHotSearchData()
    if (this.$store.state.userInfo && this.$store.state.userInfo.token) {
      this._getCount()
    }
  },
  methods: {
    getSearchList ({ idLists, inputSearchKey }) {
      this.activeChannelIndex = -1
      this.isSearching = true
      this.inputSearchKey = inputSearchKey
      this.products = []
      if (idLists.length) {
        idLists.forEach(idList => {
          getProductDetail({id: idList.id}).then(res => {
            res.data.coverUrl = JSON.parse(res.data.cover)
            this.products.push(res.data)
          })
        })
      } else {
        this.products = []
      }
    },
    /* _getHotSearchData() {
      getKeyWord().then(res => {
        if (res.message && res.message.code === 0) {
          this.hotSearchList = res.data.list
        }
      })
    }, */
    // 12月2日添加-获取智播推荐列表
    async onRecommend () {
      this.checktotal = 0
      this.currentChannel = '智播推荐'
      this.products = []
      this.activeChannelIndex = 0
      this.companys = []
      this.onPageChange()
    },
    // 底部页码切换
    /* onPageChange () {
      this.$nextTick(() => {
        const params = {
          pageNumber: this.checkpageNumber,
          pageSize: this.checkpageSize,
          channelId: this.channelOptions[this.activeChannelIndex].id,
          keyWord: this.searchKey,
        }
        getProductByPageWithAdmin(params).then(res => {
          if (res.message && res.message.code === 0) {
            this.products = res.data.list
            if (this.products.length < this.pageSize) {  // 发现某页数量小于20，则修改作品数量为当前数量
              this.checktotal = this.pageSize * (this.pageNumber + 1)
            }
            console.log('vedio', this.products)
          }
        })
      })
    }, */
    // 12月2日更新-新的推荐列表页码切换
    onPageChange () {
      if (this.currentChannel === '智播推荐') {
        this.$nextTick(() => {
        getRecommend(this.checkpageNumber, this.checkpageSize).then(res => {
          if (res.message && res.message.code === 0) {
            this.products = []
            this.products = [...res.data.list]
            this.checktotal = res.data.total
            /* if (this.products.length < this.checkpageSize) {  // 发现某页数量小于20，则修改作品数量为当前数量
              this.checktotal = this.checkpageSize * this.pageNumber
            } */
          }
        })
      })
      } else {
        this.$nextTick(() => {
        const params = {
          pageNumber: this.checkpageNumber,
          pageSize: this.checkpageSize,
          channelId: this.channelOptions[this.activeChannelIndex].id,
          keyWord: this.searchKey,
        }
        getProductByPageWithAdmin(params).then(res => {
          if (res.message && res.message.code === 0) {
            this.products = []
            this.products = [...res.data.list]
            this.checktotal = res.data.total
            /* if (this.products.length < this.checkpageSize) {  // 发现某页数量小于20，则修改作品数量为当前数量
              this.checktotal = this.checkpageSize * (this.pageNumber + 1)
            } */
          }
        })
      })
      }
    },
    // 列表滚动加载
    handleListOnLoad() {
      if (!this.scrollFinished && !this.scrollloading) {
        this.pageNumber++
        this._getProductByPage()
      }
    },
    checkChannel(index) {
      if (index < 10) {
        this.activeChannelIndex = index
      } else {
        [this.channelOptions[index], this.channelOptions[9]] = [this.channelOptions[9], this.channelOptions[index]]
        this.activeChannelIndex = 9
      }
      // this.checktotal = 200
      this.isSearching = false
      this.currentChannel = '栏目频道'
      this.pageNumber = 1
      this.activeCompanyIndex = -1
      this.searchKey = ''
      this.products = []
      this.companys = []
      this._getProductByPage()
      this._getChannelCompany()
    },
    checkCompany(index) {
      if (index < 20) {
        this.activeCompanyIndex = index
      } else {
        [this.companys[index], this.companys[19]] = [this.companys[19], this.companys[index]]
        this.activeCompanyIndex = 19
      }
      this.pageNumber = 1
      if (index !== -1) {
        this.searchKey = this.companys[index].company
      } else {
        this.searchKey = ''
      }
      this.products = []
      this._getProductByPage()
    },
    //  跳转详情
    toDetail(id) {
      this.$router.push(`/product/detail/${id}`)
    },
    toLogin(id) {
      this.$router.push(`/user/login`)
    },
    toUsercenter() {
      this.$router.push(`/usercenter`)
    },
    toOneUsercenter(val) {
      this.$router.push(`/usercenter?to=${val}`)
    },
    //  查询所有栏目列表
    async _getAllChannel() {
      const res = await getAllChannel()
      if (res.message && res.message.code === 0) {
        this.channelOptions = res.data
        if (this.channelOptions.length > 0) {
          this._getChannelCompany()
          // this._getProductByPage()
          // 12月2日添加-获取新的智播推荐
          const myres = await getRecommend()
          if (myres.message && myres.message.code === 0) {
            this.products = []
            this.products = [...myres.data.list]
            this.checktotal = myres.data.total
            /* if (this.products.length < this.checkpageSize) {  // 发现某页数量小于20，则修改作品数量为当前数量
              this.checktotal = this.checkpageSize * this.pageNumber
            } */
          }
        }
      }
    },
    //  获取栏目下的公司列表（分页查询）
    _getChannelCompany() {
      const params = {
        pageNumber: 1,
        pageSize: 1000,
        channelId: this.channelOptions[this.activeChannelIndex].id,
      }
      getChannelCompany(params).then(res => {
        if (res.message && res.message.code === 0) {
          this.companys = res.data.list
        }
      })
    },
    //  根据栏目查询栏目下的作品列表
    _getProductByPage() {
      const params = {
        pageNumber: 1,
        pageSize: this.checkpageSize,
        channelId: this.channelOptions[this.activeChannelIndex].id,
        keyWord: this.searchKey,
      }
      getProductByPageWithAdmin(params).then(res => {
        if (res.message && res.message.code === 0) {
          this.products = res.data.list
          console.log('vedio', this.products)
          this.checktotal = res.data.total
          /* if (this.products.length >= 20) {
            this.checktotal = 100
          } else this.checktotal = this.products.length */
        }
      })
    },
    //  获取某个用户关注量和粉丝数量以及收藏量
    _getCount() {
      const params = {
        userId: this.$store.state.userInfo.id
      }
      getCount(params).then(res => {
        if (res.message && res.message.code === 0) {
          this.count = Object.assign({}, res.data)
        }
      })
    },
    // 下载视频
    downVideo (videoUrl) {
      const downUrl = this.baseUrl + videoUrl
      console.log('视频地址', downUrl)
      fetch(downUrl).then(res => res.blob()).then(blob => {
        console.log('fetch视频', downUrl)
        const a = document.createElement('a');
        document.body.appendChild(a)
        a.style.display = 'none'
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = '视频.mp4';
        a.click();
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url);
      })
    },
    // 主页热搜列表切换
    async onSearchChange () {
      this.searchToggle = !this.searchToggle
      if (this.searchToggle) {
        const { data } = await getHotSearch(2)
        this.hotList = data
      } else {
        this.hotList = this.products
      }
    }
  }
}
</script>

<style scoped lang="less">
.scrutiny {
  margin-left: 15px;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 700px;
  .product-list {
    width: 1200px;
    margin: 0 auto;
    flex: 1;
    .list {
      width: 918px;
      display: flex;
      flex-wrap: wrap;
      overflow: auto;
      .item {
        width: 100%;
        display: flex;
        border-bottom: 1px solid #EEEEEE;
        margin-bottom: 21px;
      }
      .list-empty {
        margin: 100px 0;
        width: 100%;
        text-align: center;
      }
    }
  }
  .right-container {
    width: 281px;
    height: 180px;
    background: #FFFFFF;
    box-shadow: 0px 2px 12px rgba(126, 126, 20, 0.08);
    border-radius: 10px;
    padding: 16px;
    text-align: left;
    background: url('../../assets/image/user-info-bak.png');
    background-position: bottom;
    .user-info {
      display: flex;
      align-items: center;
      color: #333333;
      font-size: 16px;
      font-weight: 600;
      img {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        margin-right: 12px;
      }
    }
    .relate-num {
      .relate-num-list {
        display: flex;
        justify-content: center;
        .relate-num-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 10px;
          img {
            width: 50px;
            height: 50px;
          }
          .num {
            font-size: 20px;
            color: #333333;
            font-weight: 600;
            margin-bottom: 5px;
          }
          .text {
            font-size: 14px;
            color: #999999;
            cursor: pointer;
            &:hover {
              color: #E4373A;
            }
          }
        }
      }
    }
    .unlogoin {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      .unlogoin-tips {
        margin-bottom: 20px;
      }
    }
  }
}
.ant-select-dropdown {
  border-radius: 2px;
}
.channel-list1 {
  display: flex;
  flex: 0 0 auto;
  width: 900px;
  padding: 10px 0 30px;
}
.channel-item {
  margin-right: 20px;
  cursor: pointer;
  font-size: 14px;
}
.channel-item-active {
  color: #f44336;
}
.company-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex: 0 0 auto;
  width: 1200px;
  margin: 0 auto;
  font-size: 14px;
  font-weight: 400;
  color: #666666;
  line-height: 20px;
  padding: 10px 21px;
  border-radius: 4px;
  margin-bottom: 23px;
  box-shadow: 0px 2px 12px rgba(126, 126, 20, 0.08);
  .inputSearchKey {
    color: rgb(55, 189, 241);
    font-weight: bold;
  }
}
.company-item {
  cursor: pointer;
  margin: 0 20px 10px 0;
}
.company-item-first {
  margin-left: 0;
}
.company-item-active {
  color: #E4373A;
  padding: 2px 16px;
  border: 1px solid #E4373A;
  border-radius: 13px;
}
// 3_2_底部页码导航
.t3_2_warp {
  width: 800px;
  margin-bottom: 100px;
}
</style>