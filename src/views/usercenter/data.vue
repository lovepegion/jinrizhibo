<template>
  <div class="usercenter-data">
		<a-tabs @change="tabChange" :activeKey="activeKey">
      <a-tab-pane :key="1" tab="个人资料">
        <div class="my-data-head">
          <div class="avatar-box">
            <div class="avatar-cover" @click="editAvatar">修改头像</div>
            <img :src="avartarUrl" alt="avatar" class="avatar">
          </div>
          <div class="user-name">{{ userInfo.nickname }}</div>
        </div>
        <h2 class="base-data">基本信息</h2>
        <a-form-model :model="userInfo" :label-col="labelCol" :wrapper-col="wrapperCol" labelAlign="left">
          <a-form-model-item label="用户昵称">
            <a-input v-model="userInfo.nickname" disabled />
          </a-form-model-item>
          <a-form-model-item label="手机号">
            <a-input v-model="userInfo.phoneNumber" disabled />
          </a-form-model-item>
          <a-form-model-item label="用户等级">
            <a-input v-model="levelText" disabled />
          </a-form-model-item>
        </a-form-model>
        <div class="product-auth" v-if="!this.$store.state.userInfo.company">
          <div class="product-title">视频制作权限:</div>
          <div class="product-expire">
            <span>月卡期限：<span>{{memberExpire}}</span></span>
            <span>次卡剩余：{{$store.state.userInfo.publishTime}}次</span>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane :key="2" tab="单位资料">
        <div v-if="userInfo.checkFlag == '0'" class="company-cert-none">
          还没有认证，立即去 <a @click="toCert">认证</a>
        </div>
        <div v-else class="company-cert-info">
          <h2 class="base-data">基本信息</h2>
            <a-form-model ref="certInfo" :model="certInfo" :label-col="labelCol" :rules="rules" :wrapper-col="wrapperCol" labelAlign="left">
              <a-form-model-item label="单位名称" prop="company">
                <a-input v-model="certInfo.company" :disabled="certInfo.companyEditable" style="width: 70%;" />
                <a v-if="certInfo.companyEditable && userInfo.checkFlag === '2'" @click="certInfo.companyEditable = false"  class="edit-btn">修改</a>
                <a v-if="!certInfo.companyEditable && userInfo.checkFlag === '2'" @click="handleCertNameUpdate" class="edit-btn">保存</a>
                <a v-if="!certInfo.companyEditable && userInfo.checkFlag === '2'" @click="certInfo.companyEditable = true" class="edit-btn" style="color: #9a9a9a;">取消</a>
              </a-form-model-item>
              <a-form-model-item label="营业执照" class="edit-avatar-modal-form-cert">
                <img :src="certUrl" alt="company" style="width: 200px;">
                <a-upload
                  action=""
                  list-type="picture"
                  class="upload-list-inline"
                  :before-upload="beforeCertUpload"
                  :custom-request="handleCertUpload"
                  accept="image/png, image/jpeg"
                  :showUploadList="false"
                  v-if="userInfo.checkFlag !== '3'"
                >
                  <a class="edit-avatar-modal-upload"><a-icon type="loading" v-show="updateCertLoading" /> 重新上传</a>
                </a-upload>
              </a-form-model-item>
              <a-form-model-item label="审核状态">
                <span>{{ certStatus }}</span>
                <p v-if="userInfo.checkFlag === '2'">【审核失败原因】 <span style="color: #aaa;">{{ certReason }}</span></p>
              </a-form-model-item>
            </a-form-model>
        </div>
      </a-tab-pane>
    </a-tabs>
    <a-modal
      :visible="avatarVisible"
      title="上传头像"
      centered
      :width="360"
      @cancel="avatarVisible = false"
    >
      <template slot="footer">
        <div class="modal-footer">
          <a-button key="submit" type="primary" @click="handleAvatarOk" :loading="sending">
            保存
          </a-button>
          <a-button key="back" @click="handleAvatarCancel">
            取消
          </a-button>
        </div>
      </template>
      <div class="edit-avatar-modal">
        <img :src="editAvartarUrl" alt="avatar" class="edit-avatar-modal-image" />
        <a-upload
          action=""
          list-type="picture"
          class="upload-list-inline"
          :before-upload="beforeUpload"
          accept="image/png, image/jpeg"
          :showUploadList="false"
        >
          <a class="edit-avatar-modal-upload">重新上传</a>
        </a-upload>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { editHeadImage, updateCompanyInfo } from '@/api/user'
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  props: {
    userInfo: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    memberExpire () {
      if (this.$store.state.userInfo.memberExpire) {
        const d = new Date(this.$store.state.userInfo.memberExpire)
        return d.toLocaleString()
      }
      return '您未充值月卡!'
    },
    levelText: function() {
      switch (this.userInfo.level) {
        case '1': 
          return '普通用户'
        case '2': 
          return '认证单位用户'
        case '3': 
          return '单位内部用户'
        default:
          return '普通用户'
      }
    },
    certStatus: function() {
      switch (this.userInfo.checkFlag) {
        case '0': 
          return '认证未上传'
        case '1': 
          return '认证已上传，待审核'
        case '2': 
          return '审核未通过'
        case '3': 
          return '审核通过'
        case '4': 
          return '待重新审核'
        default:
          return '审核通过'
      }
    },
    certReason: function() {
      return this.userInfo.checkReason
    },
  },
  data() {
    return {
      activeKey: 1,
      labelCol: { span: 3 },
      wrapperCol: { span: 12 },
      form: {
        nickname: '',
        phoneNumber: '',
        level: 1,
      },
      certInfo: {
        company: this.userInfo.company,
        companyEditable: true,
      },
      avatarVisible: false,
      avatarChangeFlag: false,
      fileList: [],
      avartarUrl: '/webfile' + this.userInfo.headImage,
      certUrl: '/webfile' + this.userInfo.companyLicense,
      updateCertFile: '',
      editAvartarUrl: '',
      sending: false,
      updateCertLoading: false,
      rules: {
				company: [
					{ required: true, message: '请输入单位名称', },
					{ min: 1, max: 50, message: '名称长度应该在1到50之间', trigger: 'blur' },
				],
				fileList: [
					{ required: true, message: '请上传营业执照', }
				],
			},
    }
  },
  mounted() {
    if (this.$route.query.tab) {
      this.activeKey = Number(this.$route.query.tab)
      let newQuery = JSON.parse(JSON.stringify(this.$route.query))
      delete newQuery.tab
      this.$router.replace({ query: newQuery })
    }
  },
  methods: {
    tabChange(key) {
      this.activeKey = key
    },
    editAvatar() {
      this.avatarVisible = true
      this.editAvartarUrl = this.avartarUrl
    },
    handleAvatarOk() {
      this.sending = true
      if (this.avatarChangeFlag) {
        const formData = new FormData()
        this.fileList.forEach(el => {
          formData.append('file', el)
        })
        editHeadImage(formData).then(res => {
          if (res.message && res.message.code === 0) {
            this.$message.success('提交成功')
          }
          this.sending = false
          this.avatarVisible = false
          getBase64(this.fileList[0], imageUrl => {
            this.avartarUrl = imageUrl
          })
          this.$emit('updateUserinfo')
        })
      }
    },
    handleAvatarCancel() {
      this.avatarVisible = false
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt5M = file.size / 1024 / 1024 < 5
      if (isJpgOrPng && isLt5M) {
        this.fileList = [file]
        getBase64(file, imageUrl => {
          this.editAvartarUrl = imageUrl
        })
        this.avatarChangeFlag = true
      } else {
        if (!isJpgOrPng) {
          this.$message.error('仅支持JPEG、PNG格式图片上传');
        }
        if (!isLt5M) {
          this.$message.error('文件大小必须小于5M');
        }
      }
      return false;
    },
    beforeCertUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt10M = file.size / 1024 / 1024 < 10
      if (isJpgOrPng && isLt10M && !this.updateCertLoading) {
        this.updateCertFile = file
        getBase64(file, imageUrl => {
          this.certUrl = imageUrl
        })
      } else {
        if (!isJpgOrPng) {
          this.$message.error('仅支持JPEG、PNG格式图片上传');
        }
        if (!isLt10M) {
          this.$message.error('文件大小必须小于10M');
        }
        return false;
      }
    },
    handleCertUpload() {
      this.updateCertLoading = true
      const formData = new FormData()
      formData.append('file', this.updateCertFile)
      updateCompanyInfo(formData).then(res => {
        if (res.message && res.message.code === 0) {
          this.$message.success('修改成功')
          this.certInfo.companyEditable = true
          this.$emit('updateUserinfo')
        }
        this.updateCertLoading = false
      })
    },
    toCert() {
      this.$router.push('/company/cert')
    },
    handleCertNameUpdate() {
      this.$refs.certInfo.validateField('company', valid => {
        if (valid === '') {
          const formData = new FormData()
          formData.append('company', this.certInfo.company)
          updateCompanyInfo(formData).then(res => {
            if (res.message && res.message.code === 0) {
              this.$message.success('修改成功')
              this.certInfo.companyEditable = true
              this.$emit('updateUserinfo')
            }
          })
        }
      })
    },
  },
}
</script>

<style lang="less">
.usercenter-data {
  padding: 20px 30px;
  text-align: left;
  .my-data-head {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0;
    .avatar-box {
      width: 126px;
      height: 126px;
      position: relative;
      .avatar {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        background-size: cover;
        background-color: #eee;
      }
      .avatar-cover {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background-color: rgba(29,33,41,.5);
        z-index: 2;
        visibility: hidden;
      }
    }
    .avatar-box:hover {
      .avatar-cover {
        visibility: visible!important;
        cursor: pointer;
      }
    }
    .user-name {
      font-size: 18px;
      line-height: 40px;
      color: #333333;
      font-weight: 600;
    }
  }
  .base-data {
    font-size: 16px;
    line-height: 50px;
    font-weight: 600;
  }
  .product-auth {
    width: 500px;
    display: flex;
    justify-content: space-between;
    .product-title {
      flex: 1;
      color: #000000D9;
    }
    .product-expire {
      flex: 3;
      display: flex;
      justify-content: space-between;
    }
  }
  .edit-btn {margin-left: 10px; font-size: 16px;}
  .company-cert-none {
    font-size: 16px;
    padding: 20px 0;
  }
  .ant-form-item-label {
    font-weight: normal;
  }
  .edit-avatar-modal-form-cert {
    .ant-form-item-children {
      display: flex;
      flex-direction: column;
    }
  }
}
.edit-avatar-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  .edit-avatar-modal-image {
    width: 258px;
    height: 258px;
  }
  .edit-avatar-modal-upload {
    margin: 20px 0 10px;
    display: inline-block;
  }
}
</style>