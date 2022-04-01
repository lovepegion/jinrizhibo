<template>
  <div class="login">
    <div v-if="!isPhone" class="login-left">
      <img :src="logoLeft" alt="">
    </div>
    <div class="login-right">
      <h2 class="login-header">欢迎登录</h2>
      <a-form-model ref="form" :model="form" class="user-form" @submit="handleSubmit" @submit.native.prevent :rules="rules">
        <a-form-model-item prop="phoneNumber">
          <a-input v-model="form.phoneNumber" placeholder="请输入手机号码">
            <a-icon slot="prefix" type="mobile" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="password" v-if="mode === 1">
          <a-input-password v-model="form.password" placeholder="请输入登录密码">
            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
          </a-input-password>
        </a-form-model-item>
        <a-form-model-item prop="smsCode" v-if="mode === 2">
          <a-input v-model="form.smsCode" placeholder="请输入验证码">
            <a-icon slot="prefix" type="safety-certificate" style="color:rgba(0,0,0,.25)" />
            <div slot="suffix">
              <div v-if="!countdowning" class="sms-code" :class="{'sms-code-count': smsAbled}" @click="getSmsCode">获取验证码</div>
              <count-down v-else @doneCountdown="doneCountdown" class="sms-code sms-code-count" />
            </div>
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <div class="form-inline">
            <a-checkbox v-model="form.check">下次自动登录</a-checkbox>
            <a @click="toResetPWD">忘记密码</a>
          </div>
        </a-form-model-item>
        <a-form-model-item>
          <a-button
            type="primary"
            html-type="submit"
            :disabled="form.phoneNumber === ''"
            class="submit-btn"
          >
            登录
          </a-button>
        </a-form-model-item>
        <a-form-model-item>
          <div class="form-inline">
            <a @click="toRegister" class="form-inline-link">免费注册</a>
            <a @click="checkMode" class="form-inline-link">{{ mode === 1 ? '验证码登录' : '密码登录' }}</a>
          </div>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import { RSAKEY, encryptedString } from '@/utils/ras'
import { sms, pwdLogin, smsLogin } from '@/api/user'
import logoLeft from '@/assets/image/login-left.png'
import CountDown from '@/components/utils/CountDown'
import { mapMutations } from 'vuex'
export default {
  components: {
    CountDown
  },
  data() {
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
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
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
      isPhone: false,
      logoLeft,
      form: {
        phoneNumber: '',
        smsCode: '',
        password: '',
        check: true,
      },
      rules: {
        phoneNumber: [{ validator: validatePhoneNumber, trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }],
        smsCode: [{ validator: validateSmsCode, trigger: 'blur' }],
      },
      smsAbled: false,
      countdowning: false,
      mode: 1, // 1：密码登录、2:验证码登录
    }
  },
  watch: {
    // 监听电话号填写是否正确，设置获取验证码按钮状态
    'form.phoneNumber': function (val) {
      const reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      if (reg.test(val)) {
        this.smsAbled = true
      } else {
        this.smsAbled = false
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = new FormData
          data.append('phoneNumber', this.form.phoneNumber)
          let apiMethod = pwdLogin
          if (this.mode === 1) {
            data.append('password', encryptedString(RSAKEY(), this.form.password))
          } else {
            apiMethod = smsLogin
            data.append('smsCode', this.form.smsCode)
          }
          apiMethod(data).then(res => {
            if (res.message && res.message.code === 0) {
              this.$message.success('登录成功')
              this.setUserInfo(res.data)
              if(this.$route.query && this.$route.query.pathname) this.$router.push(this.$route.query.pathname)
              else this.$router.push('/')
            } else if (res.message && res.message.code!== 0) {
              this.$message.error(res.message.message)
            } else {
              this.$message.error('登录失败')
            }
          })
        }
      })
    },
    getSmsCode() {
      if (!this.smsAbled) {
        return false
      }
      this.countdowning = true
      const data = new FormData
      data.append('phoneNumber', this.form.phoneNumber)
      data.append('type', 2)
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
    //  计时完毕
    doneCountdown() {
      this.countdowning = false
    },
    // 切换登录模式
    checkMode() {
      if (this.mode === 1) {
        this.mode = 2
      } else {
        this.mode = 1
      }
      this.$refs.form.clearValidate()
    },
    toRegister() {
      this.$router.push('/user/register')
    },
    toResetPWD() {
      this.$router.push('/user/reset-pwd')
    },
    ...mapMutations({
      setUserInfo: 'SET_USERINFO',
    }),
  },
  mounted () {
    if (window.innerWidth < 700) {
      this.isPhone = true
    }
  }
}
</script>

<style lang="less">
.login {
  display: flex;
  width: 100%;
  max-width: 962px;
  box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.09);
  border-radius: 20px;
  background: #ffffff;
  margin: 0 auto;
  .login-left {
    img {
      width: 441px;
      height: 512px;
    }
  }
  .login-right {
    flex: 1;
    padding: 0 45px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .login-header {
      font-size: 30px;
      font-weight: 600;
      color: #333333;
      opacity: 0.9;
      margin-bottom: 40px;
    }
    .form-inline {
      display: flex;
      justify-content: space-between;
    }
    .form-inline-link {
      color: #A9A9A9;
    }
  }
}
</style>