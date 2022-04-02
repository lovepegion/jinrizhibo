<template>
  <div class="main-box">
    <!-- 0_顶部大banner -->
    <!-- <main-header :hot-searchs="hotSearchList" /> -->
    <!-- 12月1日修改-可以返回搜索的列表 -->
    <main-header :hot-searchs="hotSearchList" @getSearchList="getSearchList($event)" />
    <!-- 1_主导航栏 -->
    <ul class="channel-list">
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
      <li class="company-item" :class="{'company-item-active': activeCompanyIndex === index }" v-for="(item, index) in companys.slice(0, 20)" :key="item.id" @click="checkCompany(index, item.company)">{{ item.company }}</li>
      <a-popover title="" trigger="hover" placement="bottomRight">
        <template slot="content">
          <li class="company-item" :class="{'company-item-active': activeCompanyIndex === index+20}" v-for="(item, index) in companys.slice(20)" :key="item.id" @click.prevent="checkCompany(index+20, item.company)">{{ item.company }}</li>
        </template>
        <li class="company-item" v-if="companys.length > 20">更多</li>
      </a-popover>
    </ul>
    <!-- 3_视频列表和右侧登陆显示区 -->
    <div class="product-list">
      <!-- 3_1_视频列表 -->
      <!-- <ul
        class="list"
        v-scroll="handleListOnLoad"
        scroll-disabled="scrollloading"
        scroll-distance="10"
      > -->
      <ul class="list">
        <li class="item" v-for="item in products" :key="item.id">
          <div v-if="item.status === '1'">
            <div v-if="item.coverUrl && item.coverUrl.length < 3" class="item-card1">
              <!-- 3_1_1左侧封面 -->
              <div class="item-image-container" @click="toDetail(item.id)">
                <div class="item-image" alt="cover" :style="{backgroundImage: 'url(' + '/webfile' + item.coverUrl[0] + ')'}" />
                <i class="inner-play"></i>
              </div>
              <!-- 3_1_2右侧内容 -->
              <div class="item-content">
                <!-- 312a大标题 -->
                <div class="item-content-title" :title="item.title" @click="toDetail(item.id)" style="cursor:pointer">{{ item.title }}</div>
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
                <div class="t313c_wrap">
                  <span class="iconfont icon-xiazai hover-blue" @click="downVideo(item.videoUrl)">下载</span>
                  <!-- <a :href="baseUrl+item.videoUrl" download="video"><span class="iconfont icon-xiazai hover-blue">下载</span></a> -->
                  <span class="iconfont icon-fenxiang t313c_share hover-blue">分享</span>
                  <!-- 313c_1分享弹窗 -->
                  <div class="t313c_1_wrap">
                    <Share :videoUrl="item.videoUrl" :title="item.title" :videoId="item.id"></Share>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="item-card2">
              <div class="item-content-title">{{ item.title }}</div>
              <div v-if="item.coverUrl && (item.coverUrl.length === 3 || item.coverUrl.length === 4)" class="item-images">
                <div @click="toDetail(item.id)" class="item-image" alt="cover" :style="{backgroundImage: 'url(' + '/webfile' + item.coverUrl[0] + ')'}" />
                <div @click="toDetail(item.id)" class="item-image" alt="cover" :style="{backgroundImage: 'url(' + '/webfile' + item.coverUrl[1] + ')'}" />
                <div @click="toDetail(item.id)" class="item-image" alt="cover" :style="{backgroundImage: 'url(' + '/webfile' + item.coverUrl[2] + ')'}" />
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
                <!-- card2_下载和分享 -->
                <div class="plus_card2_downshare">
                  <span class="iconfont icon-xiazai hover-blue" @click="downVideo(item.videoUrl)">下载</span>
                  <span class="iconfont icon-fenxiang plus_card2_share hover-blue">分享</span>
                  <!-- 313c_1分享弹窗 -->
                  <div class="plus_card2_sharebox">
                    <Share :videoUrl="item.videoUrl" :title="item.title" :videoId="item.id"></Share>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
        <li v-if="pageFlag != 'getSearchList'" style="width:100%;textAlign:center"><a-pagination v-model="pageNumber" :total="total" @change="onPageChange" :pageSize="pageSize" /></li>
        <!-- <a-empty class="list-empty" v-if="products.length === 0" /> -->
      </ul>
      <!-- 3_2_右侧登陆显示 -->
      <div class="right-container">
        <div v-if="token" class="user-card">
          <a @click="toUsercenter" class="user-info">
            <img :src="'/webfile' + avatar" ><span>{{ nickname }}<a-icon type="right" /></span>
          </a>
          <div class="relate-num">
            <ul class="relate-num-list">
              <li class="relate-num-item">
                <img :src="shoucang">
                <span class="num">{{ count.collectionCount }}</span>
                <span class="text" @click="toOneUsercenter(1)">收藏</span>
              </li>
              <li class="relate-num-item">
                <img :src="fensi">
                <span class="num">{{ count.fansCount }}</span>
                <span class="text" @click="toOneUsercenter(3)">粉丝</span>
              </li>
              <li class="relate-num-item">
                <img :src="guanzhu">
                <span class="num">{{ count.followCount }}</span>
                <span class="text" @click="toOneUsercenter(2)">关注</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="unlogoin" v-else>
          <p class="unlogoin-tips">登录后，立即体验</p>
          <a-button type="primary" @click="toLogin">
            立即登录
          </a-button>
        </div>
        <!-- 4_登陆下方热门搜索 -->
        <div class="t4_wrap">
          <!-- 4_1_大标题 -->
          <div class="t4_1_warp">
            <!-- 4_1_1左侧 -->
            <div class="t4_1_title"><span class="iconfont icon-remenx" style="fontSize: 24px;color: red"></span>&nbsp;智播热榜</div>
            <!-- 4_1_2右侧 -->
            <div class="t4_1_2_change" @click="onSearchChange()"><span class="iconfont icon-huanyihuan"></span>&nbsp;
              <span v-if="!searchToggle">热门搜索</span>
              <span v-if="searchToggle">当前频道</span>
            </div>
          </div>
          <!-- 4_2_列表 -->
          <ul class="t4_2_list">
            <li v-for="(item,index) in hotList.slice(0, 10)" class="t4_2_list_item" :key="index">
              <span class="t4_2_list_item_index" :class="{num1:index===0,num2:index===1,num3:index===2,num10:index===9}">{{index + 1}}</span>&nbsp;&nbsp;
              <a :href="playbase + item.id" target="_blank" :class="{num10:index===9}"><div class="t4_2_list_item_title">{{item.title}}</div></a>
              <span v-if="index===0||index===1||index===2" class="t4_2_list_item_after">热</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
    <Footer />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { videoPlayUrl } from '@/api/visit_base_url.js'
import Share from '@/components/share/Share.vue'
import shoucang from '@/assets/icon/shoucang.png'
import fensi from '@/assets/icon/fensi.png'
import guanzhu from '@/assets/icon/guanzhu.png'
import MainHeader from '@/components/layout/MainHeader.vue'
import { getAllChannel, getProductByPage, getHotSearchData, getCount, getChannelCompany, getProductDetail } from '@/api/make'
import { getHotSearch, getRecommend, getKeyWord } from '@/api/update.js'
import Footer from '@/components/layout/Footer.vue'
import StreamSaver from 'streamsaver'
export default {
  name: 'Main',
  components: {
    MainHeader,
    Footer,
    Share
  },
  data() {
    return {
      choosedCompany: '', // 当前选择的企业频道
      isSearching: false, // 12月1日添加，正在搜索
      inputSearchKey: '', // 12月1日添加，搜索关键词
      // companyworks: [], // 公司作品列表 
      searchToggle: false, // 搜索切换控制
      playbase: videoPlayUrl, // 线上播放基准地址
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
      pageSize: 10,
      total: 0,
      pageFlag: 'onRecommand', //当前处于哪个页面，用于分页请求不同链接
      searchKey: '',
      companys: [],
      products: [], // 主页左侧展示的视频列表
      allWorks: [], // 视频列表的备份
      hotList: [], // 右侧展示的视频列表
      hotSearchList: [],
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
  async mounted() {
    this._getAllChannel()
    this._getHotSearchData()
    if (this.$store.state.userInfo && this.$store.state.userInfo.token) {
      this._getCount()
    }
    // 默认热搜列表
    const { data } = await getHotSearch(2)
    this.hotList = data
  },
  methods: {
    ...mapMutations({ setChoosedCompany: 'SET_CHOOSED_COMPANY_CHANNEL' }),
    // 12月2日添加-获取智播推荐列表
    async onRecommend () {
      this.setChoosedCompany('')
      this.pageFlag = 'onRecommand'
      this.isSearching = false
      this.products = []
      this.activeChannelIndex = 0
      this.companys = []
      const { data } = await getRecommend({ pageNumber: this.pageNumber, pageSize: this.pageSize })
      this.total = data.total
      this.products = [...data.list]
    },
    // 12月1日添加-根据搜索结果的id，搜集作品信息，赋值给products
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
      this.pageFlag = 'getSearchList'
    },
    async onPageChange () {
      let res
      if (this.pageFlag === 'onRecommand') res = await getRecommend({pageNumber: this.pageNumber, pageSize: this.pageSize})
      else if (this.pageFlag === 'checkChannel') res = await this._getProductByPage()
      this.total = res.data.total
      this.products = res.data.list
    },
    // 列表滚动加载
    handleListOnLoad() {
      if (!this.scrollFinished && !this.scrollloading) {
        this.pageNumber++
        this._getProductByPage()
      }
    },
    checkChannel(index) {
      this.setChoosedCompany('')
      this.pageFlag = 'checkChannel'
      this.isSearching = false // 12月1日添加，不在关键词搜索
      if (index < 10) {
        this.activeChannelIndex = index
      } else {
        [this.channelOptions[index], this.channelOptions[9]] = [this.channelOptions[9], this.channelOptions[index]]
        this.activeChannelIndex = 9
      }
      this.pageNumber = 1
      this.activeCompanyIndex = -1
      this.searchKey = ''
      this.products = []
      this.companys = []
      this._getChannelCompany()
      this._getProductByPage()
    },
    async checkCompany(index, choosedCompany) {
      this.setChoosedCompany(choosedCompany)
      this.pageNumber = 1
      if (index < 20) {
        this.activeCompanyIndex = index
        if (index === -1) this.searchKey = ''
        else if (choosedCompany === '合肥柯锐') this.searchKey = '合肥柯锐机房设备'
        else this.searchKey = choosedCompany
        // else this.products = this.companyworks[index].works
        this._getProductByPage()
      } else {
        [this.companys[index], this.companys[19]] = [this.companys[19], this.companys[index]]
        this.activeCompanyIndex = 19
      }
      /* this.pageNumber = 1
      if (index !== -1) {
        this.searchKey = this.companys[index].company
      } else {
        this.searchKey = ''
      }
      this.products = []
      this._getProductByPage() */
    },
    //  跳转详情
    toDetail(id) {
      // this.$router.push(`/product/detail/${id}`)
      let routeData = this.$router.resolve({path: `/product/detail/${id}`})
      window.open(routeData.href, '_blank')
    },
    toLogin(id) {
      // this.$router.push(`/user/login`)
      let routeData = this.$router.resolve({path: `/user/login`})
      window.open(routeData.href, '_blank')
    },
    toUsercenter() {
      // this.$router.push(`/usercenter`)
      let routeData = this.$router.resolve({path: `/usercenter`})
      window.open(routeData.href, '_blank')
    },
    toOneUsercenter(val) {
      // this.$router.push(`/usercenter?to=${val}`)
      let routeData = this.$router.resolve({path: `/usercenter?to=${val}`})
      window.open(routeData.href, '_blank')
    },
    _getHotSearchData() {
      /* getHotSearchData().then(res => {
        if (res.message && res.message.code === 0) {
          this.hotSearchList = res.data
        }
      }) */
      getKeyWord().then(res => {
        if (res.message && res.message.code === 0) {
          this.hotSearchList = res.data.list
        }
      })
    },
    //  查询所有栏目列表
    async _getAllChannel() {
      /* getAllChannel().then(async res => {
        if (res.message && res.message.code === 0) {
          this.channelOptions = res.data
          if (this.channelOptions.length > 0) {
            await this._getChannelCompany()
            await this._getProductByPage()
          }
        }
      }) */
      const res = await getAllChannel()
      if (res.message && res.message.code === 0) {
          this.channelOptions = res.data
          if (this.channelOptions.length > 0) {
            this._getChannelCompany()
            // this._getProductByPage()
            // 12月2日添加-获取新的智播推荐
            const { data } = await getRecommend({pageNumber: this.pageNumber, pageSize: this.pageSize})
            this.products = data.list
            this.total = data.total
          }
        }
    },
    //  获取栏目下的公司列表（分页查询）
    async _getChannelCompany() {
      const params = {
        pageNumber: 1,
        pageSize: 1000,
        channelId: this.channelOptions[this.activeChannelIndex].id,
      }
      /* getChannelCompany(params).then(res => {
        if (res.message && res.message.code === 0) {
          this.companyworks = []
          this.companys = res.data.list
          this.companys.forEach( item => {
            const tempObj = {company: item.company, works: []}
            this.companyworks.push(tempObj)
            console.log('companyworks创建', this.companyworks)
          })
        }
      }) */
      const res = await getChannelCompany(params)
      if (res.message && res.message.code === 0) {
          this.companyworks = []
          this.companys = res.data.list
          this.companys.forEach( item => {
            const tempObj = {company: item.company, works: []}
            this.companyworks.push(tempObj)
            // console.log('companyworks创建', this.companyworks)
          })
        }
    },
    //  根据栏目查询栏目下的作品列表
    _getProductByPage() {
      const params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        channelId: this.channelOptions[this.activeChannelIndex].id,
        keyWord: this.searchKey,
      }
      getProductByPage(params).then(res => {
        if (res.message && res.message.code === 0) {
          this.total = res.data.total
          this.products = res.data.list
          // this.allWorks = res.data.list
          // console.log('vedio', this.allWorks)
          // this.allWorks.forEach(item => {
          //   if (item.secondTitle) {
          //     const tempArray = item.secondTitle.split("-")
          //     // console.log('tempArray46546', tempArray)
          //     // console.log('companyworks', this.companyworks)
          //     this.companyworks.forEach(el => {
          //       if (el.company === tempArray[2]) el.works.push(item)
          //       return
          //     })
          //   }
          // })
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
      // console.log('视频地址', downUrl)

      fetch(downUrl, {
            method: 'GET',
            cache: 'no-cache'
          }).then(res=> {
              const fileStream = StreamSaver.createWriteStream('video.mp4', {
                  size : res.headers.get("content-length")
              })
              const readableStream = res.body
              // more optimized
              if (window.WritableStream && readableStream.pipeTo) {
                  return readableStream.pipeTo(fileStream)
                      .then(() => console.log('done writing'))
              }
              window.writer = fileStream.getWriter()

              const reader = res.body.getReader()
              const pump = () => reader.read()
                  .then(res => res.done
                      ? window.writer.close()
                      : window.writer.write(res.value).then(pump))

              pump()
          })

      /* axios({
        method: 'get',
        url: downUrl,
        // 必须显式指明响应类型是一个Blob对象，这样生成二进制的数据，才能通过window.URL.createObjectURL进行创建成功
        responseType: 'blob',
      }).then((res) => {
        console.log('dowloadres', res)
        if (!res) {
          return
        }
        // 将lob对象转换为域名结合式的url
        let blobUrl = window.URL.createObjectURL(res.data)
        let link = document.createElement('a')
        document.body.appendChild(link)
        link.style.display = 'none'
        link.href = blobUrl
        // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
        link.download = 'video.mp4'
        // 自触发click事件
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl);
      }) */
      
      // window.open(downUrl)

      /* fetch(downUrl).then(res => res.blob()).then(blob => {
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
      }) */

      /* var url = downUrl //下载地址
			var xhr = new XMLHttpRequest()
			xhr.open('get', url, true) // 也可以使用POST方式，根据接口
			// 						xhr.setRequestHeader("dis_k",`cb9a62d3796e276f8707318b3c48ed3d`);
			// xhr.setRequestHeader("dis_t",`1617786336`);
			xhr.responseType = "blob" // 返回类型blob

			xhr.onload = function () {
        if (this.status === 2000) {
          var blob = this.response
          var reader = new FileReader()
          reader.readAsDataURL(blob) // 转换为base64，可以直接放入a表情href
          reader.onload = function (e) {
            var a = document.createElement('a')
            a.download ='视频' //下载文件名
            a.href = e.target.result;
            a.click()
            window.URL.revokeObjectURL(e.target.result)
          }
        }
      }
			xhr.send() */
    },
    // 主页热搜列表切换
    async onSearchChange () {
      this.searchToggle = !this.searchToggle
      if (this.searchToggle) {
        this.hotList = this.products
      } else {
        const { data } = await getHotSearch(2)
        this.hotList = data
      }
    }
  }
}
</script>

<style lang="less">
.main-box {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  .product-list {
    display: flex;
    width: 1200px;
    margin: 0 auto;
    flex: 1;
    .list {
      min-height: 500px;
      width: 918px;
      display: flex;
      flex-wrap: wrap;
      overflow: auto;
      margin-bottom: 200px;
      .item {
        width: 80%;
        display: flex;
        border-bottom: 1px solid #EEEEEE;
        margin-bottom: 21px;
        .hover-blue:hover {
          color: #e4373a;
          cursor: pointer;
        }
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
                left: 110px;
              }
              .t313c_share:hover ~ .t313c_1_wrap {
                transform: scale(1);
              }
              .t313c_1_wrap:hover {
                transform: scale(1);
              }
            }
          }
        }
        .item-card2 {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          margin-bottom: 30px;
          .item-images {
            display: flex;
            margin-bottom: 20px;
            .item-image {
              margin-right: 10px;
              width: 250px;
              cursor: pointer;
            }
          }
          // card2下载和分享
          .plus_card2_downshare {
            margin-left: 20px;
            position: relative;
            .plus_card2_share {
              margin-left: 10px;
            }
            // 313c_1分享弹窗
            .plus_card2_sharebox {
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
              z-index: 3;
              top: 0px;
              left: 110px;
            }
            .plus_card2_share:hover ~ .plus_card2_sharebox {
              transform: scale(1);
            }
            .plus_card2_sharebox:hover {
              transform: scale(1);
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
    position: relative;
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
    // 4_登陆下方热门搜索
    .t4_wrap {
      width: 100%;
      position: absolute;
      top: 220px;
      right: 0px;
      // 4_1大标题
      .t4_1_warp {
        display: flex;
        justify-content: space-between;
        align-items: center;
        // 左侧
        .t4_1_title {
          text-align: left;
          // font-weight: bold;
          font-size: 20px;
        }
        // 右侧
        .t4_1_2_change {
          color: #fc0000;
          cursor: pointer;
        }
      }
      // 4_2_列表
      .t4_2_list {
        text-align: left;
        .t4_2_list_item { // 搜索的每一项
          font-size: 16px;
          color: #222222;
          margin-top: 20px;
          display: flex;
          align-items: center;
          .t4_2_list_item_title {
            margin: 0 5px;
            max-width: 340px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .t4_2_list_item_after {
            display: inline-block;
            padding: 2px;
            background-color: #f04142;
            font-size: 12px;
            color: #FFFFFF;
            border-radius: 2px;
          }
          a {
            color: #222;
            text-decoration: none;
            transition: 0.1s
          };
          a:hover {
            color: #f04142;
          };
          a:visited {
            color: #999999;
          }
          .t4_2_list_item_index { // 前面索引
            font-size: 20px;
            color: #acacac;
          }
          .num1 { // 热搜第1颜色
          color: #a82e2e;
          }
          .num2 { // 热搜第2颜色
            color: #f04142;
          }
          .num3 {
            color: #ff9a03;
          }
          .num10 {
            margin-left: -5px;
          }
        }
      }
    }
  }
}
.channel-list {
  display: flex;
  flex: 0 0 auto;
  width: 1200px;
  margin: 0 auto;
  padding: 50px 0 30px;
}
.channel-item {
  margin-right: 20px;
  cursor: pointer;
  font-size: 20px;
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
  padding: 21px;
  border-radius: 4px;
  margin-bottom: 23px;
  box-shadow: 0px 2px 12px rgba(126, 126, 20, 0.08);
  .inputSearchKey {
    color: rgb(55, 189, 241);
    font-weight: bold;
    font-size: 16px;
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

</style>