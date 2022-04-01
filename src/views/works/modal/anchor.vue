<template>
  <a-modal
    :visible="visible"
    title="更换主播"
    centered
    :width="1107"
    @cancel="visible = false"
  >
    <template slot="footer">
      <div class="modal-footer">
        <a-button key="submit" type="primary" @click="handleOk">
          保存
        </a-button>
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
      </div>
    </template>
    <div class="anchor-modal-body">
      <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" class="anchor-modal-left">
        <a-form-model-item label="主播选择" :labelCol="{span: 24}">
          <div class="anchor-selector">
            <a-icon type="left" class="anchor-selector-arrow anchor-selector-arrow-left" @click="anchorPrev" />
            <swiper class="swiper anchor-selector-list" ref="swiper" :options="swiperOptions">
              <swiper-slide>
                <li class="anchor-selector-item" :class="{'anchor-selector-item-active': form.activeAnchor === 38}" @click.prevent="checkAnchor(38)">
                  <img :src="anchor0" alt="anchor1" class="anchor-img">
                </li>
              </swiper-slide>
              <swiper-slide>
                <li class="anchor-selector-item" :class="{'anchor-selector-item-active': form.activeAnchor === 10008}" @click.prevent="checkAnchor(10008)">
                  <img :src="anchor1" alt="anchor1" class="anchor-img">
                </li>
              </swiper-slide>
              <swiper-slide>
                <li class="anchor-selector-item" :class="{'anchor-selector-item-active': form.activeAnchor === 42}" @click.prevent="checkAnchor(42)">
                  <img :src="anchor2" alt="anchor1" class="anchor-img">
                </li>
              </swiper-slide>
            </swiper>
            <a-icon type="right" class="anchor-selector-arrow anchor-selector-arrow-right" @click="anchorNext" />
          </div>
        </a-form-model-item>
        <a-form-model-item label="主播位置">
          <a-radio-group v-model="form.position" @change="handlePositionChange">
            <a-radio :value="'-100'" v-if="form.curBgSize.id === 0 || form.curBgSize.id === 1">
              居左
            </a-radio>
            <a-radio :value="'0'">
              居中
            </a-radio>
            <a-radio :value="'100'" v-if="form.curBgSize.id === 0 || form.curBgSize.id === 1">
              居右
            </a-radio>
            <a-radio :value="'custom'" v-if="form.curBgSize.id === 0 || form.curBgSize.id === 1" >
              自定义
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="主播表情">
          <a-radio-group v-model="form.bq">
            <a-radio :value="1">
              中立
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="主播声音">
          <a-radio-group v-model="form.sy">
            <a-radio :value="1">
              中立
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="画面机位">
          <a-radio-group v-model="form.jw">
            <a-radio :value="1">
              正机位
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="主播姿态"  v-if="form.curBgSize.id === 0 || form.curBgSize.id === 1">
          <a-radio-group v-model="form.zt">
            <a-radio :value="1">
              默认
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :labelCol="{span: 24}">
          <template slot="label">
            <div class="modal-anchor-background-label" v-on:click.prevent>
              <span>形象背景</span>
              <!-- 11月26日修改，不允许上传视频背景 -->
              <a-upload
                name="file"
                :showUploadList="false"
                :file-list="fileList"
                :before-upload="beforeBgUpload"
                :customRequest="handleBgUpload"
                accept="image/png, image/jpeg"
              >
                <a-button class="upload-text" :loading="uploading" :disabled="uploading">本地上传</a-button>
              </a-upload>
            </div>
          </template>
          <div class="anchor-selector">
            <a-icon type="left" class="anchor-selector-arrow anchor-selector-arrow-left" @click="prev" />
            <swiper class="swiper anchor-selector-list" ref="mySwiper" :options="swiperOptions">
              <swiper-slide>
                <li class="anchor-selector-item" :class="{'anchor-selector-item-active': activeBg === -1}" @click.prevent="checkBg(-1)">
                  <img :src="defaultBg" alt="anchor1" class="anchor-img">
                </li>
              </swiper-slide>
              <swiper-slide v-for="(item, index) in bgOptions" :key="item.id">
                <!-- 11月16日加入删除背景图 -->
                <li class="anchor-selector-item" :class="{'anchor-selector-item-active': activeBg === index}" @click.prevent="checkBg(index)">
                  <span class="deletebg" @click="deletebgphoto(item.id,index,item.url,$event)">X</span>
                  <img v-if="item.url.indexOf('.mp4') === -1" :src="item.url" alt="anchor1" class="anchor-img">
                  <video v-else :src="item.url"  class="anchor-img"></video>
                </li>
              </swiper-slide>
            </swiper>
            <a-icon type="right" class="anchor-selector-arrow anchor-selector-arrow-right" @click="next" />
          </div>
        </a-form-model-item>
      </a-form-model>
      <div class="anchor-modal-right">
        <div class="anchor-modal-right-container">
          <div v-if="form.curSelectBg && form.curSelectBg.indexOf('.mp4') !== -1" class="anchor-modal-right anchor-modal-right-video">
            <video :src="form.curSelectBg" class="anchor-video-bg" autoplay loop muted></video>
            <img :src="form.curSelectAnchor" draggable class="draggable-anchor" :style="anchorPosition">
          </div>
          <div v-else class="anchor-modal-right" :style="{backgroundImage: 'url(' + (form.curSelectBg ? form.curSelectBg : defaultBg) + ')', width: form.curBgSize.width}">
            <img :src="form.curSelectAnchor" draggable class="draggable-anchor" :style="anchorPosition">
          </div>
          <div class="anchor-modal-right-bg-size">
            <a-dropdown>
              <span  @click="e => e.preventDefault()">
                <a-icon type="down" /> {{ form.curBgSize.label }}
              </span>
              <a-menu slot="overlay">
                <a-menu-item v-for="item in bgSizeOptions" :key="item.id" @click="handleSelectBgSize">
                  <span>{{ item.label }}</span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
        <div class="anchor-modal-right-tips">
          <p>背景图片建议按照比例16:9，9:16，4:3，3:4，2:3效果最佳</p>
          <p>背景视频须严格按照比例上传</p>
          <p>比例对照表：16:9（1920:1080、1280:720、856:480），9:16（1080:1920、720:1280、480:856），4:3（1920:1080、960:720、640:480），3:4（1080:1440、720:960、480:640），2:3（1080:1620、720:1080、480:720）</p>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script>
import anchor0 from '@/assets/image/anchor0.png'
import anchor1 from '@/assets/image/anchor1.png'
import anchor2 from '@/assets/image/anchor2.png'
import defaultBg from '@/assets/image/background-green.png'
import interact from 'interactjs'
import { getFileInfoByUserId } from '@/api/make'
import { upload, judgeProportion } from '@/api/file'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import { getMaterialResolution } from '@/utils/utils'
import { deletebg } from '@/api/update.js'

export default {
  name: 'Anchor',
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    initForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      anchor0,  //  默认主播形象
      anchor1,  //  内置主播形象1
      anchor2,  //  内置主播形象2
      defaultBg,  //  默认形象背景
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      visible: false,
      form: {
        position: '0',
        bq: 1,
        sy: 1,
        jw: 1,
        zt: 1,
        activeAnchor: 38,
        curSelectAnchor: anchor0, //  当前选择主播
        curSelectAnchorText: '小璇',
        curSelectBg: null,  //  当前选择背景
        curBgSize: {  //  当前选择背景尺寸
          id: 0,
          label: '16:9',
          width: '602px',
          w: 1920,
          h: 1080,
        },
      },
      activeBg: -1,
      interact: null,
      bgOptions: [],  //  接口背景选项
      fileList: [], //  背景图片文件上传列表
      uploading: false, //  文件上传中
      swiperOptions: {
        slidesPerView: 3,
        spaceBetween: 10,
        slidesPerGroup: 3,
      },
      bgSizeOptions: [
        {
          id: 0,
          label: '16:9',
          width: '602px',
          w: 1920,
          h: 1080,
        },
        {
          id: 1,
          label: '4:3',
          width: '452px',
          w: 1440,
          h: 1080,
        },
        {
          id: 2,
          label: '9:16',
          width: '191px',
          w: 1080,
          h: 1920,
        },
        {
          id: 3,
          label: '3:4',
          width: '254px',
          w: 1080,
          h: 1440,
        },
        {
          id: 4,
          label: '2:3',
          width: '226px',
          w: 1080,
          h: 1620,
        },
      ]
    }
  },
  computed: {
    anchorPosition() {
      return `transform:translateX(${this.form.position + 'px'})`
    },
  },
  mounted() {
    let _this = this
    this._getFileInfoByUserId(6)
    const position = { x: 0, y: 0 }
    this.interact = interact('.draggable-anchor').draggable({
      enabled: false,
      startAxis: 'x',
      lockAxis: 'x',
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ],
      listeners: {
        start (event) {
        },
        move (event) {
          position.x += event.dx
          position.y += event.dy
          event.target.style.transform = `translate(${position.x}px, ${position.y}px)`
          _this.form.position = position.x
        },
      },
    })
  },
  methods: {
    // 11月16日加入删除视频背景图片
    async deletebgphoto (id, index, bgurl, event) {
      event.stopPropagation()
      console.log('form.curSelectBg', this.form.curSelectBg)
      let check = window.confirm('确认删除该背景吗？')
      if (check) {
        const res = await deletebg(id)
        if(res.message.status === 200) {
          this.bgOptions.splice(index,1)
          this.$message.success('删除背景成功！')
          if (this.form.curSelectBg === bgurl) this.form.curSelectBg = null
        }
        else this.$message.error('删除失败，请稍后重试！')
      }
    },
    open(data) {
      this.visible = true
      if (data) {
        this.form = Object.assign({}, this.initForm)
      }
    },
    close() {
      this.visible = false
    },
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      this.visible = false
      this.$emit('saveBack', this.form)
    },
    handlePositionChange(e) {
      if (e.target.value !== 'custom') {
        this.interact.options.drag.enabled = false
        this.form.position = e.target.value
      } else {
        this.interact.options.drag.enabled = true
      }
    },
    handleSelectBgSize(e) {
      this.form.curBgSize = this.bgSizeOptions[e.key]
      if (e.key !== 0 || e.key !== 1) {
        this.form.position = 0
      }
      this.bgOptions = []
      this.form.curSelectBg = null
      this._getFileInfoByUserId(6)
    },
    //  选择主播形象
    checkAnchor(val) {
      this.form.activeAnchor = val
      if (val === 38) {
        this.form.curSelectAnchor = anchor0
        this.form.curSelectAnchorText = '小璇'
      } else if (val === 10008) {
        this.form.curSelectAnchor = anchor1
        this.form.curSelectAnchorText = '小露'
      } else {
        this.form.curSelectAnchor = anchor2
        this.form.curSelectAnchorText = '一锋'
      }
    },
    //  选择背景
    checkBg(index) {
      if (index !== -1) {
        this.activeBg = index
        this.form.curSelectBg = this.bgOptions[index].url
      } else {
        this.activeBg = -1
        this.form.curSelectBg = null
      }
    },
    anchorPrev() {
      // this.$refs.swiper.$swiper.slidePrev()
    },
    anchorNext() {
      // this.$refs.swiper.$swiper.slideNext()
    },
    prev() {
      this.$refs.mySwiper.$swiper.slidePrev()
    },
    next() {
      this.$refs.mySwiper.$swiper.slideNext()
    },
    _getFileInfoByUserId(type) {
      const params = { 
        type,
        proportionType: this.form.curBgSize.id
      }
      getFileInfoByUserId(params).then(res => {
        if (res.message && res.message.code === 0) {
          this.bgOptions = res.data.list || []
          this.bgOptions.forEach(el => {
            el.url = '/webfile' + el.url
          })
        }
      })
    },
    beforeBgUpload(file) {
      // this.fileList = [...this.fileList, file]
      this.fileList = [file] //一次上传一张
    },
    //  上传背景图片 11月20日修改-只允许上传图片
    handleBgUpload(file) {
      // const isJpgOrPngOrVideo = file.file.type === 'image/jpeg' || file.file.type === 'image/png' || file.file.type === 'video/mp4'
      const isJpgOrPngOrVideo = file.file.type === 'image/jpeg' || file.file.type === 'image/png'
      const isVideo = file.file.type === 'video/mp4'
			const isLt20M = file.file.size / 1024 / 1024 < 20
      if (!isJpgOrPngOrVideo) {
        // this.$message.error('仅支持JPEG、PNG格式图片及MP4格式视频上传')
        this.$message.error('仅支持JPEG、PNG格式图片')
        return false
      }
			if (!isLt20M) {
        this.$message.error('文件大小必须小于20M')
        return false
      }
      this.uploading = true
      // 11月26日修改，不允许上传视频
      getMaterialResolution(file, (width, height) => {
        if (isVideo) {
          return false
          /* const formDataCheck = new FormData()
          formDataCheck.append('proportionType', this.form.curBgSize.id)
          formDataCheck.append('width', width)
          formDataCheck.append('height', height)
          judgeProportion(formDataCheck).then(res => {
            if (res.message && res.message.code === 50006 && res.data) {
              this.$message.error(res.data)
              this.uploading = false
            } else {
              const { fileList } = this
              const formData = new FormData()
              formData.append('type', 6)
              formData.append('proportionType', this.form.curBgSize.id)
              fileList.forEach(file => {
                formData.append('file', file)
              })
              formData.append('width', width)
              formData.append('height', height)
              upload(formData).then(res => {
                if (res.data && res.message && res.message.code === 0) {
                  this._getFileInfoByUserId(6)
                  this.form.curSelectBg = null
                  this.activeBg = -1
                  this.$message.success('上传成功')
                }
                this.uploading = false
              })
            }
          }) */
        } else {
          const { fileList } = this
          const formData = new FormData()
          formData.append('type', 6)
          formData.append('proportionType', this.form.curBgSize.id)
          fileList.forEach(file => {
            formData.append('file', file)
          })
          formData.append('width', width)
          formData.append('height', height)
          upload(formData).then(res => {
            if (res.data && res.message && res.message.code === 0) {
              this._getFileInfoByUserId(6)
              // this.form.curSelectBg = null
              this.activeBg = -1
              this.$message.success('上传成功')
            }
            this.uploading = false
          })
        }
      })
    },
  },
}
</script>

<style lang="less">
.anchor-modal-body {
  display: flex;
  position: relative;
  .anchor-modal-left {
    width: 455px;
    padding-right: 20px;
    .anchor-selector {
      display: flex;
      align-items: center;
      .anchor-selector-list {
        display: flex;
        flex: 1;
        .anchor-selector-item {
          width: 72px;
          height: 60px;
          border-radius: 4px;
          background: #3f6e56;
          margin: 0 9px;
          position: relative;
          // 11月16日加入删除背景图片button
          .deletebg {
            padding: 0;
            color: #fff;
            background-color: coral;
            cursor: pointer;
            height: 15px;
            width: 15px;
            line-height: 15px;
            text-align: center;
            display: none;
            position: absolute;
            z-index: 1;
            top: 0;
            right: 0;
          }
          .anchor-img {
            width: 100%;
            height: 100%;
          }
          &:hover {
            border-color: #E4373A;
          }
        }
        .anchor-selector-item:hover {
          border: 1px solid coral;
        }
        .anchor-selector-item:hover .deletebg {
          display: unset;
        }
        .anchor-selector-item-active {
          border: 2px solid #E4373A!important;
        }
      }
      .anchor-selector-arrow {
        width: 40px;
        height: 40px;
        font-size: 40px;
        color: #b6b6b6;
        cursor: pointer;
      }
    }
  }
  .anchor-modal-right-container {
    position: relative;
    display: flex;
    justify-content: center;
    background: #00789c;
    width: 604px;
    height: 339px;
    .anchor-modal-right {
      width: 604px;
      height: 339px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      position: relative;
      display: flex;
      justify-content: center;
      z-index: 99;
      img {
        width: 200px;
        position: absolute;
        bottom: 0;
      }
    }
    .anchor-modal-right-bg-size {
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.25);
      color: #fff;
      padding: 4px 10px;
      border-bottom-right-radius: 5px;
      cursor: pointer;
      z-index: 1000;
    }
  }
  .anchor-modal-right-tips {
    padding: 20px 0;
    font-size: 12px;
    color: #9e9e9e;
    width: 604px;
    line-height: 20px;
  }
}
.modal-anchor-background-label {
  display: flex;
  justify-content: space-between;
  .upload-text {
    color: #666666;
    font-size: 12px;
    background: #EDEDED;
    cursor: pointer;
    border-radius: 2px;
    height: 24px;
    padding: 0 5px;
  }
}
.ant-dropdown-menu {
  border-radius: 2px;
}
</style>