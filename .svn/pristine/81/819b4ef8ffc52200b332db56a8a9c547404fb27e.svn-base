<template>
  <a-modal
    :visible="visible"
    title="更换音乐"
    centered
    :width="745"
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
    <div class="modal-music-body">
      <a-upload
        action=""
        list-type="picture"
        :default-file-list="musicFileList"
        class="upload-list-inline"
      >
        <a-button>本地上传</a-button>
      </a-upload>
    </div>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      musicFileList: [],
    }
  },
  methods: {
    open() {
      this.visible = true
    },
    close() {
      this.visible = false
    },
    handleCancel() {},
    handleOk() {},
  },
}
</script>

<style>

</style>