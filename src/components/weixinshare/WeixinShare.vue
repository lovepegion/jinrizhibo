<template>
  <div></div>
</template>

<script>
const wx = require('weixin-js-sdk')
import sha1 from 'sha1'
import { getwxticket } from '@/api/update.js'
export default {
  name: 'WeixinShare',
  methods: {
    wechatShare(info) {
      const that = this
      // 判断苹果手机
      let _url = ''
      if (window.__wxjs_is_wkwebview === true) {
        _url = window.location.href.split('#')[0] || window.location.href
      } else {
        _url = window.location.href
      }
      console.log('_url', _url)
      //这里是封装的axios，换成任意请求皆可
      getwxticket().then(res => {
        let ticket = res.data
        let noncestr = Math.random().toString(36).substr(2, 15)
        let timestamp = parseInt(new Date().getTime() / 1000) + ''
        let tempstr = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp='+ timestamp +'&url=' + _url
        let signature = sha1(tempstr)
        wx.config({
          debug: false,
          appId: 'wx27e042ce1bd4eddd', // 必填，公众号的唯一标识
          timestamp: timestamp, // 必填，生成签名的时间戳
          nonceStr: noncestr, // 必填，生成签名的随机串
          signature: signature, // 必填，签名，见附录1
          jsApiList: [
            'previewImage',
            'hideAllNonBaseMenuItem',
            'showMenuItems',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'chooseWXPay'
          ] // 必填，需要使用的 JS 接口列表，所有JS接口列表见附录2
        })  
      })
     
      wx.ready(() => {
        const share_title = info.title
        const share_desc = info.desc
        const share_link = _url
        const share_img = info.img
        // wx.showOptionMenu()
        wx.onMenuShareTimeline({
          title: share_title, // 分享标题
          link: share_link, // 分享链接
          imgUrl: share_img, // 分享图标           
        })
        wx.onMenuShareAppMessage({
          title: share_title, // 分享标题
          desc: share_desc, // 分享描述
          link: share_link, // 分享链接
          imgUrl: share_img, // 分享图标          
        })
      }) 
    }
  }
}
</script>

<style>

</style>