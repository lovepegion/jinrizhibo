<template>
  <div class="container">
    <h1 class="top">专辑制作</h1>
    <div class="main-content">
      <div class="left">
        <!-- 作品列表 -->
        <div class="title-bar">
          <span style="flex:1">序号</span>
          <span style="flex:2">封面</span>
          <span style="flex:4">标题</span>
          <span style="flex:2">发布时间</span>
          <div style="flex:1">
            <button @click="choosedWorks=[]">清空</button>
          </div>
        </div>
        <ul
          class="list"
          v-scroll="handleListOnLoad"
          scroll-disabled="scrollloading"
          scroll-distance="20"
        >
          <li v-for="(item, index) in list" :key="item.id" class="item" :class="{'odd-bg-color':index%2}">
            <span style="flex:1">{{index + 1}}</span>
            <div style="flex:2;textAlign:center">
              <img class="img item-in" :src="(item.coverUrl[0].indexOf('http') != -1) ? item.coverUrl[0] : '/webfile'+item.coverUrl[0]" @click="toDetail(item.id)">
            </div>
            <span class="item-in item-title" style="flex:4">{{item.title}}</span>
            <span class="item-in" style="flex:2">{{item.createDate.split(' ')[0]}}</span>
            <input style="flex:1;padding:1px" type="checkbox" v-model="choosedWorks" :value="item">
          </li>
        </ul>
      </div>
      <div class="right">
        <div class="right-item-display" style="marginTop:5px">
          <span class="item-title">已选作品：</span>
          <ul class="title-string">
            <li v-for="(item,index) in choosedWorks" :key="item.id" class="choosed-item-title">
              <span>{{index+1}} - </span>
              <span style="borderBottom: 1px solid #ccc;">{{item.title}}</span>
            </li>
          </ul>
        </div>
        <div class="right-item-display">
          <span class="item-title">专辑标题：</span>
          <input type="text" v-model="albumTitle" maxlength="30" class="inputField">
        </div>
        <div class="right-item-display">
          <span class="item-title">专辑简介：</span>
          <textarea cols="30" rows="5" maxlength="100" v-model="albumDes" class="inputField" style="lineHeight:1.5"></textarea>
        </div>
        <div class="right-item-display">
          <span class="item-title">专辑封面: </span>
          <div>
              <div class="extra-tips">优质的封面有利于推荐，格式支持JPEG、PNG</div>
              <a-upload
                name="cover"
                :file-list="coverFileList"
                class="cover-upload"
                accept="image/png, image/jpeg"
                :remove="handleCoverRemove"
                :before-upload="beforeCoverUpload"
              >
                <div class="cover-upload-body">
                  <a-icon type="camera" style="font-size: 30px; margin-bottom: 8px;" />
                  <p>点击上传图片</p>
                </div>
              </a-upload>
          </div>
        </div>
        <div style="margin-top: 30px;">
          <a-button type="primary" style="margin-right: 20px;" @click="_sendAlbum" :loading="sendAlbumloading">
            {{ sendAlbumloading ? '专辑发布中' : '发布专辑' }}
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProductByUserId } from '@/api/make'
import { mapActions } from 'vuex'
import { addAlbum, getAlbum, addProductsToAlbum } from '@/api/album.js'
import { upload } from '@/api/file.js'
import { getChannelCompany } from '@/api/make'
export default {
  name: 'AlbumMake',
  data () {
    return {
      // companies: [], //虚拟电视频道下的公司
      albumId: '', //专辑id
      productList: [], //专辑中的作品列表
      formPreview: {},
      choosedWorks: [],
      pageNumber: 1,
      pageSize: 20,
      list: [], //用户作品列表
      scrollFinished: false,  // 滚动列表加载完成
      scrollloading: false,  // 滚动列表加载中
      albumTitle: '', //专辑标题
      albumDes: '', //专辑简介
      coverFileList: [], //封面
      coverUrl: '', //封面链接
      sendAlbumloading: false //发布的loading
    }
  },
  methods: {
    ...mapActions({addAlbum: 'addAlbum'}),
    handleListOnLoad() {
      if (!this.scrollFinished) {
        this.scrollloading = true
        getProductByUserId({userId: this.$store.state.userInfo.id, type: 1, pageNumber: this.pageNumber, pageSize: this.pageSize}).then(res => {
          if (res.message && res.message.code === 0) {
            let tempList = res.data.list.filter(item => (item.status==='1' || item.status==='2'))
            this.list = [...this.list, ...tempList]
            this.scrollloading = false
            this.pageNumber += 1
            if (!res.data.hasNextPage) this.scrollFinished = true
          }
        })
      }
    },
    //  获取用户作品列表
    /* _getProductByUserId() {
      const params = {
        userId: this.$store.state.userInfo.id,
				type: 1,
				pageNumber: this.pageNumber,
				pageSize: this.pageSize
      }
      getProductByUserId(params).then(res => {
        if (res.message && res.message.code === 0) {
          this.list = res.data.list
        }
      })
    }, */
    onInsertCover () {
      const logoObj = this.$refs.insertLogo.files[0]
      this.insertlogoUrl = window.URL.createObjectURL(logoObj)
      this.haslogo = true
    },
    handleCoverRemove(file) {
      const index = this.coverFileList.indexOf(file)
      const newFileList = this.coverFileList.slice()
      newFileList.splice(index, 1)
      this.coverFileList = newFileList
    },
    beforeCoverUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJpgOrPng) {
        this.$message.error('仅支持JPEG、PNG格式图片上传');
      }
      if (!isLt2M) {
        this.$message.error('上传的封面必须小于2MB!');
      } else {
        this.coverFileList = [file]
      }
      return false //不会上传到链接
    },
    toDetail (id) {
      // this.$router.push(`/product/detail/${id}`)
      let routeData = this.$router.resolve({path: `/product/detail/${id}`})
      window.open(routeData.href, '_blank')
    },
    async _sendAlbum () {
      this.sendAlbumloading = true
      if (this.choosedWorks.length === 0) this.$warning({title: '请选择作品!'})
      else if (!this.albumTitle.trim()) this.$warning({title: '请输入标题!'})
      else if (!this.albumDes.trim()) this.$warning({title: '请输入简介!'})
      else if (this.coverFileList.length === 0) this.$warning({title: '请选择封面!'})
      else {
        //获取companyId
        /* const params = {
          pageNumber: 1,
          pageSize: 1000,
          channelId: 'ea43393fdec54c6d92cd55a843cf05f5'
        }
        const { data } = await getChannelCompany(params)
        this.companies = data.list
        console.log('this.compnies', this.companies) */

        //获取封面url
        let formData = new FormData()
        formData.append('type', 5)
        formData.append('file', this.coverFileList[0])
        const res = await upload(formData)
        this.coverUrl = res.data
        // console.log('coverurl', this.coverUrl)
        
        //制作专辑
        const sendData = {
          title: this.albumTitle,
          content: this.albumDes,
          synopsis: this.$store.state.userInfo.company,
          cover: this.coverUrl,
          userId: this.$store.state.userInfo.id
        }
        const albummakres = await addAlbum(sendData)
        // console.log('albummakres', albummakres)

        //获取刚才制作的专辑
        const getres = await getAlbum({userId: this.$store.state.userInfo.id, title: this.albumTitle, content: this.albumDes, synopsis: this.$store.state.userInfo.company})
        // console.log('albumget', getres)
        this.albumId = getres.data.list[0].id

        //专辑中添加作品
        this.choosedWorks.forEach(item => {
          let tempObj = { albumId: this.albumId, productId: item.id }
          this.productList.push(tempObj)
        })
        const achiveRes = await addProductsToAlbum(this.productList)
        // console.log('achiveRes', achiveRes)
        if (achiveRes && achiveRes.message && achiveRes.message.message && achiveRes.message.message === 'success') {
          this.sendAlbumloading = false
          this.$router.push('/')
        }
      }
      this.sendAlbumloading = false
      return
    }
  },
  mounted () {
    // this._getProductByUserId()
  }
}
</script>

<style scoped lang="less">
.container {
  .top {
    padding: 20px 0;
    color: #333;
    font-size: 20px;
    text-align: left;
  }
  .main-content {
    height: 560px;
    display: flex;
    .left {
      flex: 1;
      background-color: #fff;
      .title-bar {
        padding: 5px;
        background-color: #f8f7f7;
        font-size: 14px;
        color: #000000D9;
        display: flex;
        justify-content: space-between;
      }
      .list {
        height: 100%;
        overflow: auto;
        .odd-bg-color {
          background-color: #f8f7f7;
        }
        .item {
          font-size: 14px;
          color: #000000A6;
          padding: 5px 0;
          display: flex;
          justify-content: space-around;
          align-items: center;
          .item-title {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .item-in {
            text-align: center;
            height: 50px;
            line-height: 50px;
          }
          .img {
            width: 50px;
            height: 50px;
            border-radius: 5px;
            // object-fit: contain;
          }
        }
        .item:hover {
          background-color: #eceaea;
        }
      }
    }
    .right {
      flex: 1;
      margin-left: 60px;
      font-size: 14px;
      color: #000000D9;
      .right-item-display {
        margin: 30px 10px;
        display: flex;
        justify-content: flex-start;
        .title-string {
          overflow: auto;
          text-align: left;
          height: 150px;
          width: 350px;
          padding: 5px;
          background-color: #fff;
          .choosed-item-title {
            padding: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .item-title {
          text-align: left;
          width: 100px;
          font-weight: bold;
        }
        .inputField {
          border: none;
          outline: none;
          resize: none;
          padding: 5px;
          border-radius: 5px;
          width: 350px;
          color: #2c3e50;
          font-size: 13px;
        }
        .extra-tips {
          color: #999999;
          font-size: 12px;
          text-align: left;
        }
        .cover-upload {
          display: inline-block;
          width: 100%;
          text-align: left;
          .cover-upload-body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 160px;
            height: 90px;
            color: #999999;
            background: #FAFAFA;
            border: 1px solid #E7E7E7;
            border-radius: 4px;
            margin: 10px 0;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>