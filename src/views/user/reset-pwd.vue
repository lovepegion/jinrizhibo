<template>
  <div class="reset-pwd">
    <h2 class="reset-pwd-header">重置密码</h2>
    <a-form-model ref="form" :model="form" class="user-form" @submit="handleSubmit" @submit.native.prevent :rules="rules">
      <a-form-model-item prop="phoneNumber">
        <a-input v-model="form.phoneNumber" placeholder="请输入手机号码" :disabled="$store.state.userInfo && $store.state.userInfo.phoneNumber">
          <a-icon slot="prefix" type="mobile" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item prop="smsCode">
        <a-input v-model="form.smsCode" placeholder="请输入验证码" autocomplete="off">
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
      <a-form-model-item>
        <a-button
          type="primary"
          html-type="submit"
          :disabled="form.nickname === '' || form.password === '' || form.password2 === '' || form.phoneNumber === '' || form.smsCode === '' || !form.check"
          class="submit-btn"
        >
          提交
        </a-button>
      </a-form-model-item>
    </a-form-model>
    <div class="route-to"><a @click="toRegister">免费注册</a></div>
  </div>
</template>

<script>
import { sms, editPwd } from '@/api/user'
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
    return {
      form: {
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
          const formData = new FormData()
          formData.append('newPassword', this.form.password)
          formData.append('phoneNumber', this.form.phoneNumber)
          formData.append('smsCode', this.form.smsCode)
          editPwd(formData).then(res => {
            if (res.message && res.message.code === 0) {
              this.$message.success('操作成功')
              this.$router.push('/user/login')
            } else if (res.message && res.message.code!== 0) {
              this.$message.error(res.message.message)
            } else {
              this.$message.error('操作失败')
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
      data.append('type', 3)
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
    toRegister() {
      this.$router.push('/user/register')
    }
  },
  mounted () {
    if (this.$store.state.userInfo && this.$store.state.userInfo.phoneNumber) this.$set(this.form, 'phoneNumber', this.$store.state.userInfo.phoneNumber)
  }
}
</script>

<style lang="less">
.reset-pwd {
  width: 523px;
  box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.09);
  border-radius: 20px;
  background: #ffffff;
  padding: 50px 71px;
  margin: 0 auto;
  .reset-pwd-header {
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