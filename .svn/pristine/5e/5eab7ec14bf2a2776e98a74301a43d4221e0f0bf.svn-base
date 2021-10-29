<template>
  <div class="company-cert">
		<div class="company-cert-body">
			<div class="cert-tips">证件原件认证<span>（您所提供的信息将得到绝对的保护，仅限审核使用。）</span></div>
			<a-divider />
			<div class="cert-form-wrapper">
				<a-form-model class="cert-form" ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
					<a-form-model-item label="企业名称" prop="name">
						<a-input v-model="ruleForm.name" />
					</a-form-model-item>
					<a-form-model-item label="上传营业执照" prop="fileList" extra="格式支持JPEG、PNG，不超过10M">
						<a-upload
							name="file"
							:file-list="ruleForm.fileList"
							:multiple="true"
							class="image-upload"
							accept="image/png, image/jpeg"
							:remove="handleRemove"
							:before-upload="beforeUpload"
						>
							<div class="image-upload-body">
								<a-icon type="camera" style="font-size: 30px; margin-bottom: 8px; color: #999999;" />
								<p>点击上传图片</p>
							</div>
						</a-upload>
					</a-form-model-item>
					<a-form-model-item :wrapper-col="{ span: 8, offset: 8 }" style="margin-top: 50px;">
						<a-button type="primary" @click="submitForm('ruleForm')" style="width: 150px;" :loading="sending">
							提交审核
						</a-button>
					</a-form-model-item>
				</a-form-model>
			</div>
		</div>
	</div>
</template>

<script>
import { uploadCompanyInfo } from '@/api/user'

export default {
	data() {
		return {
			layout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      },
			ruleForm: {
				name: '',
				fileList: [],
			},
			rules: {
				name: [
					{ required: true, message: '请输入企业名称', },
					{ min: 1, max: 50, message: '名称长度应该在1到50之间', trigger: 'blur' },
				],
				fileList: [
					{ required: true, message: '请上传营业执照', }
				],
			},
			sending: false,
		}
	},
	methods: {
		submitForm() {
			this.sending = true
			this.$refs.ruleForm.validate(valid => {
				if (valid) {
					const formData = new FormData()
					formData.append('company', this.ruleForm.name)
					this.ruleForm.fileList.forEach(el => {
            formData.append('file', el)
          })
					uploadCompanyInfo(formData).then(res => {
						if (res.message && res.message.code === 0) {
              this.$message.success('提交成功')
              this.sending = false
              this.$router.push('/usercenter?to=4&tab=2')
            }
						this.sending = false
					})
				} else {
					this.sending = false
				}
			})
		},
		handleRemove(file) {
      const index = this.ruleForm.fileList.indexOf(file)
      const newFileList = this.ruleForm.fileList.slice()
      newFileList.splice(index, 1)
      this.ruleForm.fileList = newFileList
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
			const isLt10M = file.size / 1024 / 1024 < 10
      if (!isJpgOrPng) {
        this.$message.error('仅支持JPEG、PNG格式图片上传');
      }
			if (!isLt10M) {
        this.$message.error('文件大小必须小于10M');
      }
			if (this.ruleForm.fileList.length === 1) {
        this.$message.error('最多上传1张图片');
      }
      if (isJpgOrPng && isLt10M && this.ruleForm.fileList.length === 0) {
				this.ruleForm.fileList = [...this.ruleForm.fileList, file]
			}
      return false
    },
	},
};
</script>

<style lang="less">
.company-cert {
  height: 100%;
	padding: 24px 0;
	text-align: left;
	.company-cert-body {
		width: 100%;
		height: 100%;
		background: #fff;
		padding: 24px;
		.cert-tips {
			font-size: 14px;
			font-weight: 600;
			color: #666666;
			span {
				color: #bfbfbf;
				font-weight: normal;
			}
		}
		.cert-form-wrapper {
			display: flex;
			justify-content: center;
			padding: 80px 0;
			.cert-form {
				width: 40%;
				.image-upload {
					.image-upload-body {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						width: 160px;
						height: 200px;
						background: #FAFAFA;
						border: 1px solid #E7E7E7;
						border-radius: 4px;
						cursor: pointer;
					}
				}
			}
		}
	}
	.ant-input {		
		border-radius: 2px;
	}
}
</style>