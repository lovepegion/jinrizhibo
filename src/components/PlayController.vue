<template>
<div class="cover" ref="divcover" @click="onplaybutton">
  <!-- 控件部分 -->
  <div v-show="isControlsShow" class="controls" ref="divcontrols" @click="(event)=>{event.stopPropagation()}">
    <!-- 控件部分中的播放暂停状态 -->
    <div id="contPlayStatus">
      <span v-if="!isPlaying" class="iconfont icon-bofang" style="cursor: pointer" @click="onplaybutton"></span>
      <span v-else class="iconfont icon-Pause" style="cursor: pointer" @click="onplaybutton"></span>
    </div>
    <!-- 进度条 -->
    <div id="currentTime">{{currentTime}}</div>
    <input id="progressBar" type="range" name="" min="0" max="1000" v-model="currentBarvalue" @input="onProgressBar">
    <div id="duration">{{durationTime}}</div>
    <!-- 声音控制 -->
    <div id="volume">
      <input id="volumeInputRange" type="range" name="" min="0" max="100" v-model="volumeValue" @input="ontVolumeRange">
      <span v-if="volumeValue>0" class="iconfont icon-shengyintianchong" style="cursor: pointer" @click="onVolumeButton"></span>
      <span v-else class="iconfont icon-mute_fill" style="cursor: pointer" @click="onVolumeButton"></span>
    </div>
    <!-- 全屏控制 -->
    <div id="fullScreen">
      <span v-if="!isFullScreen" class="iconfont icon-quanping1" @click="fullScreen"></span>
      <span v-else class="iconfont icon-tuichuquanping" @click="nofullScreen"></span>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'PlayController',
  data () {
    return {
      isControlsShow: true, //是否显示controls
      isPlaying: false, //是否正在播放
      isFullScreen: false, //是否全屏
      volumeValue: 100, //声音大小
      volumeBeforeMute: 100, //静音前声音大小
      durationTime: '00:00:00', //视频时长
      currentTime: '00:00:00', //当前播放时长
      currentBarvalue: 0, //时间进度条
      initTimer: '', //开始时控制播放器
      phoneTimer: '',
      timer: ''
    }
  },
  props: ["targetVideo", "fullContainer", "changeLangFlag", "autoplay", "currentIndex", "isLoadBegin"],
  watch: {
    changeLangFlag(value) {
      if (this.targetVideo.paused && !this.autoplay) this.isPlaying = false
      else this.isPlaying = true
    },
    currentIndex(value) {
      this.isPlaying = true
    },
    isLoadBegin(newvalue, oldvalue) {
      if((newvalue != oldvalue) && newvalue) this.isPlaying = true
      else this.isPlaying = false
    }
  },
  methods: {
    //点击播放按钮 或 播放屏幕
    onplaybutton () {
      this.isPlaying ? this.targetVideo.pause() : this.targetVideo.play()
      this.isPlaying = !this.isPlaying
    },
    //点击声音图标
    onVolumeButton () {
      if(this.volumeValue <= 0) {
        this.volumeValue = this.volumeBeforeMute
      } else {
        this.volumeBeforeMute = this.volumeValue
        this.volumeValue = 0
      }
      this.targetVideo.volume = Number(this.volumeValue) / 100
    },
    //全屏-第一次点击屏幕时添加监视器
    fullScreen () {
      let ele = this.fullContainer
      if (ele.requestFullscreen) {
        ele.requestFullscreen();
      } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
      } else if (ele.webkitRequestFullscreen) {
        ele.webkitRequestFullscreen();
      } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
      }
    },
    //退出全屏
    nofullScreen () {
      let ele = this.fullContainer
      if(window.document.exitFullScreen) document.exitFullScreen();
      else if(window.document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if(window.document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if(ele.msExitFullscreen) ele.msExitFullscreen();
    },
    //全屏控制
    fullScreenControls () {
      this.isFullScreen=!this.isFullScreen
    },
    //监听鼠标移动的回调
    mousemoveFunc () {
      this.isControlsShow = true
      this.fullContainer.style.cursor = 'default'
      clearTimeout(this.initTimer)
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.isControlsShow = false
        let tempobj = window.document
        if (tempobj.isfullscreen || tempobj.mozFullScreen || tempobj.webkitIsFullScreen || tempobj.webkitFullScreen || tempobj.msFullScreen) {
          this.fullContainer.style.cursor = 'none'
        }
      }, 3000)
    },
    //全屏监视器
    fullScreenListener () {
      window.document.addEventListener('fullscreenchange', this.fullScreenControls)
      window.document.addEventListener('mozfullscreenchange', this.fullScreenControls)
      window.document.addEventListener('webkitfullscreenchange', this.fullScreenControls)
      window.document.addEventListener('msfullscreenchange', this.fullScreenControls)
    },
    //mounted后添加监视器
    addListener() {
      //pc端mounted中监听该全屏事件
      this.fullScreenListener()
      //鼠标移动显示controller
      this.fullContainer.addEventListener("mousemove", this.mousemoveFunc)
    },
    //格式化获取的播放器事件
    fgetTime (time) {
      let hour = Math.floor(time / 3600) < 10 ? "0" + Math.floor(time / 3600) : Math.floor(time / 3600);
      let min = Math.floor(time % 3600 / 60) < 10 ? "0" + Math.floor(time % 3600 / 60) : Math.floor(time % 3600 / 60);
      let sec = Math.floor(time % 60) < 10 ? "0" + Math.floor(time % 60) : Math.floor(time % 60);
      return hour + ":" + min + ":" + sec;
    },
    //每个一秒更新当前时间
    intervalFunc () {
      this.currentTime = this.fgetTime(this.targetVideo.currentTime)
      this.durationTime = this.fgetTime(this.targetVideo.duration)
      this.currentBarvalue = parseInt(1000 * this.targetVideo.currentTime / this.targetVideo.duration)
      if (this.currentTime >= this.durationTime) this.isPlaying = false
    },
    updateCurrentTime () {
      // this.intervalFunc()
      this.currentInterval = window.setInterval(this.intervalFunc, 1000)
    },
    //拖动进度条
    onProgressBar () {
      this.targetVideo.currentTime = this.targetVideo.duration * (this.currentBarvalue / 1000);
      this.targetVideo.play()
      this.isPlaying = true
    },
    //改变音量
    ontVolumeRange () {
      this.targetVideo.volume = Number(this.volumeValue) / 100;
    },
    //初始化视频信息
    initControls() {
      this.volumeValue = 100 //初始音量
      this.durationTime = this.fgetTime(this.targetVideo.duration)
      this.isPlaying = this.autoplay
    },
    toRemoveListener () {
      window.document.removeEventListener('fullscreenchange', this.fullScreenControls)
      window.document.removeEventListener('mozfullscreenchange', this.fullScreenControls)
      window.document.removeEventListener('webkitfullscreenchange', this.fullScreenControls)
      window.document.removeEventListener('msfullscreenchange', this.fullScreenControls)
      this.fullContainer.removeEventListener("mousemove", this.mousemoveFunc)
    }
  },
  mounted () {
    setTimeout(() => {
      this.initControls()
      this.updateCurrentTime()
      this.addListener()
      this.initTimer = setTimeout(() => {
        if(this.isPlaying === true) this.isControlsShow = false
      }, 3000)
    }, 1000);
  },
  beforeDestroy () {
    clearInterval(this.currentInterval)
    this.toRemoveListener()
  }
}
</script>

<style scoped lang="less">
.cover {
  width: 100%;
  height: 100%;
  transition: all 0.5s;
  position: absolute;
  top: 0;
  left: 0;
  .controls {
    box-sizing: content-box;
    width: 100%;
    height: 64px;
    background-image: linear-gradient(transparent, #70939b);
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    #contPlayStatus {
      margin: 0 10px;
      /* border: 1px solid red; */
    }
    #currentTime {
      // color: #52d3f0;
      color: #fff;
      font-size: 12px;
      cursor: default;
    }
    #progressBar {
      flex: 1;
      margin: 0 5px;
      /* 进度条样式 */
      -webkit-appearance: none;
      height: 5px;
      /* border: 1px solid red; */
      background-color: #eee;
      border-radius: 2.5px;
    }
    #progressBar::-webkit-slider-thumb {
      /* 进度条滑块样式 */
      -webkit-appearance: none;
      width: 12px;
      height: 12px;
      cursor: pointer;
      background: none repeat scroll 0 0 #52d3f0;
      border-radius: 6px;
    }
    #duration {
      // color: #52d3f0;
      color: #fff;
      font-size: 12px;
      cursor: default;
    }
    #volume {
      width: 20px;
      margin: 0 10px;
      /* border: 1px solid red; */
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      #volumeInputRange {
        transform-origin: 0 0;
        transform: rotate(270deg);
        -webkit-appearance: none;
        margin-left: 3px;
        width: 400%;
        height: 5px;
        background-color: #eee;
        border-radius: 2.5px;
        display: none;
      }
      #volumeInputRange::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        cursor: pointer;
        background: none repeat scroll 0 0 #52d3f0;
        border-radius: 6px;
      }
    }
    #volume:hover #volumeInputRange {
      display: block;
    }
    #fullScreen {
      margin-right: 10px;
      cursor: pointer;
    }
  }
}
</style>