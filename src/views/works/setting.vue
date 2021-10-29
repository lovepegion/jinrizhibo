<template>
  <div class="make-setting">
    <h1>作品设置</h1>
    <div class="make-setting-body">
      <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" labelAlign="left">
        <a-form-model-item label="视频格式">
          <a-radio-group v-model="form.format">
            <a-radio :value="'mp4'">
              mp4
            </a-radio>
            <a-radio :value="'avi'">
              avi
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="视频分辨率">
          <a-radio-group v-model="form.ratio">
            <a-radio :value="'1080'">
              1080p
            </a-radio>
            <a-radio :value="'720'">
              720P
            </a-radio>
            <a-radio :value="'480'">
              480p
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="视频码率">
          <a-radio-group v-model="form.quality">
            <a-radio :value="0">
              默认
            </a-radio>
            <a-radio :value="1">
              高
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="视频字幕">
          <a-radio-group v-model="form.subtitles">
            <a-radio :value="0">
              无
            </a-radio>
            <a-radio :value="1">
              有
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
      <p style="color: #999999; text-align: left;">*为保障视频播放效果，分辨率推荐如下，电视大屏为：1080P，手机为：720P。</p>
      <div class="make-setting-footer">
        <a-button key="submit" type="primary" @click="saveBack">
          保存并返回制作
        </a-button>
        <a-button key="back" @click="toBack" style="margin-left: 20px">
          返回
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    initForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      labelCol: { span: 3 },
      wrapperCol: { span: 12 },
      form: {
        format: 'mp4',
        ratio: '1080',
        quality: 0,
        subtitles: 0,
      },
    }
  },
  methods: {
    saveBack() {
      this.$emit('saveBack', this.form)
    },
    toBack() {
      this.$emit('saveBack')
    },
    doInitForm() {
      this.form = Object.assign({}, this.initForm)
    },
  },
}
</script>

<style lang="less">
.make-setting {
  .make-setting-body {
    height: 646px;
    background: #FFFFFF;
    box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 5%);
    padding: 31px;
    .ant-form-item-control {
      text-align: left;
    }
    label.ant-radio-wrapper {
      width: 80px;
    }
    .make-setting-footer {
      text-align: left;
      margin-top: 51px;
    }
  }
}
</style>