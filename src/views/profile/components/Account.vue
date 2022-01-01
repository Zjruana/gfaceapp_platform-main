<template>
  <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="用户名" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item label="手机号码" prop="phoneNumber">
      <el-input v-model="ruleForm.phoneNumber" />
    </el-form-item>
    <el-form-item label="电子邮件" prop="email">
      <el-input v-model="ruleForm.email" />
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-radio-group v-model="ruleForm.sex">
        <el-radio label="1">男</el-radio>
        <el-radio label="2">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="简介" prop="profile">
      <el-input v-model="ruleForm.profile" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="loading" @click="submitForm('ruleForm')">保存</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { editUserInfo } from '@/api/user'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          phoneNumber: '',
          sex: '',
          avatar: '',
          profile: '',
          roles: '',
          createTime: ''
        }
      }
    }
  },
  data() {
    return {
      ruleForm: {
        name: this.user.name,
        phoneNumber: this.user.phoneNumber,
        email: this.user.email,
        sex: this.user.sex + '',
        profile: this.user.profile
      },
      loading: false
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          editUserInfo(this.ruleForm).then(res => {
            const that = this
            this.$message.success(res.message)
            this.$store.dispatch('user/getInfo').finally(() => {
              that.$emit('getUser')
            })
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
