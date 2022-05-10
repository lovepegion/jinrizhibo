<template>
<div class="change-container">
  <h2 class="change-header">我的信息</h2>
  <a-form-model ref="modifyInfo" class="user-form" :model="modifyInfo" @submit="_updateUserInfo" @submit.native.prevent :rules="rules" labelAlign="left">
    <div class="form-item">
      <span class="input-title">用户昵称: </span>
      <a-form-model-item prop="nickname">
        <a-input class="input-self" type="text" v-model="modifyInfo.nickname" placeholder="请输入用户昵称"></a-input>
      </a-form-model-item>
    </div>
    <div class="form-item">
      <span class="input-title">手机号: </span>
      <a-form-model-item prop="phoneNumber">
        <a-input class="input-self" type="text" v-model="modifyInfo.phoneNumber" placeholder="请输入手机号码"></a-input>
      </a-form-model-item>
    </div>
    <div class="form-item" v-if="(modifyInfo.phoneNumber !== $store.state.userInfo.phoneNumber) && smsAbled">
      <span class="input-title">验证码: </span>
      <a-form-model-item prop="smsCode">
        <input class="input-self" type="password" v-model="modifyInfo.smsCode" placeholder="请输入验证码">
        <div class="sms-box">
          <div v-if="!countdowning" class="sms-code" :class="{'sms-code-count': smsAbled}" @click="getSmsCode">获取验证码</div>
          <count-down v-else @doneCountdown="doneCountdown" class="sms-code sms-code-count" />
        </div>
      </a-form-model-item>
    </div>
    <a-form-model-item>
      <a-button type="primary" :loading="isLoading" html-type="submit">提交修改</a-button>
    </a-form-model-item>
  </a-form-model>
</div>
</template>

<script>
import { mapMutations } from 'vuex'
import { sms, updateUserInfo, editPhone } from '@/api/user'
import { getUserInfo } from '@/api/user.js'
import CountDown from '@/components/utils/CountDown'
export default {
  name: 'Modify',
  components: { CountDown },
  data () {
    const validatePhoneNumber = (rule, value, callback) => {
      const reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!reg.test(value)) {
        callback(new Error("请输入正确的手机号"))
      } else {
        callback()
      }
    }
    const validateNickname = (rule, value, callback) => {
      const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
      if (value === '') {
        callback(new Error('请输入昵称'))
      } else if (value.length > 10 || value.length < 2) {
        callback(new Error('昵称长度为2-10位'))
      } else if (!reg.test(value)) {
        callback(new Error("支持中英文与数字组合"))
      } else {
        callback()
      }
    }
    const validateSmsCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        phoneNumber: [{ validator: validatePhoneNumber, trigger: 'blur' }],
        nickName: [{ validator: validateNickname, trigger: 'blur' }],
        smsCode: [{ validator: validateSmsCode, trigger: 'blur' }]
      },
      isLoading: false,
      countdowning: false,
      smsAbled: false,
      modifyInfo: {
        nickname: '',
        phoneNumber: '',
        smsCode: ''
      }
    }
  },
  watch: {
    // 监听电话号填写是否正确，设置获取验证码按钮状态
    'modifyInfo.phoneNumber': function (val) {
      const reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      if (reg.test(val)) {
        this.smsAbled = true
      } else {
        this.smsAbled = false
      }
    }
  },
  methods: {
    ...mapMutations({ setUserInfo: 'SET_USERINFO' }),
    _updateUserInfo () {
      this.$refs.modifyInfo.validate(async valid => {
        console.log('valid', valid)
        if (valid) {
          this.isLoading = true
          // 修改昵称
          const nameres = await updateUserInfo({nickname: this.modifyInfo.nickname, phoneNumber: this.$store.state.userInfo.phoneNumber})
          // 修改手机号
          if (this.modifyInfo.phoneNumber !== this.$store.state.userInfo.phoneNumber) {
            const phoneres = await editPhone({phoneNumber: this.modifyInfo.phoneNumber, smsCode: this.modifyInfo.smsCode})
            console.log('phoneres', phoneres)
            if ((nameres && nameres.message && nameres.message.message && nameres.message.message === 'success') && (phoneres && nameres.message && phoneres.message.message && phoneres.message.message === '重置手机号码成功')) {
              const newuser = await getUserInfo()
              this.setUserInfo({...this.$store.state.userInfo, ...newuser.data})
              this.isLoading = false
              this.$message.success('信息修改成功!')
              this.$router.push('/usercenter')
            } else {
              this.isLoading = false
              if (nameres && nameres.message && nameres.message.message !== 'success') this.$message.error(nameres.message.message)
              else if (phoneres && nameres.message && phoneres.message.message !== 'success') this.$message.error(phoneres.message.message)
              else this.$message.error('修改失败，请稍后再试!')
            }
          } else if (nameres && nameres.message && nameres.message.message && nameres.message.message === 'success') {
            const newuser = await getUserInfo()
            this.setUserInfo({...this.$store.state.userInfo, ...newuser.data})
            this.isLoading = false
            this.$message.success('信息修改成功!')
            this.$router.push('/usercenter')
          } else {
            this.isLoading = false
            if (nameres && nameres.message && nameres.message.message) this.$message.error(nameres.message.message)
            else this.$message.error('修改失败，请稍后再试!')
          }
        }
      })
    },
    getSmsCode() {
      if (!this.smsAbled) {
        return false
      }
      this.countdowning = true
      const data = new FormData
      data.append('phoneNumber', this.modifyInfo.phoneNumber)
      data.append('type', 4)
      sms(data).then(res => {
        if (res.message && res.message.code === 0) {
          this.$message.success('获取成功')
        } else if (res.message && res.message.code!== 0) {
          this.$message.error(res.message.message)
        } else {
          this.$message.error('获取失败')
        }
      })
    },
    doneCountdown() {
      this.countdowning = false
    }
  },
  mounted () {
    this.$set(this.modifyInfo, 'nickname', this.$store.state.userInfo.nickname)
    this.$set(this.modifyInfo, 'phoneNumber', this.$store.state.userInfo.phoneNumber)
  }
}
</script>

<style scoped lang="less">
.change-container {
  width: 523px;
  box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.09);
  border-radius: 20px;
  background: #ffffff;
  padding: 50px 71px;
  margin: 0 auto;
  .change-header {
    font-size: 30px;
    font-weight: 600;
    color: #333333;
    opacity: 0.9;
    margin-bottom: 40px;
  }
  .form-item {
      margin-left: 30px;
      width: 380px;
      position: relative;
      display: flex;
      justify-content: space-between;
      .sms-box {
        height: 40px;
        line-height: 40px;
        position: absolute;
        bottom: -12px;
        right: 2px;
        .sms-code {
          padding: 0 20px;
          border-radius: 5px;
          height: 40px;
          line-height: 40px;
        }
      }
      .input-title {
        line-height: 50px;
        font-size: 14px;
        color: #212121;
      }
      .input-self {
        width: 300px;
        padding-left: 10px;
        outline: none;
        border: 1px solid #ccc;
        border-radius: 10px;
      }
      .input-self::-webkit-input-placeholder {
        color: #ccc;
      }
    }
}
</style>