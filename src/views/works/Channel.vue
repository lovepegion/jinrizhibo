<template>
  <div class="channel-container">
    <Header />
    <div class="bar-container">
      <ul class="channel-bar">
      <ChannelListItem :channelItem="{id: '', company: '全部'}" @getCompanyWorks="getCompanyWorks(-1, $event)" :class="{channelActive: channelActiveIndex===-1}"/>
      <ChannelListItem v-for="(channelItem, index) in channelList" :key="channelItem.id" :channelItem="channelItem" @getCompanyWorks="getCompanyWorks(index, $event)" :class="{channelActive: channelActiveIndex===index}"/>
    </ul>
    </div>
    <div class="channel-body">
      <!-- 顶部标题信息 -->
      <div class="top-container">
        <p><span v-if="currentCompany" class="company">{{currentCompany}}</span><span>虚拟电视频道</span></p>
        <h1 style="textAlign:left">{{currentVideo.title}}</h1>
        <p style="fontSize:12px">
          <span v-if="currentVideo.source" style="marginRight: 20px">来源：{{currentVideo.source}} </span>
          <span style="marginRight:40px">作者：{{currentVideo.nickname}}</span>
          {{currentVideo.createDate}}
        </p>
      </div>
      <div class="video-box">
        <!-- 视频框 -->
        <div class="video-container" ref="videocontainer">
          <!-- plus0_1_logo和公司 -->
          <div class="plus0_1_channel">
            <div v-if="companiesOffTag.indexOf(currentVideo.choosedCompany)<=-1" class="plus_logo_show">
              <img v-if="currentVideo.logoUrl" :src="(currentVideo.logoUrl.indexOf('http') != -1) ? currentVideo.logoUrl : (baseUrl + currentVideo.logoUrl)">
            </div>
            <div v-else class="plus_logo_show">
              <img v-if="currentVideo.logoUrl" :src="(currentVideo.logoUrl.indexOf('http') != -1) ? currentVideo.logoUrl : (baseUrl + currentVideo.logoUrl)">
            </div>
            <div></div>
            <div v-if="companiesOffTag.indexOf(currentVideo.choosedCompany)<=-1" class="plus_company_name">
              {{currentVideo.choosedCompany}}
            </div>
          </div>
          <!-- plus0_2_视频简介 -->
          <div class="plus_des_wrap1">
            <div class="plus_des_main1" v-if="currentVideo.secondTitle && showSecondTitle">{{currentVideo.secondTitle}}</div>
            <div class="plus_des_detail1" v-if="currentVideo.synopsis && showSynopsis">{{currentVideo.synopsis}}</div>
          </div>
          <video
            v-show="headVideoShow && !userVideoShow && !loadVideoShow"
            ref="headVideo"
            :autoplay="currentVideo.headVideo"
            controls
            disablePictureInPicture
            controlsList="nodownload noremoteplayback"
            :src="(currentVideo.headVideo.indexOf('http') != -1) ? currentVideo.headVideo : (baseUrl + currentVideo.headVideo)"
            style="width: 100%;height:100%"
          />
          <!-- plus0_1_1用户视频 -->
          <video
            v-show="!headVideoShow && userVideoShow && !loadVideoShow"
            ref="userVideo"
            :autoplay="!currentVideo.headVideo"
            controls
            disablePictureInPicture
            controlsList="nodownload noremoteplayback"
            :src="(currentVideo.videoUrl.indexOf('http') != -1) ? currentVideo.videoUrl : (baseUrl + currentVideo.videoUrl)"
            style="width: 100%;height:100%"
          />
          <!-- plus0_1_2插播的视频 -->
          <video
            v-show="!headVideoShow && !userVideoShow && loadVideoShow"
            ref="loadVideo"
            :src="(currentVideo.insertVideo.indexOf('http') != -1) ? currentVideo.insertVideo : (baseUrl + currentVideo.insertVideo)"
            style="width: 100%;height:100%"
            controls
          ></video>
          <!-- plus0_3_语言切换 -->
          <div class="plus0_3_langChoose" v-if="currentVideo.videoUrls && showChangeLang">
            <ul class="plus0_3_langchooseitem">
              <li @click="onSwitch(-1, currentVideo.mainLang)" class="plus0_3_langchooseitem_item" :class="{plus0_3_langchooseitem_active:switchedIndex===-1}">{{currentVideo.mainLang}}</li>
              <li v-for="(item, index) in currentVideo.videoUrls" :key="index" @click="onSwitch(index, item.language)" class="plus0_3_langchooseitem_item" :class="{plus0_3_langchooseitem_active:switchedIndex===index}">{{item.language}}</li>
            </ul>
          </div>
        </div>
        <!-- 右侧列表 -->
        <div class="list-container">
          <div class="list-bar">
            <div class="bar-item" :class="{itemactive: barItemIndex===1}" @click="barItemIndex=1">视频</div>
            <div class="bar-item" :class="{itemactive: barItemIndex===2}" @click="barItemIndex=2">专辑</div>
          </div>
          <ul
            v-show="barItemIndex===1"
            class="videos-list"
            v-scroll="handleListOnLoad"
            scroll-disabled="scrollloading"
            scroll-distance="20"
          >
            <li v-if="!companyVideos.length" class="notfound">没有发现视频</li>
            <li style="height:10px;"></li>
            <VideoListItem
              v-for="(videoItem, index) in companyVideos"
              :key="videoItem.id"
              :videoItem="videoItem"
              :class="{vidoitemactive: currenVideoIndex === index}"
              @changeCurrentVideo="getCurrentVideo(index, $event)"
            />
          </ul>
          <ul
            v-show="barItemIndex===2"
            class="videos-list"
            v-scroll="handleAlbumOnLoad"
            scroll-disabled="albumScrollloading"
            scroll-distance="20"
          >
            <li v-if="!comapnyAlbums.length" class="notfound">没有发现专辑</li>
            <AlbumListItem v-for="albumItem in comapnyAlbums" :key="albumItem.id" :albumItem="albumItem"/>
          </ul>
        </div>
      </div>
      <!-- 底部分享点赞评论 -->
      <div class="foot-into" v-if="companyVideos.length">
        <ChannelShare :videoUrl="currentVideo.videoUrl" :title="currentVideo.title" :videoId="currentVideo.id"></ChannelShare>
        <div>
					<a-button type="primary" @click="doAttention(1, 1)" v-if="!currentVideo.focusUserFlag" :disabled="currentVideo.userId === $store.state.userInfo.id"><a-icon type="heart" />关注</a-button>
					<a-button @click="doAttention(2, 2)" v-if="currentVideo.focusUserFlag"><a-icon type="heart" />取消关注</a-button>

					<a-button type="primary" @click="doFav(1, 1)" v-if="!currentVideo.collectionFlag" :disabled="currentVideo.userId === $store.state.userInfo.id"><a-icon type="star" />收藏</a-button>
					<a-button @click="doFav(2, 2)" v-if="currentVideo.collectionFlag"><a-icon type="star" />取消收藏</a-button>

					<a-button type="primary" @click="doLike(1)" v-if="!currentVideo.likeFlag" :disabled="currentVideo.userId === $store.state.userInfo.id"><span class="iconfont icon-dianzan" style="fontSize: 12px;marginRight:9px"></span><span>点赞</span></a-button>
					<a-button @click="doLike(2)" v-if="currentVideo.likeFlag"><span class="iconfont icon-dianzan" style="fontSize: 12px;marginRight:9px"></span><span>取消点赞</span></a-button>
				</div>
      </div>
      <!-- 文本内容 -->
      <div class="detail-content" v-if="companyVideos.length">
        {{ voiceContent }}
      </div>
      <!-- 评论 -->
      <div class="plus1_wrap" v-if="companyVideos.length">
        <div style="fontSize:18px;marginBottom:20px;textAlign:left">{{comments.length}}条评论</div>
        <!-- plus1_1_发表评论,只有登录才显示 -->
        <div v-if="$store.state.userInfo.id" class="plus1_1_warp">
          <!-- plus_1_1_1_用户头像 -->
          <div class="plus_1_1_1__wrap"><img :src="'/webfile'+$store.state.userInfo.headImage"></div>
          <!-- plus_1_1_2_写评论区 -->
          <textarea class="plus_1_1_2_write" v-model="commentContent" rows="5" style="resize:none;width:100%;margin:0 10px" placeholder="发一条积极的评论"></textarea>
          <!-- plus_1_1_3_发表评论按钮 -->
          <button class="plus_1_1_3_button" @click="onSendComment">发表评论</button>
        </div>
        <!-- plus1_2_评论列表 -->
        <ul>
          <li v-for="(item,index) in comments" :key="index" class="plus1_2_item">
              <CommentItem
                :userName="item.userName"
                :content="item.content"
                :createDate="item.createDate"
              ></CommentItem>
          </li>
        </ul>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import VideoListItem from '@/components/VideoListItem.vue'
import ChannelListItem from '@/components/ChannelListItem.vue'
import AlbumListItem from '@/components/AlbumListItem.vue'
import ChannelShare from '@/components/share/ChannelShare.vue'
import CommentItem from '@/components/commentItem/CommentItem.vue'
import { getChannelCompany, getProductByPage, getProductDetail, collectionProduct, follow } from '@/api/make'
import { getAlbumBykey } from '@/api/album.js'
import { collectProduct, likeProduct, followProduct, getComments, sendComment } from '@/api/update.js'
import settingVue from './setting.vue'
const initCurrentVideo = {
  title: '',
  source: '',
  createDate: '',
  headVideo: '',
  videoUrl: '',
  insertVideo: '',
  adTime: '',
  insertSeconds: 0,
  userId: '',
  nickname: '',
  focusUserFlag: false,
  collectionFlag: false,
  likeFlag: false,
  id: '',
  secondTitle: '',
  mainLang: '',
  choosedCompany: '',
  logoUrl: '',
  videoUrls: [{videoUrl:'', language:''}]
}
export default {
  name: 'Channel',
  components: {
    Header,
    Footer,
    ChannelListItem,
    VideoListItem,
    AlbumListItem,
    ChannelShare,
    CommentItem
  },
  data() {
    return {
      companiesOffTag: ['合肥柯锐', '合肥柯锐机房设备', '霍邱融媒', '宿松融媒', '安徽天堂寨', '掌上安庆', '安庆新闻网'],
      chinesArray: ['普通话', '台湾话', '东北话', '四川话', '陕西话', '广东话', '湖南话', '河南话', '山东话', '湖北话', '安徽合肥话', '内蒙古方言'],
      showSecondTitle: true,
			showSynopsis: true,
			showChangeLang: true,
      channelActiveIndex: -1, //当前选择的频道index
      headVideoShow: false, //展示片头视频
      userVideoShow: true, //展示用户视频
      loadVideoShow: false, //展示插入视频
      baseUrl: process.env.VUE_APP_ZB_DOMAIN_FILE, // 播放视频的基准url
      currenVideoIndex: 0, //当前展示的视频序号，用于激活
      barItemIndex: 1, //默认激活的选项
      channelList: [], //频道列表
      companyVideos: [], //公司视频
      comapnyAlbums: [], //公司专辑
      currentCompany: '', //当前选中的公司
      scrollFinished: false,  // 滚动列表加载完成
      scrollloading: false,  // 滚动列表加载中
      albumScrollFinished: false,  // 专辑滚动列表加载完成
      albumScrollloading: false, //专辑滚动列表控制
      isFirstLoad: true, //第一次加载时，展示第一个视频
      getCompanyAlbumsParams: {
        pageNumber: 1,
        pageSize: 20,
        synopsis: ''
      },
      getCompanyVideosParams: {
        pageNumber: 1,
        pageSize: 20,
        channelId: "ea43393fdec54c6d92cd55a843cf05f5",
        keyWord: ''
      },
      //当前选中的视频
      currentVideo: {...initCurrentVideo},
      comments: [], //评论列表
      commentContent: '', //要评论的内容
      voiceContent: '', //当前显示的语言文本
      contentArrays: [], //语言文本列表
      langs: [],
      noChineseLangs: [],
      isChinese: true, // 主语言是不是中文
      switchedIndex: -1 // 选择的语种索引
    }
  },
  methods: {
    fullScreen () {
      this.$refs.videocontainer.requestFullscreen()
    },
    onSwitch (index, lang) {
      console.log('onswitch')
			this.switchedIndex = index
			if (this.chinesArray.some(item => {
				return item === lang
			})) this.voiceContent = this.contentArrays[0]
			else if (this.langs.length === this.noChineseLangs.length) {
				this.noChineseLangs.forEach((item, myindex) => {
					if (item === lang) this.voiceContent = this.contentArrays[myindex]
				})
			} else {
				this.noChineseLangs.forEach((item, myindex) => {
					if (item === lang) this.voiceContent = this.contentArrays[myindex + 1]
				})
			}

			const userVideoRef = this.$refs.userVideo
			this.switchedIndex = index
			if (this.switchedIndex === -1) {
				// console.log('detail_videourl', this.detail.videoUrl)
				if (this.currentVideo.videoUrl.indexOf('http') != -1) userVideoRef.src = this.currentVideo.videoUrl
				else userVideoRef.src = this.baseUrl + this.currentVideo.videoUrl
				userVideoRef.load()
			} else {
				// 12月4日修改，已转为自己服务器连接
				if (this.currentVideo.videoUrl.indexOf('http') != -1) userVideoRef.src = this.currentVideo.videoUrls[this.switchedIndex].videoUrl
				else userVideoRef.src = this.baseUrl + this.currentVideo.videoUrls[this.switchedIndex].videoUrl
				userVideoRef.load()
			}
		},
    // 发表评论
		async onSendComment () {
			await sendComment({
				productId: this.currentVideo.id,
				content: this.commentContent
			})
			const { data } = await getComments(this.currentVideo.id)
			this.comments = data.list
			this.commentContent = ''
		},
    //获取评论
    async _getgetComments (id) {
			const { data } = await getComments(id)
			this.comments = data.list
		},
    async doAttention(flag, type) {
      this._follow(flag)
			await followProduct(this.currentVideo.id, type)
      this.$set(this.currentVideo, 'focusUserFlag', !this.currentVideo.focusUserFlag)
		},
		async doFav(flag, type) {
			// this._collectionProduct(flag)
			await collectProduct(this.currentVideo.id, type)
      this.$set(this.currentVideo, 'collectionFlag', !this.currentVideo.collectionFlag)
		},
		// 点赞和取消点赞
		async doLike(type) {
			await likeProduct(this.currentVideo.id, type)
      this.$set(this.currentVideo, 'likeFlag', !this.currentVideo.likeFlag)
		},
    async _follow(type) {
      const formData = new FormData()
      formData.append('followUserId', this.currentVideo.userId)
      formData.append('type', type)
      await follow(formData)
		},
    getCurrentVideo (index, videoItem) {
      this.headVideoShow = false
      this.userVideoShow = true
      this.loadVideoShow = false
      this.langs.splice(0, this.langs.length)
      this.noChineseLangs.splice(0, this.noChineseLangs.length)
      getProductDetail({id: videoItem.id}).then(res => {
        let headVideo = ''
        let insertVideo = ''
        let insertSeconds = 0
        if (res.data.adTime && res.data.adTime != '开始' && res.data.adTime != '中间' && res.data.adTime != '结尾') {
          const tempArray = res.data.adTime.split(":")
          insertSeconds = tempArray[0] * 60 + tempArray[1] * 1
        }
        if (res.data.adUrl) {
          headVideo = JSON.parse(res.data.adUrl).headVideo
          insertVideo = JSON.parse(res.data.adUrl).insertVideo
        }
        if (headVideo) {
          this.headVideoShow = true
          this.userVideoShow = false
        }
        let tempArray = ['', '', '']
        let separator
        if (res.data.secondTitle && res.data.secondTitle.indexOf("@@@-@@@@") > -1) separator = "@@@-@@@@"
        else separator = "-"
        if (res.data.secondTitle) tempArray = res.data.secondTitle.split(separator)
        const tempArray1 = JSON.parse(res.data.cover)
        this.currentVideo = {
          ...res.data,
          headVideo,
          insertVideo,
          insertSeconds,
          secondTitle: tempArray[0],
          mainLang: tempArray[1],
          choosedCompany: tempArray[2],
          logoUrl: (tempArray1.length > 1 && tempArray1.length !== 3) ? tempArray1[tempArray1.length-1] : '',
          videoUrls: JSON.parse(res.data.videoUrls)
        }
        console.log('thios.currenvieo', this.currentVideo)
        this.langs.push(this.currentVideo.mainLang) // 所有语言列表
        if (this.currentVideo.videoUrls) {
          this.currentVideo.videoUrls.forEach(item => {
            this.langs.push(item.language)
          })
        }

        this.contentArrays = res.data.content.split('*@*')

        this.langs.forEach(item => { // 排除中文后的语言列表
          if (!this.chinesArray.some(el => {
            return el === item
          })) this.noChineseLangs.push(item)
        })

        this.isChinese = this.chinesArray.some(item => {
          return item === this.currentVideo.mainLang
        })

        if (this.isChinese || (this.langs.length === this.noChineseLangs.length)) this.voiceContent = this.contentArrays[0]
        else this.voiceContent = this.contentArrays[1]
        
        this.switchedIndex = -1
      this.currenVideoIndex = index
      if (this.currentVideo.headVideo) {
        console.log('this.currentVideo.headVideo is true', this.currentVideo)
        this.showSecondTitle = false
        this.showSynopsis = false
        this.showChangeLang = false
      } else {
        console.log('this.currentVideo.headVideo is false', this.currentVideo)
        this.showSecondTitle = true
        this.showSynopsis = true
        this.showChangeLang = true
      }

        this._getgetComments(this.currentVideo.id)
      })
    },
    async _getChannelCompany() {
      const params = {
        pageNumber: 1,
        pageSize: 1000,
        channelId: "ea43393fdec54c6d92cd55a843cf05f5",
      }
      const res = await getChannelCompany(params)
      this.channelList = res.data.list
    },
    //获取需要载入的视频信息
    getCompanyWorks (index, company) {
      this.barItemIndex = 1
      this.channelActiveIndex = index
      this.currenVideoIndex = 0
      this.isFirstLoad = true
      this.currentCompany = company
      this.companyVideos = []
      this.comapnyAlbums = []
      this.scrollFinished = false
      this.albumScrollFinished = false
      //获取公司视频
      this.$set(this.getCompanyVideosParams, 'pageNumber', 1)
      this.$set(this.getCompanyVideosParams, 'keyWord', company)
      this.handleListOnLoad()
      //获取公司专辑
      this.$set(this.getCompanyAlbumsParams, 'pageNumber', 1)
      this.$set(this.getCompanyAlbumsParams, 'synopsis', company)
      this.handleAlbumOnLoad()
    },
    //滚动获取公司视频
    handleListOnLoad() {
      console.log('this.handlelistonload')
      this.langs.splice(0, this.langs.length)
      this.noChineseLangs.splice(0, this.noChineseLangs.length)
      if (!this.scrollFinished) {
        this.scrollloading = true
        getProductByPage(this.getCompanyVideosParams).then(res => {
          let tempList = res.data.list.filter(item => (item.status==='1' || item.status==='2'))
          this.companyVideos = [...this.companyVideos, ...tempList]
          if (!this.companyVideos.length) {
            this.currentVideo = {...initCurrentVideo}
            return
          }
          if (this.isFirstLoad && this.companyVideos.length) {
            getProductDetail({id: this.companyVideos[0].id}).then(res => {
              let headVideo = ''
              let insertVideo = ''
              let insertSeconds = 0
              if (res.data.adTime && res.data.adTime != '开始' && res.data.adTime != '中间' && res.data.adTime != '结尾') {
                const tempArray = res.data.adTime.split(":")
                insertSeconds = tempArray[0] * 60 + tempArray[1] * 1
              }
              if (res.data.adUrl) {
                headVideo = JSON.parse(res.data.adUrl).headVideo
                insertVideo = JSON.parse(res.data.adUrl).insertVideo
              }
              if (headVideo) {
                this.headVideoShow = true
                this.userVideoShow = false
              }
              let tempArray = ['', '', '']
              let separator
							if (res.data.secondTitle && res.data.secondTitle.indexOf("@@@-@@@@") > -1) separator = "@@@-@@@@"
							else separator = "-"
              if (res.data.secondTitle) tempArray = res.data.secondTitle.split(separator)
              const tempArray1 = JSON.parse(res.data.cover)
              console.log('temparray1', tempArray1)
              this.currentVideo = {
                ...res.data,
                headVideo,
                insertVideo,
                insertSeconds,
                secondTitle: tempArray[0],
                mainLang: tempArray[1],
                choosedCompany: tempArray[2],
                logoUrl: (tempArray1.length > 1 && tempArray1.length !== 3) ? tempArray1[tempArray1.length-1] : '',
                videoUrls: JSON.parse(res.data.videoUrls)
              }
              this.contentArrays = res.data.content.split('*@*')

              this.langs.push(this.currentVideo.mainLang) // 所有语言列表
              if (this.currentVideo.videoUrls && this.currentVideo.videoUrls.length) {
                this.currentVideo.videoUrls.forEach(item => {
                  this.langs.push(item.language)
                })
              }

              this.langs.forEach(item => { // 排除中文后的语言列表
                if (!this.chinesArray.some(el => {
                  return el === item
                })) this.noChineseLangs.push(item)
              })

              this.isChinese = this.chinesArray.some(item => {
                return item === this.currentVideo.mainLang
              })

              if (this.isChinese || (this.langs.length === this.noChineseLangs.length)) this.voiceContent = this.contentArrays[0]
              else this.voiceContent = this.contentArrays[1]

              if (this.currentVideo.headVideo) {
                console.log('this.currentVideo.headVideo is true', this.currentVideo)
                this.showSecondTitle = false
                this.showSynopsis = false
                this.showChangeLang = false
              } else {
                console.log('this.currentVideo.headVideo is false', this.currentVideo)
                this.showSecondTitle = true
                this.showSynopsis = true
                this.showChangeLang = true
              }
              this._getgetComments(this.currentVideo.id)
            })
            this.isFirstLoad = false
          }
          this.scrollloading = false
          this.$set(this.getCompanyVideosParams, 'pageNumber', this.getCompanyVideosParams.pageNumber += 1)
          if (!res.data.hasNextPage) this.scrollFinished = true
        })
      }
    },
    //滚动获取公司专辑
    handleAlbumOnLoad() {
      if (!this.albumScrollFinished) {
        this.albumScrollloading = true
        getAlbumBykey(this.getCompanyAlbumsParams).then(res => {
          this.comapnyAlbums = [...this.comapnyAlbums, ...res.data.list]
          this.scrollloading = false
          this.$set(this.getCompanyVideosParams, 'pageNumber', this.getCompanyAlbumsParams.pageNumber += 1)
          if (!res.data.hasNextPage) this.albumScrollFinished = true
        })
      }
    },
    playLoadVideo () {
      const userVideoRef = this.$refs.userVideo
      const loadVideoRef = this.$refs.loadVideo
      if (this.currentVideo.insertVideo) {
        if (this.currentVideo.insertSeconds && (userVideoRef.currentTime > this.currentVideo.insertSeconds)) {
          userVideoRef.pause() // 原视频暂停
          this.userVideoShow = false // 影藏原视频
          this.loadVideoShow = true // 展示插播的视频
          setTimeout(() => {
            loadVideoRef.play() // 播放插播的视频
          }, 200)
        }	else if ((userVideoRef.currentTime !==0 && this.currentVideo.adTime === '开始') || ((userVideoRef.currentTime > userVideoRef.duration / 2) && this.currentVideo.adTime === '中间') || ((userVideoRef.currentTime > userVideoRef.duration - 0.1) && this.currentVideo.adTime === '结尾')) {
          userVideoRef.pause() // 原视频暂停
          // userVideoRef.muted = false
          this.userVideoShow = false // 影藏原视频
          this.loadVideoShow = true // 展示插播的视频
          setTimeout(() => {
            loadVideoRef.play() // 播放插播的视频
          }, 200)
        }
      }
    },
    initHeadVedio () {
      if (this.currentVideo.headVideo) {
        this.headVideoShow = true // 展示片头视频
        this.userVideoShow = false // 影藏原视频
        this.loadVideoShow = false // 影藏插入视频
        this.showSecondTitle = false
        this.showSynopsis = false
        this.showChangeLang = false
      }
    },
    continueUserVideo () {
      const userVideoRef = this.$refs.userVideo
      this.loadVideoShow = false // 移除插播的视频
      this.userVideoShow = true // 展示原视频
      userVideoRef.removeEventListener('timeupdate', this.playLoadVideo) // 移除原视频的监听播放插播视频事件
      userVideoRef.play() // 原视频继续播放
      this.showChangeLang = true
      this.showSecondTitle = true
      this.showSynopsis = true
    },
    addPlayListener () {
      const headVideoRef = this.$refs.headVideo
      const userVideoRef = this.$refs.userVideo
      const loadVideoRef = this.$refs.loadVideo

      headVideoRef.onended = () => {
        this.headVideoShow = false
        this.userVideoShow = true
        this.showSecondTitle = true
        this.showSynopsis = true
        this.showChangeLang = true
        userVideoRef.play()
      }
      userVideoRef.addEventListener('timeupdate', this.playLoadVideo)
      userVideoRef.onended = () => {
        // userVideoRef.muted = true
        userVideoRef.addEventListener('timeupdate', this.playLoadVideo)
        this.initHeadVedio()
        this.currenVideoIndex += 1
        if (this.companyVideos[this.currenVideoIndex]) this.getCurrentVideo (this.currenVideoIndex, this.companyVideos[this.currenVideoIndex])
      }
      loadVideoRef.onended = this.continueUserVideo
    },
  },
  mounted () {
    this._getChannelCompany()
    this.addPlayListener()
  }
}
</script>

<style scoped lang="less">
.channel-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #F2F2F2;
  .bar-container {
    width: 100%;
    height: 45px;
    background: url('../../assets/image/div_bg.png') repeat-x;
    display: flex;
    justify-content: center;
    .channel-bar {
      margin-left: 0 auto;
      width: 90%;
      height: 54px;
      overflow-y: hidden;
      overflow-x: auto;
      // background: url('../../assets/image/div_bg.png') repeat-x;
      display: flex;
      justify-content: flex-start;
      .channelActive {
        background-color: skyblue;
      }
    }
  }
  .channel-body {
    flex: 1;
    width: 1100px;
    margin: 0 auto;
    .video-box {
      display:flex;
      .video-container {
        position: relative;
        width: 788px;
        height:443px;
        // plus0_1_logo和公司
        .plus0_1_channel {
          font-size: 20px;
          color: rgb(255, 255, 255);
          position: absolute;
          top: 20px;
          left: 20px;
          // plus_logo 
          .plus_logo_show {
            display: flex;
            flex-direction: column;
            align-items: center;
            img {
              max-width: 85px;
              max-height: 60px;
            }
          }
          .plus_company_name {
            font-family: 'Microsoft YaHei';
            font-weight: bold;
            font-size: 16px;
            padding-top: 2px;
            letter-spacing: 2px;
            opacity: 0.7;
            text-align: center;
          }
        }
        // plus0_2_视频简介
        .plus_des_wrap1 {
          color: #fff;
          width: 710px;
          position: absolute;
          bottom: 70px;
          left: 40px;
          .plus_des_main1 {
            padding-left: 5px;
            font-size: 19px;
            font-weight: bold;
            text-align: left;
            height: 30px;
            line-height: 30px;
            background-image: linear-gradient(to right, rgba(230,100,26,1), rgba(230,100,26,0))
          }
          .plus_des_detail1 {
            padding-left: 5px;
            font-size: 16px;
            font-weight: bold;
            text-align: left;
            height: 24px;
            line-height: 24px;
            background-image: linear-gradient(to right, rgba(66,27,4,1), rgba(66,27,4,0))
          }
        }
        // plus0_3_语言切换
        .plus0_3_langChoose {
          outline: none;
          position: absolute;
          top: 10px;
          right: 10px;
          text-align: center;
          .plus0_3_langchooseitem { // 列表
            color: #fff;
            padding: 1px 5px 6px;
            border-radius: 5px;
            background-color: rgba(0,0,0,0.5);
            .plus0_3_langchooseitem_item {
              margin-top: 8px;
              font-size: 14px;
              opacity: 0.6;
              cursor: pointer;
            }
            .plus0_3_langchooseitem_active {
              color: coral;
            }
          }
        }
      }
    }
    .foot-into {
      width: 100%;
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .detail-content {
			font-size: 16px;
			font-family: Microsoft YaHei;
			font-weight: 400;
			color: #666666;
			line-height: 30px;
			margin-top: 40px;
      text-align: left;
		}
    // plus1评论区
    .plus1_wrap {
      margin-top: 30px;
      margin-bottom: 30px;
      // plus1_1_发表评论,只有登录才显示
      .plus1_1_warp {
        display: flex;
        justify-content: space-between;
        align-items: center;
        // plus_1_1_1_用户头像
        .plus_1_1_1__wrap {
          img {
            object-fit: cover;
            margin-top: 8px;
            width: 65px;
            height: 65px;
            border-radius: 50%;
          }
        }
        @media screen and (max-width: 700px) {
          .plus_1_1_1__wrap {
            img {
              object-fit: cover;
              margin-top: 8px;
              width: 55px;
              height: 55px;
              border-radius: 50%;
            }
          }
        }
        // plus_1_1_2_写评论区
        .plus_1_1_2_write {
          font-size: 12px;
          background-color: #f4f5f7;
          padding: 5px 10px;
          border: none;
          border-radius: 5px;
          outline-width: 1px;
          outline-color: #00888b;
        }
        // plus_1_1_3_发表评论按钮
        .plus_1_1_3_button {
          width: 65px;
          height: 65px;
          background-color: #00888b;
          color: #fff;
          outline: none;
          border: none;
          border-radius: 5px;
        }
      }
      // plus1_2_评论列表
      .plus1_2_item {
        margin-top: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #ccc;
      }
    }
    .top-container {
      margin-top: 20px;
      height: 110px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: flex-start;
      .company {
        font-size: 14px;
        color: #000;
        font-weight: bold;
        margin-right: 20px;
      }
      h1 {
        font-size: 21px;
      }
    }
    .list-container {
      width: 315px;
      height: 443px;
      background-color: #303030;
      .list-bar {
        background-color: #1e63b0;
        display: flex;
        .bar-item {
          width: 78px;
          height: 37px;
          color: #fff;
          line-height: 37px;
          font-size: 14px;
          text-align: center;
          border-right: 1px solid #303030;
          cursor: pointer;
        }
        .itemactive {
          background-color: #303030;
        }
      }
      .videos-list {
        height: 400px;
        width: 312px;
        overflow: auto;
        .notfound {
          color: #fff;
          margin-top: 100px;
          font-size: 20px;
        }
        .vidoitemactive {
          background-color: rgb(93, 95, 95);
        }
      }
    }
  }
}
</style>