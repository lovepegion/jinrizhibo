<template>
  <div class="register">
    <h2 class="register-header">用户注册</h2>
    <a-form-model ref="form" :model="form" class="user-form" @submit="handleSubmit" @submit.native.prevent :rules="rules">
      <a-form-model-item prop="phoneNumber">
        <a-input v-model="form.phoneNumber" placeholder="请输入手机号码">
          <a-icon slot="prefix" type="mobile" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item prop="smsCode">
        <a-input v-model="form.smsCode" placeholder="请输入验证码">
          <a-icon slot="prefix" type="safety-certificate" style="color:rgba(0,0,0,.25)" />
          <div slot="suffix">
            <div v-if="!countdowning" class="sms-code" :class="{'sms-code-count': smsAbled}" @click="getSmsCode">获取验证码</div>
            <count-down v-else @doneCountdown="doneCountdown" class="sms-code sms-code-count" />
          </div>
        </a-input>
      </a-form-model-item>
      <a-tooltip placement="topLeft" title="长度不能少于8个字符，字母、数字以及下划线至少包含2种，不允许有空格、中文">
        <a-form-model-item prop="password">
            <a-input-password v-model="form.password" placeholder="请设置登录密码" autoComplete="new-password">
              <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
            </a-input-password>
        </a-form-model-item>
      </a-tooltip>
      <a-form-model-item prop="password2">
        <a-input-password v-model="form.password2" placeholder="请确认登录密码" autoComplete="new-password">
          <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
        </a-input-password>
      </a-form-model-item>
      <a-tooltip placement="topLeft" title="长度2-10，支持中英文与数字组合">
        <a-form-model-item prop="nickname">
          <a-input v-model="form.nickname" placeholder="请输入昵称">
            <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-model-item>
      </a-tooltip>
      <a-form-model-item prop="check">
        <a-checkbox v-model="form.check">我已阅读并同意《今日智播用户注册协议》</a-checkbox>
      </a-form-model-item>
      <a-form-model-item>
        <a-button
          type="primary"
          html-type="submit"
          :disabled="form.nickname === '' || form.password === '' || form.password2 === '' || form.phoneNumber === '' || form.smsCode === '' || !form.check"
          class="submit-btn"
        >
          注册
        </a-button>
      </a-form-model-item>
    </a-form-model>
    <div class="route-to">已有账号？<a @click="toLogin">立即登录</a></div>
  </div>
</template>

<script>
import { sms, register } from '@/api/user'
import CountDown from '@/components/utils/CountDown'
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
    const validateSmsCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length > 12 || value.length < 8) {
        callback(new Error('密码长度为8-12位'))
      } else if (/^[0-9]*$|^[a-zA-Z]*$|^_*$/.test(value)) {
        callback(new Error('字母、数字以及下划线至少包含2种'))
      } else if (/[\u4e00-\u9fa5]+/.test(value)) {
        callback(new Error('不允许有中文'))
      } else if (/\s+/.test(value)) {
        callback(new Error('不允许有空格'))
      } else {
        if (this.form.password2 !== '') {
          this.$refs.form.validateField('password2')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error("两次密码输入不一致"))
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
    };
    return {
      form: {
        nickname: '',
        password: '',
        password2: '',
        phoneNumber: '',
        smsCode: '',
        check: true,
      },
      smsAbled: false,
      countdowning: false,
      rules: {
        phoneNumber: [{ validator: validatePhoneNumber, trigger: 'blur' }],
        smsCode: [{ validator: validateSmsCode, trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }],
        password2: [{ validator: validatePass2, trigger: 'blur' }],
        nickname: [{ validator: validateNickname, trigger: 'blur' }],
      },
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
          const data = {
            nickname: this.form.nickname,
            password: this.form.password,
            phoneNumber: this.form.phoneNumber,
            smsCode: this.form.smsCode,
          }
          register(data).then(res => {
            if (res.message && res.message.code === 0) {
              this.$message.success('注册成功')
              this.$router.push('/user/login')
            } else if (res.message && res.message.code!== 0) {
              this.$message.error(res.message.message)
            } else {
              this.$message.error('注册失败')
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
      data.append('type', 1)
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
    toLogin() {
      this.$router.push('/user/login')
    },
  },
}
</script>

<style lang="less">
.register {
  width: 523px;
  box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.09);
  border-radius: 20px;
  background: #ffffff;
  padding: 50px 71px;
  margin: 0 auto;
  .register-header {
    font-size: 30px;
    font-weight: 600;
    color: #333333;
    opacity: 0.9;
    margin-bottom: 40px;
  }
  .route-to {
    text-align: left;
    color: #A9A9A9;
    font-size: 14px;
  }
}
</style>