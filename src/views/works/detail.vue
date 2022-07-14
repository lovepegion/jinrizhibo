<template>
  <div class="work-detail">
		<div class="detail-body-wrapper">
			<div class="detail-body">
				<h1 class="detail-title">{{ detail.title }}</h1>
				<div class="detail-info">
					<span v-show="detail.source" class="detail-info-item" style="background: #F2F2F2;">转自{{ detail.source }}</span>
					<span class="detail-info-item">{{ detail.createDate }}</span>
					<span class="detail-info-item">{{ detail.nickname }}</span>
				</div>
				<div v-if="isPhone" class="phone-info">
					<a-button type="primary" @click="doAttention(1, 1)" v-if="!detail.focusUserFlag" :disabled="detail.userId === $store.state.userInfo.id"><a-icon type="heart" />关注</a-button>
					<a-button @click="doAttention(2, 2)" v-if="detail.focusUserFlag"><a-icon type="heart" />取消关注</a-button>

					<a-button type="primary" @click="doFav(1, 1)" v-if="!collectionFlag"  :disabled="detail.userId === $store.state.userInfo.id"><a-icon type="star" />收藏</a-button>
					<a-button @click="doFav(2, 2)" v-if="collectionFlag"><a-icon type="star" />取消收藏</a-button>

					<a-button type="primary" @click="doLike(1)" v-if="!likeFlag"  :disabled="detail.userId === $store.state.userInfo.id"><span class="iconfont icon-dianzan" style="fontSize: 12px;marginRight:9px"></span><span>点赞</span></a-button>
					<a-button @click="doLike(2)" v-if="likeFlag"><span class="iconfont icon-dianzan" style="fontSize: 12px;marginRight:9px"></span><span>取消点赞</span></a-button>
				</div>
				<!-- plus0视频框 -->
				<div class="plus0_wrap1" ref="videowrap">
						<!-- plus0_1_logo和公司 -->
						<div :class="isFullScreen?'logocompanyfull':'plus0_1_channel'">
							<!-- plus_logo -->
							<div v-if="companiesOffTag.indexOf(choosedCompany)<=-1" class="plus_logo_show">
								<img v-if="logoUrl" :src="(logoUrl.indexOf('http') != -1) ? logoUrl : (baseUrl + logoUrl)">
							</div>
							<div v-else  class="plus_logo_show">
								<img v-if="logoUrl" :src="(logoUrl.indexOf('http') != -1) ? logoUrl : (baseUrl + logoUrl)">
							</div>
							<div></div>
							<!-- plus_公司 -->
							<div v-if="companiesOffTag.indexOf(choosedCompany)<=-1" class="plus_company_name">
								{{choosedCompany}}
							</div>
						</div>
						<!-- plus0_1_1片头  v-show="headVideoUrl"-->
						<video
							v-show="headVideoShow && !userVideoShow && !loadVideoShow"
							:controls="haveControls"
							:autoplay="isAlbumPlaying"
							:poster="(window.navigator.userAgent.indexOf('iPhone') > -1 || window.navigator.userAgent.indexOf('Android') > -1) ? (JSON.parse(detail.cover)[0].indexOf('http') > -1 ? JSON.parse(detail.cover)[0] : '/webfile' + JSON.parse(detail.cover)[0]) : ''"
							ref="headVideo"
							disablePictureInPicture
							controlsList="nodownload noremoteplayback"
							:src="(headVideoUrl.indexOf('http') != -1) ? headVideoUrl : (baseUrl + headVideoUrl)"
							width="100%"
							height="100%"
						>
							<source :src="(headVideoUrl.indexOf('http') != -1) ? detail.videoUrl : (baseUrl + detail.videoUrl)" type="video/mp4">
						</video>
						<!-- plus0_1_1用户视频 -->
						<!-- :poster="(window.navigator.userAgent.indexOf('iPhone') > -1) ? JSON.parse(detail.cover)[0] : ''" -->
												<!-- @loadeddata="getFirstImageCover" -->
						<video
							v-show="!headVideoShow && userVideoShow && !loadVideoShow"
							ref="userVideo"
							:controls="haveControls"
							:autoplay="isAlbumPlaying"
							:poster="(window.navigator.userAgent.indexOf('iPhone') > -1 || window.navigator.userAgent.indexOf('Android') > -1) ? (JSON.parse(detail.cover)[0].indexOf('http') > -1 ? JSON.parse(detail.cover)[0] : '/webfile' + JSON.parse(detail.cover)[0]) : ''"
							x5-video-player-type="h5"
							x5-playsinline  playsinline webkit-playsinline="true"
							disablePictureInPicture
							controlsList="nodownload noremoteplayback"
							:src="(detail.videoUrl.indexOf('http') != -1) ? detail.videoUrl : (baseUrl + detail.videoUrl)"
							width="100%"
							height="100%"
						>
							<source :src="(detail.videoUrl.indexOf('http') != -1) ? detail.videoUrl : (baseUrl + detail.videoUrl)" type="video/mp4">
						</video>
						<!-- plus0_1_2插播的视频 -->
						<video
							v-show="!headVideoShow && !userVideoShow && loadVideoShow"
							:controls="haveControls"
							ref="loadVideo"
							:src="(adUrl.indexOf('http') != -1) ? adUrl : (baseUrl + adUrl)"
							width="100%"
							height="100%"
						></video>
						<!-- <div class="fullbtn">
							<span v-if="!this.fullflag" class="iconfont icon-quanping1"></span>
							<span v-else class="iconfont icon-tuichuquanping"></span>
						</div> -->
						<!-- plus0_2_视频简介 -->
						<div :class="isFullScreen?'deswrapfull':'plus_des_wrap1'">
							<div class="plus_des_main1" v-if="secondTitle && showSecondTitle">{{secondTitle}}</div>
							<div class="plus_des_detail1" v-if="synopsis && showSynopsis">{{synopsis}}</div>
						</div>
						<!-- 自定义controller -->
						<!-- 片头控制器 -->
						<PlayController v-if="!haveControls && headVideoShow && !userVideoShow && !loadVideoShow" :targetVideo="$refs.headVideo" :fullContainer="$refs.videowrap" :autoplay="isAlbumPlaying" :currentIndex="0" :isLoadBegin="false"/>
						<!-- 用户视频控制器 -->
						<PlayController v-if="!haveControls && !headVideoShow && userVideoShow && !loadVideoShow" :targetVideo="$refs.userVideo" :fullContainer="$refs.videowrap" :autoplay="isAlbumPlaying" :changeLangFlag="changeLangFlag" :currentIndex="0" :isLoadBegin="false" @interTact="interTact"/>
						<!-- 插入视频控制器 -->
						<PlayController v-if="!haveControls && !headVideoShow && !userVideoShow && loadVideoShow" :targetVideo="$refs.loadVideo" :fullContainer="$refs.videowrap" :autoplay="false" :currentIndex="0" :isLoadBegin="isLoadBegin"/>
						<!-- plus0_3_语言切换 -->
						<div class="plus0_3_langChoose" v-if="videoUrls.length && showChangeLang">
							<!-- <select class="plus0_3_langChoose_item" v-model="switchedIndex" @change="onSwitch()" multiple>
								<option value='' disabled selected>语言切换</option>
								<option :value="-1">{{mainLang}}</option>
								<option v-for="(item, index) in videoUrls" :key="index" :value="index">{{item.language}}</option>
							</select> -->
							<ul class="plus0_3_langchooseitem">
								<!-- <li class="plus0_3_langchooseitem_title">语音切换</li> -->
								<li @click="onSwitch(-1, mainLang)" :class="[isFullScreen?'itemfull':'plus0_3_langchooseitem_item', {'plus0_3_langchooseitem_active':switchedIndex===-1}]">{{mainLang}}</li>
								<li v-for="(item, index) in videoUrls" :key="index" @click="onSwitch(index, item.language)" :class="[isFullScreen?'itemfull':'plus0_3_langchooseitem_item', {'plus0_3_langchooseitem_active':switchedIndex===index}]">{{item.language}}</li>
							</ul>
						</div>
				</div>
				<div class="detail-content">
					{{ voiceContent }}
				</div>
				<!-- plus1评论区 -->
				<div class="plus1_wrap">
					<div style="fontSize:18px;marginBottom:20px">{{comments.length}}条评论</div>
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
			<div v-if="!isPhone" class="right-info">
				<div class="user-name">{{ detail.nickname }}</div>
				<a-button type="primary" @click="doAttention(1, 1)" v-if="!detail.focusUserFlag" :disabled="detail.userId === $store.state.userInfo.id"><a-icon type="heart" />关注</a-button>
				<a-button @click="doAttention(2, 2)" v-if="detail.focusUserFlag"><a-icon type="heart" />取消关注</a-button>

				<a-button type="primary" @click="doFav(1, 1)" v-if="!collectionFlag"  :disabled="detail.userId === $store.state.userInfo.id"><a-icon type="star" />收藏</a-button>
				<a-button @click="doFav(2, 2)" v-if="collectionFlag"><a-icon type="star" />取消收藏</a-button>

				<a-button type="primary" @click="doLike(1)" v-if="!likeFlag"  :disabled="detail.userId === $store.state.userInfo.id"><span class="iconfont icon-dianzan" style="fontSize: 12px;marginRight:9px"></span><span>点赞</span></a-button>
				<a-button @click="doLike(2)" v-if="likeFlag"><span class="iconfont icon-dianzan" style="fontSize: 12px;marginRight:9px"></span><span>取消点赞</span></a-button>
				<div v-if="isAlbumPlaying" class="album-box">
					<div class="album-top">
						<div>专辑视频 <span style="color:#999999">({{playIndex+1}}/{{albumProducts.length}})</span></div>
						<div>
							<span style="color:#999999">自动连播 </span>
							<a-switch size="small" @change="onSwitchChange" default-checked></a-switch>
						</div>
					</div>
					<ul style="overflow:auto">
						<li v-for="(item, index) in albumProducts" :key="item.id" class="play-item" :class="{playactive: index === playIndex}" @click="toPlayDetail(item, index)">
							<span style="flex:1"><span v-if="index<10">0</span>{{index+1}} </span>
							<span class="play-title">{{item.title}}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// import subChannel1 from '@/assets/image/subChannel1.png'
import { mapState } from 'vuex'
import { getProductDetail, collectionProduct, follow } from "@/api/make"
import { sendComment, getComments, collectProduct, likeProduct, followProduct } from '@/api/update.js'
import { getAlbumDetail } from '@/api/album.js'
import CommentItem from '@/components/commentItem/CommentItem.vue'
import WeixinShare from '@/components/weixinshare/WeixinShare.vue'
import PlayController from '@/components/PlayController'
export default {
	name: 'Detail',
	components: { CommentItem, PlayController },
	mixins: [WeixinShare], // 包含wechatShare方法
	data() {
		return {
			companiesOffTag: ['合肥柯锐', '合肥柯锐机房设备', '霍邱融媒', '宿松融媒', '安徽天堂寨', '掌上安庆', '安庆新闻网'],
			window,
			isAlbumPlaying: false, //是否在播放专辑
			showSecondTitle: true,
			showSynopsis: true,
			showChangeLang: true,
			isPhone: false,
			isFullScreen: false, // 是否全屏
			baseUrl: process.env.VUE_APP_ZB_DOMAIN_FILE, // 播放视频的基准url
			detail: { videoUrl:'' },
			likeFlag: false, // 点赞状态
			collectionFlag: false, // 收藏状态
			comments: [], // 视频评论
			commentsShow: false, // 是否展示评论区
			commentFlag: true, // 查看/收起评论
			commentContent: '', // 评论内容
			adTime: '开始', // 视频插入位置
			insertSeconds: '', // 自定义的插入时间
			adUrl: '', // 插入非片头视频的链接
			headVideoUrl: '', // 插入的片头视频链接
			secondTitle: '', // 二级标题
			synopsis: '', // 视频简介
			showDes: false, // 是否展示简介
			switchedIndex: -1, // 选择的语种索引
			videoUrls: [], // 其他语言的语种和播放链接
			mainLang: '普通话', // 主语言名称
			logoUrl: '', // 左上角logo
			choosedCompany: '', // 选择的公司
			contentArrays: [], // 所有语种的内容表
			// isSecondChinese: '', // 次语言中是否有中文
			isChinese: '', // 主语言是不是中文
			langs: [], // 所有语言表
			switchIndex: -1, // 所选语言的index
			noChineseLangs: [], // 没有中文的语言表
			voiceContent: '', // 语音内容
			// videoCover: '', // 视频封面
			chinesArray: ['普通话', '台湾话', '东北话', '四川话', '陕西话', '广东话', '湖南话', '河南话', '山东话', '湖北话', '安徽合肥话', '内蒙古方言'],
			albumId: '', //
			playIndex: 0, // 当前播放的专辑index
			albumProducts: [], //专辑包含的作品
			autoPlay: true, //专辑自动播放
			headVideoShow: false, //展示片头视频
      userVideoShow: true, //展示用户视频
      loadVideoShow: false, //展示插入视频
			isLoadBegin: false, //是否开始播放插播视频，用于控制器切换播放按钮
			changeLangFlag: -1, //语言切换，如果页面暂停，则更改播放图标
			targetVideo:'',
			haveControls: false
		}
	},
	computed: {
		...mapState(['choosedCompanyChannel', 'userInfo'])
	},
	methods: {
		interTact () {
			this.detail.videoUrl = this.detail.videoUrl + '?ok=true'
			console.log('detailvideourl:' + this.detail.videoUrl)
		},
		toPlayDetail (item, index) {
			this.$router.push(`/product/detail/${item.id}/album/${this.albumId}/${index}`)
			window.location.reload()
		},
		onSwitchChange (checked) {
			this.autoPlay = checked
		},
		getVideoBase64 (url) {
			return new Promise(function(resolve, reject) {
					let dataURL = ''
					let video = document.createElement("video")
					// let output = document.getElementById("output")
					video.setAttribute('crossorigin', 'anonymous') //处理跨域
					video.setAttribute('src', url)
					video.setAttribute('width', 800)
					video.setAttribute('height', 450)
					video.setAttribute('controls', 'controls')
					video.currentTime = 0.1  //视频时长，一定要设置，不然大概率白屏
					video.addEventListener('loadeddata', function(e) {  
							let canvas = document.createElement("canvas")
							let width = video.width //canvas的尺寸和图片一样
							let height = video.height
							canvas.width = width
							canvas.height = height
							canvas.getContext("2d").drawImage(video, 0, 0, width, height); //绘制canvas
							dataURL = canvas.toDataURL('image/png') //转换为base64
							let img = document.createElement("img")
							img.src = canvas.toDataURL("image/png") // 获取图片的url
							// output.appendChild(img)
							resolve(dataURL)
					})
			})
		},
	/* fullscreen () {
		let videowrap = this.$refs.videowrap
		if (!this.fullflag) videowrap.requestFullscreen()
		else document.exitFullscreen()
		this.fullflag = !this.fullflag
	}, */
		onSwitch (index, lang) {
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
				if (this.detail.videoUrl.indexOf('http') != -1) userVideoRef.src = this.detail.videoUrl
				else userVideoRef.src = this.baseUrl + this.detail.videoUrl
				userVideoRef.load()
			} else {
				// 12月4日修改，已转为自己服务器连接
				if (this.detail.videoUrl.indexOf('http') != -1) userVideoRef.src = this.videoUrls[this.switchedIndex].videoUrl
				else userVideoRef.src = this.baseUrl + this.videoUrls[this.switchedIndex].videoUrl
				userVideoRef.load()
			}
			this.changeLangFlag = index
		},
		async doAttention(flag, type) {
			this._follow(flag)
			await followProduct(this.detail.id, type)
		},
		async doFav(flag, type) {
			// this._collectionProduct(flag)
			await collectProduct(this.detail.id, type)
			this.collectionFlag = !this.collectionFlag
		},
		// 点赞和取消点赞
		async doLike(type) {
			await likeProduct(this.detail.id, type)
			this.likeFlag = !this.likeFlag
		},
		_getProductDetail() {
			const params = {
				id: this.$route.params.id
			}
			getProductDetail(params).then((res) => {
				if (res.message && res.message.code === 0) {
					
					this.detail = res.data;
					if (window.innerWidth < 700) {
						/* let url = this.baseUrl + this.detail.videoUrl
						console.log('posturl', url)
						this.getVideoBase64(url).then(res => {
							this.$refs.userVideo.setAttribute('poster', res)
						})
						console.log('poster', this.videoCover[0]) */
						this.isPhone = true
						// this.$refs.userVideo.setAttribute('poster', JSON.parse(this.detail.cover)[0])
					}
					// 判断并记录自定义时间
					if (this.detail.adTime && this.detail.adTime != '开始' && this.detail.adTime != '中间' && this.detail.adTime != '结尾') {
						const tempArray = this.detail.adTime.split(":")
						this.insertSeconds = tempArray[0] * 60 + tempArray[1] * 1
					}

					this.contentArrays = this.detail.content.split('*@*')

					const tempArray = JSON.parse(this.detail.cover)

					if (tempArray.length > 1 && tempArray.length !== 3) this.logoUrl = tempArray[tempArray.length - 1] // 分离logo图片

					if (this.detail.status !== '1') {
						if (this.$store.state.userInfo.id && (this.$store.state.userInfo.id==='_3eef5c9f23ce49f1ac45c34d87897598' || this.detail.userId === this.$store.userInfo.id)) {
							this.likeFlag = res.data.likeFlag
							this.collectionFlag = res.data.collectionFlag
							// console.log('detail', this.detail)
							try {
								this.adUrl = JSON.parse(res.data.adUrl).insertVideo
								this.headVideoUrl = JSON.parse(res.data.adUrl).headVideo
							} catch (e) {
								this.adUrl = res.data.adUrl || ''
								this.headVideoUrl = ''
							}
							if (res.data.adTime) this.adTime = res.data.adTime
							if (res.data.videoUrls) {
								let tempArray = []
								// console.log(res.data.videoUrls)
								tempArray = res.data.videoUrls.match(/\{.*?\}/g)
								tempArray.forEach(el => {
									this.videoUrls.push(JSON.parse(el))
								})
								// console.log('videoUrls', this.videoUrls)
							}
							let separator
							if (this.detail.secondTitle && this.detail.secondTitle.indexOf("@@@-@@@@") > -1) separator = "@@@-@@@@"
							else separator = "-"
							const tempArray1 = this.detail.secondTitle.split(separator)
							this.secondTitle = tempArray1[0]
							this.mainLang = tempArray1[1]
							this.choosedCompany = tempArray1[2]
							this.synopsis = res.data.synopsis
						} else {
							this.$router.push('/downshelf')
						}
					} else {
						this.likeFlag = res.data.likeFlag
						this.collectionFlag = res.data.collectionFlag
						// console.log('detail', this.detail)
						if (res.data.adTime) this.adTime = res.data.adTime
						if (res.data.videoUrls) {
							let tempArray = []
							console.log(res.data.videoUrls)
							tempArray = res.data.videoUrls.match(/\{.*?\}/g)
							tempArray.forEach(el => {
								this.videoUrls.push(JSON.parse(el))
							})
							// console.log('videoUrls', this.videoUrls)
						}
						try {
							this.adUrl = JSON.parse(res.data.adUrl).insertVideo
							this.headVideoUrl = JSON.parse(res.data.adUrl).headVideo
							if (this.headVideoUrl.trim()) {
								this.headVideoShow = true
								this.userVideoShow = false
							}
						} catch (e) {
							this.adUrl = res.data.adUrl || ''
							this.headVideoUrl = ''
						}
						let separator
						if (res.data.secondTitle && res.data.secondTitle.indexOf("@@@-@@@@") > -1) separator = "@@@-@@@@"
						else separator = "-"
						const tempArray = res.data.secondTitle.split(separator)
						this.secondTitle = tempArray[0]
						this.mainLang = tempArray[1]
						this.choosedCompany = tempArray[2]
						this.synopsis = res.data.synopsis
					}
					document.title = res.data.title + '_' + (this.detail.synopsis || '') // 修改网页title
					this.langs.push(this.mainLang) // 所有语言列表
					if (this.videoUrls.length) {
						this.videoUrls.forEach(item => {
							this.langs.push(item.language)
						})
					}

					this.langs.forEach(item => { // 排除中文后的语言列表
						if (!this.chinesArray.some(el => {
							return el === item
						})) this.noChineseLangs.push(item)
					})

					this.isChinese = this.chinesArray.some(item => {
						return item === this.mainLang
					})

					if (this.isChinese || (this.langs.length === this.noChineseLangs.length)) this.voiceContent = this.contentArrays[0]
					else this.voiceContent = this.contentArrays[1]
					
					/* this.isChinese = chinesArray.some(item => {
						return item === this.mainLang
					})
					if (this.isChinese) this.commentContent = this.contentArrays[0] // 如果主语言是中文，则显示中文文本
					else { // 如果主语言不是中文
						this.isSecondChinese = this.videoUrls.some(item => {
							return chinesArray.some(el => {
								return el === item.language
							})
						})
						if (this.isSecondChinese) this.commentContent = this.contentArrays[1] // 如果次语言中还有中文
						else this.commentContent = this.contentArrays[0] // 如果次语言中没有中文
					} */
					// 手机端添加微信分享
					if (window.innerWidth < 700) {
						this.wechatShare({
							title: this.detail.title,
							desc: this.synopsis,
							img: (JSON.parse(this.detail.cover)[0].indexOf('http') != -1) ? JSON.parse(this.detail.cover)[0] : 'http://www.jrzbcloud.com/webfile' + JSON.parse(this.detail.cover)[0]
						})
					}
				}
				this.initHeadVedio()
			})
		},
		//  关注用户
		_follow(type) {
		const formData = new FormData()
		formData.append('followUserId', this.detail.userId)
		formData.append('type', type)
		follow(formData).then(res => {
			if (res.message && res.message.code === 0) {
						this.detail.focusUserFlag = type === 1 ? true : false
			}
		})
		},
			//  收藏作品
		_collectionProduct(type) {
		const formData = new FormData()
		formData.append('id', this.detail.id)
		formData.append('type', type)
		collectionProduct(formData).then(res => {
			if (res.message && res.message.code === 0) {
						this.detail.collectionFlag = type === 1 ? true : false
			}
		})
		},
		// 中间插播视频播放
		playLoadVideo () {
			this.isLoadBegin = true
			const userVideoRef = this.$refs.userVideo
			const loadVideoRef = this.$refs.loadVideo
			if (this.adUrl) {
				if (this.insertSeconds && (userVideoRef.currentTime > this.insertSeconds)) {
					userVideoRef.pause() // 原视频暂停
					// userVideoRef.style.display = 'none' // 影藏原视频
					// loadVideoRef.style.display = 'block' // 展示插播的视频
					this.userVideoShow = false // 影藏原视频
          this.loadVideoShow = true // 展示插播的视频
					setTimeout(() => {
						loadVideoRef.play() // 播放插播的视频
					}, 200)
				}	else if ((userVideoRef.currentTime !==0 && this.adTime === '开始') || ((userVideoRef.currentTime > userVideoRef.duration / 2) && this.adTime === '中间') || ((userVideoRef.currentTime > userVideoRef.duration - 0.1) && this.adTime === '结尾')) {
					userVideoRef.pause() // 原视频暂停
					// userVideoRef.muted = false
					// userVideoRef.style.display = 'none' // 影藏原视频
					// loadVideoRef.style.display = 'block' // 展示插播的视频
					this.userVideoShow = false // 影藏原视频
          this.loadVideoShow = true // 展示插播的视频
					setTimeout(() => {
						loadVideoRef.play() // 播放插播的视频
					}, 200)
				}
			}
		},
		// 插播视频结束，继续播放原视频
		continueUserVideo () {
			const userVideoRef = this.$refs.userVideo
			const loadVideoRef = this.$refs.loadVideo

			// loadVideoRef.style.display = 'none' // 移除插播的视频
			// userVideoRef.style.display = 'block' // 展示原视频
			this.loadVideoShow = false // 移除插播的视频
      this.userVideoShow = true // 展示原视频
			userVideoRef.removeEventListener('timeupdate', this.playLoadVideo) // 移除原视频的监听播放插播视频事件
			userVideoRef.play() // 原视频继续播放
			this.showChangeLang = true
			this.showSecondTitle = true
			this.showSynopsis = true
		},
		// 获取视频评论
		async onComments () {
			const { data } = await getComments(this.detail.id)
			// console.log('comments', data)
			this.comments = data.list
		},
		// 发表评论
		async onSendComment () {
			await sendComment({
				productId: this.detail.id,
				content: this.commentContent
			})
			const { data } = await getComments(this.detail.id)
			this.comments = data.list
			this.commentContent = ''
		},
		initHeadVedio () {
			if (this.headVideoUrl) {
				// const headVideo = this.$refs.headVideo
				// const userVideo = this.$refs.userVideo
				// const loadVideo = this.$refs.loadVideo
				// headVideo.style.display = 'block' // 展示片头视频
				// userVideo.style.display = 'none' // 影藏原视频
				// loadVideo.style.display = 'none' // 影藏插入视频
				this.headVideoShow = true // 展示片头视频
        this.userVideoShow = false // 影藏原视频
        this.loadVideoShow = false // 影藏插入视频
				this.showSecondTitle = false
				this.showSynopsis = false
				this.showChangeLang = false
				this.isLoadBegin = false
			}
		},
		addPlayListener () {
			const headVideoRef = this.$refs.headVideo
			const userVideoRef = this.$refs.userVideo
			const loadVideoRef = this.$refs.loadVideo

			headVideoRef.onended = () => {
				// headVideoRef.style.display = 'none'
				// userVideoRef.style.display = 'block'
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
				if (this.isAlbumPlaying && (this.playIndex < this.albumProducts.length) && this.autoPlay) {
					const nextIndex = this.playIndex + 1
					this.$router.push(`/product/detail/${this.albumProducts[nextIndex].id}/album/${this.albumId}/${nextIndex}`)
					window.location.reload()
				}
			}
			loadVideoRef.onended = this.continueUserVideo
		},
		//添加全屏监视器
		addListener () {
			window.document.addEventListener('fullscreenchange', () => {
        this.isFullScreen=!this.isFullScreen
      })
      window.document.addEventListener('mozfullscreenchange', () => {
        this.isFullScreen=!this.isFullScreen
      })
      window.document.addEventListener('webkitfullscreenchange', () => {
        this.isFullScreen=!this.isFullScreen
      })
      window.document.addEventListener('msfullscreenchange', () => {
        this.isFullScreen=!this.isFullScreen
      })
		},
		loadComments () {
			setTimeout(() => {
				this.onComments() // 载入视频评论
			}, 500)
		},
		async isAlbumPlay () {
			if (this.$route.params.isAlbum && (this.$route.params.isAlbum === 'album')) {
				this.isAlbumPlaying = true
				this.albumId = this.$route.params.albumId
				this.playIndex = Number(this.$route.params.playIndex)
				
				//获取专辑详情
				const { data: { album, productInfo: { list } }} = await getAlbumDetail({ albumId: this.albumId, pageNumber: 1, pageSize: 999 })
				this.albumInfo = album
				const https = list.map(listItem => getProductDetail({id: listItem.id}))
				const allres = await Promise.all(https)
				allres.forEach(res => this.albumProducts.push(res.data))
				console.log('orderproducts', this.albumProducts)
			}
		},
		getFirstImageCover () {
			//下两行可以解决Android微信中的封面问题
			let video = this.$refs.userVideo
			video.setAttribute("poster", JSON.parse(this.detail.cover)[0])
		},
		controlsOrNot () {
			if (window.navigator.userAgent.match(/(iPhone|iPod|Android|ios|Windows Phone)/i)) this.haveControls = true
		}
	},
	created () {
		// if (this.$route.params.hasOwnProperty('isalbum') && (this.$router.params.isalbum === 'album')) this.isAlbumPlaying = true
		this._getProductDetail()
	},
	mounted () {
		this.controlsOrNot()
		this.isAlbumPlay()
		this.addPlayListener()
		this.loadComments()
	},
	activated () {
		this.$refs.videowrap.style = ''
	}
}
</script>

<style lang="less">
.work-detail {
	height: 100%;
	max-width: 100%!important;
	text-align: left;
	margin: 0!important;
	background: #fff;
	.detail-body-wrapper {
		display: flex;
    max-width: 1000px;
    margin: 0 auto;		
    padding-bottom: 20
	}
	.detail-body {
		width: 788px;
		background: #fff;
		padding-top: 50px;
		margin-bottom: 200px;
		.detail-title {
			font-size: 34px;
			font-weight: 600;
			color: #333333;
			margin-bottom: 32px;
		}
		.detail-info {
			font-size: 14px;
			font-weight: 400;
			color: #999999;
			margin-bottom: 40px;
			.detail-info-item {
				margin-right: 20px;
			}
		}
		.detail-content {
			font-size: 16px;
			font-family: Microsoft YaHei;
			font-weight: 400;
			color: #666666;
			line-height: 30px;
			// margin-top: 40px;
		}
	}
	.right-info {
    padding-top: 50px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
		position: relative;
		.album-box {
			width: 200px;
			height: 375px;
			border-radius: 10px;
			padding: 5px;
			background-color: #f4f4f4;
			.album-top {
				font-size: 12px;
				height: 16px;
				line-height: 16px;
				display: flex;
				justify-content: space-between;
			}
			.play-item {
				margin-top: 5px;
				height: 26px;
				line-height: 26px;
				font-size: 12px;
				color: #212121;
				display: flex;
				justify-content: space-between;
				.play-title {
					flex: 10;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
			.play-item:hover {
				background-color: #fff;
				cursor: pointer;
			}
			.playactive {
				color: #03a0d6;
				background-color: #fff;
			}
		}
		.user-name {
			font-size: 16px;
			font-weight: 600;
			margin: 10PX 0;
		}
		.ant-btn {
			margin: 8px 0;
		}
	}
	.phone-info {
		transform: scale(0.7);
		margin-top: -40px;
		margin-bottom: 5px;
		margin-left: -62px;
    display: flex;
		position: relative;
		button {
			margin-left: 5px;
		}
	}
}
// plus0视频框
.plus0_wrap1 {
	position: relative;
		video {
			object-fit: cover;
			object-position: center center;
		}
		/* video::-webkit-media-controls-fullscreen-button {
			appearance: none;
		}
		.fullbtn {
			cursor: pointer;
			color: #fff;
			position: absolute;
			bottom: 10%;
			right: 8%;
		} */
		// plus0_1_logo和公司
		.plus0_1_channel {
			font-size: 20px;
			color: rgb(255, 255, 255);
			position: absolute;
			top: 25px;
			left: 25px;
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
		//全屏样式
		.logocompanyfull {
			font-size: 20px;
			color: rgb(255, 255, 255);
			position: absolute;
			top: 25px;
			left: 25px;
			// plus_logo 
			.plus_logo_show {
				display: flex;
				flex-direction: column;
				align-items: center;
				img {
					max-width: 200px;
					max-height: 120px;
				}
			}
			.plus_company_name {
				font-family: 'Microsoft YaHei';
				font-weight: bold;
				font-size: 26px;
				padding-top: 2px;
				letter-spacing: 2px;
				opacity: 0.7;
				text-align: center;
			}
		}
		// plus0_2_视频简介
		.plus_des_wrap1 {
			color: #fff;
			width: 90%;
			position: absolute;
			bottom: 15%;
			left: 5%;
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
		//全屏是简介样式
		.deswrapfull {
			color: #fff;
			width: 90%;
			position: absolute;
			bottom: 15%;
			left: 5%;
			.plus_des_main1 {
				padding-left: 8px;
				font-size: 24px;
				font-weight: bold;
				text-align: left;
				height: 40px;
				line-height: 40px;
				background-image: linear-gradient(to right, rgba(230,100,26,1), rgba(230,100,26,0))
			}
			.plus_des_detail1 {
				padding-left: 8px;
				font-size: 20px;
				font-weight: bold;
				text-align: left;
				height: 30px;
				line-height: 30px;
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
				/* .plus0_3_langchooseitem_title {
					background-color: coral;
					font-size: 16px;
					opacity: 0.5;
					padding: 3px;
					border-radius: 5px;
				} */
				.plus0_3_langchooseitem_item {
					margin-top: 8px;
					font-size: 14px;
					opacity: 0.6;
					cursor: pointer;
				}
				.itemfull {
					margin-top: 8px;
					font-size: 20px;
					opacity: 0.6;
					cursor: pointer;
				}
				.plus0_3_langchooseitem_active {
					color: coral;
				}
			}
		}
}
@media screen and (max-width: 700px) {
	.work-detail .detail-body {
		padding: 10px;
		.detail-title {
			font-size: 20px;
		}
	}
	.work-detail .right-info {
		display: none;
	}
	.plus0_3_langChoose {
		transform: scale(0.7);
		top: 1%;
		right: 1%;
	}
	.plus0_wrap1 .plus0_1_channel {
		transform: scale(0.6);
		top: 2%;
		left: 1%;
	}
	.plus0_wrap1 .plus_des_wrap1 {
		transform: scale(0.5);
		bottom: 10%;
		left: -18%;
	}
}
// plus1评论区
.plus1_wrap {
	margin-top: 30px;
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

</style>