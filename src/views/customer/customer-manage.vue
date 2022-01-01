<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-form ref="searchForm" size="small" :inline="true" :model="searchForm">
      <el-form-item prop="userName" label="登录账号:">
        <el-input v-model="searchForm.userName" placeholder="账号" />
      </el-form-item>
      <el-form-item v-show="this.$store.getters.role === 'admin'" prop="pUserName" label="上级账号:">
        <el-input v-model="searchForm.pUserName" placeholder="上级账号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()">搜索</el-button>
        <el-button @click="reset('searchForm')">重置</el-button>
        <el-divider direction="vertical" />
        <el-button title="将所有记录导出至excel" @click="handleDownload">导出Excel<i class="el-icon-upload el-icon--right" /></el-button>
      </el-form-item>
    </el-form>
    <el-button size="mini" type="primary" icon="el-icon-plus" @click="dialogFormVisible = true,dialogTitle='添加账号'">新增</el-button><el-divider direction="vertical" />
    <el-button size="mini" type="primary" icon="el-icon-refresh" @click="search()" />
    <!-- 弹出框 -->
    <el-dialog :width="dialogWidth" :title="dialogTitle" :visible.sync="dialogFormVisible" @closed="closedDialog()">
      <el-form ref="addUserForm" label-width="90px" :rules="rules" :inline="true" :model="addUserForm">
        <el-form-item prop="userName" label="登录账号:">
          <el-input v-model="addUserForm.userName" :disabled="dialogTitle==='修改账号信息'" placeholder="登录账号" />
        </el-form-item>
        <el-form-item prop="password" label="登录密码:">
          <el-input v-model="addUserForm.password" :placeholder="dialogTitle==='修改账号信息'? '不填则不修改密码':'请输入密码'" show-password />
        </el-form-item>
        <el-form-item prop="name" label="客户名称:">
          <el-input v-model="addUserForm.name" placeholder="用户名" />
        </el-form-item>
        <el-form-item v-show="this.$store.getters.role === 'admin' && !isUser" prop="count" label="子账号数:">
          <el-input-number v-model="addUserForm.count" :min="0" :max="1000" label="子账号数" />
        </el-form-item>
        <el-form-item prop="phoneNumber" label="手机号码:">
          <el-input v-model="addUserForm.phoneNumber" placeholder="手机号码" />
        </el-form-item>
        <el-form-item prop="email" label="邮箱:">
          <el-input v-model="addUserForm.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item prop="profile" label="简介:">
          <el-input v-model="addUserForm.profile" placeholder="简介" />
        </el-form-item>
        <!-- <el-form-item prop="sex" label="性别:">
          <el-select v-model="addUserForm.sex" placeholder="请选择">
            <el-option label="男" value="1" />
            <el-option label="女" value="2" />
            <el-option label="未填" value="0" />
          </el-select>
        </el-form-item> -->
        <el-form-item prop="avatar" label="头像:">
          <el-upload
            class="avatar-uploader"
            action="#"
            :http-request="upLoad"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="addUserForm.avatar" :src="addUserForm.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">请上传照片，照片大小不超过5M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closedDialog(), dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="isLoading" @click="dialogTitle=='添加账号'?addUsers('addUserForm'):editUser('addUserForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 显示表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      :row-style="{height: '40px'}"
      :cell-style="{padding: '5px 0 0'}"
      :header-cell-style="{background:'#eef1f6', padding: '10px 0'}"
      style="width: 100%;margin-top:5px"
      :span-method="objectSpanMethod"
    >
      <!-- <el-table-column
        label="ID"
        prop="id"
        align="center"
        width="60"
        type="index"
        :index="indexMethod"
      /> -->
      <el-table-column v-if="this.$store.getters.role === 'admin'" label="上级帐号" prop="puserName" align="center" width="120px">
        <template slot-scope="{row}">
          <span>{{ row.puserName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" prop="name" align="center" width="120">
        <template slot-scope="{row}">
          <el-tag type="success">{{ row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="登录账号" prop="userName" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="this.$store.getters.role === 'admin'" label="总数 / 已使用" prop="name" align="center" width="120">
        <template slot-scope="{row}">
          <span v-if="row.role !== 'user'" :style="row.count === row.usedCount?'color: red':''">{{ row.count }} / {{ row.usedCount }}</span>
          <span v-else>子账号</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="性别" prop="sex" align="center" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.sex | sexFilter }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="手机号码" prop="phoneNumber" align="center" width="110px">
        <template slot-scope="{row}">
          <span>{{ row.phoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" align="center">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" prop="avatar" align="center" width="160px">
        <template slot-scope="{row}">
          <el-image :preview-src-list="userImgList" style="width: 50px; height: 50px" fit="scale-down" :src="row.avatar">
            <div slot="error">
              <!-- <el-image style="width: 50px; height: 50px" fit="scale-down" :src="errorImage" /> -->
              <i style="width: 50px; height: 50px; background-color: #F5F7FA; line-height:50px;color: #909399" class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="简介" prop="profile" align="center">
        <template slot-scope="{row}">
          <span>{{ row.profile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="openTime" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编辑" width="120" align="center">
        <template slot-scope="{row}">
          <el-button
            slot="reference"
            type="text"
            size="small"
            @click="handleEdit(row), dialogFormVisible = true,dialogTitle='修改账号信息'"
          ><i class="el-icon-edit" />修改</el-button>
          <el-popconfirm
            style="margin-left: 10px"
            title="将删除该所有账号下关联的设备信息、记录、广告、人员等所有信息？"
            icon="el-icon-info"
            icon-color="red"
            @confirm="handleDelete(row.userName)"
          >
            <el-button
              slot="reference"
              type="text"
              size="small"
            ><i class="el-icon-remove-outline" />删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList(searchForm)" />

  </div>
</template>

<script>
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { getCustomerInfo, addCustomerInfo, deleteCustomerInfo, editCustomerInfo, uploadImg } from '@/api/custome'

import errorImage from '@/assets/error-image.png'

export default {
  name: 'UserManage',
  components: {
    Pagination
  },
  filters: {
    sexFilter(key) {
      const map = {
        1: '男',
        2: '女'
      }
      return map[key] || '未填'
    }
  },
  props: {},
  data() {
    return {
      errorImage,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
      },
      dialogFormVisible: false,
      restaurants: [],
      addUserForm: {
        userName: null,
        name: null,
        phoneNumber: null,
        email: null,
        profile: null,
        // sex: null,
        password: null,
        count: null,
        avatar: null
      },
      downloadLoading: false,
      searchForm: {
        account: null,
        // sex: null,
        phone: null,
        workStatus: null,
        mark: null,
        password: null,
        pUserName: null,
        idCard: null
      },
      createTime: null,
      dialogTitle: null,
      userImgList: [],
      isLoading: false,
      dialogWidth: '40%',
      isUser: false,
      rules: {
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        validTime: [
          { required: true, message: '请选择有效时间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList(this.searchForm)
    this.setDialogWidth()
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.setDialogWidth()
      })()
    }
  },
  methods: {
    getList(data) {
      this.listLoading = true
      data.page = this.listQuery.page
      data.limit = this.listQuery.limit
      getCustomerInfo(data).then(response => {
        this.userImgList = []
        this.list = response.data.items
        this.total = response.data.total
        this.list.forEach((item) => { this.userImgList.push(item.avatar) })
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.listLoading = false
      })
    },
    handleEdit(info) {
      if (info.role === 'user') {
        this.isUser = true
      }
      this.rules.password = null
      this.addUserForm.userName = info.userName
      this.addUserForm.count = info.count
      this.addUserForm.name = info.name
      this.addUserForm.phoneNumber = info.phoneNumber
      this.addUserForm.email = info.email
      this.addUserForm.profile = info.profile
      // this.addUserForm.sex = info.sex + ''
      this.addUserForm.avatar = info.avatar
    },
    handleDelete(userName) {
      deleteCustomerInfo({ 'userName': userName }).then(res => {
        if (res.status === 200) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
        this.getList(this.searchForm)
      })
    },
    editUser(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          editCustomerInfo(this.addUserForm).then(res => {
            if (res.status === 200) {
              this.$message.success(res.message)
              this.getList(this.searchForm)
              // this.$refs[form].resetFields()
            } else {
              this.$message.error(res.message)
              // this.$refs[form].resetFields()
            }
          }).finally(() => {
            this.dialogFormVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    upLoad(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      uploadImg(formData).then((res) => {
        if (res.status === 200) {
          this.addUserForm.avatar = res.data // 请求之后将返回的URL给修改的接口在进行一次修改请求
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
    },

    addUsers(addUserForm) {
      this.$refs[addUserForm].validate((valid) => {
        if (valid) {
          this.isLoading = true
          addCustomerInfo(this.addUserForm).then(res => {
            this.$refs[addUserForm].resetFields()
            if (res.status === 200) {
              this.$message.success(res.message)
            } else {
              this.$message.error(res.message)
            }
          }).catch((err) => {
            this.isLoading = false
            err
          }).finally(() => {
            this.dialogFormVisible = false
            this.isLoading = false
            this.getList(this.searchForm)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'puserName') {
        const spanOneArr = []
        let concatOne = 0
        this.list.forEach((item, index) => {
          if (index === 0) {
            spanOneArr.push(1)
          } else {
          // puserName 是你需要合并的参数
            if (item.puserName === this.list[index - 1].puserName) { // 第一列需合并相同内容的判断条件
              spanOneArr[concatOne] += 1
              spanOneArr.push(0)
            } else {
              spanOneArr.push(1)
              concatOne = index
            }
          }
        })
        return {
          rowspan: spanOneArr[rowIndex],
          colspan: 1
        }
      }
    },
    closedDialog() {
      this.rules.password = [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
      this.addUserForm.count = null
      this.addUserForm.password = null
      this.addUserForm.userName = null
      this.addUserForm.name = null
      this.addUserForm.phoneNumber = null
      this.addUserForm.email = null
      this.addUserForm.profile = null
      // this.addUserForm.sex = null
      this.addUserForm.avatar = null
      this.isUser = false
    },
    setDialogWidth() {
      var val = document.body.clientWidth
      const def = 650 // 默认宽度
      if (val < def) {
        this.dialogWidth = '90%'
      } else {
        this.dialogWidth = def + 'px'
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isJPG && !isPNG) {
        this.$message.error('上传文件类型只能是 JPG 或 PNG 格式!')
        return false
      }

      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      return isJPG || isPNG || isLt5M
    },
    indexMethod(index) {
      return ((this.listQuery.page - 1) * this.listQuery.limit) + index + 1
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        (async() => {
          let jsonList = ''
          await getCustomerInfo().then(response => { jsonList = response.data.items })
          const tHeader = ['账号', '用户名', '性别', '手机号码', '邮箱', '头像', '简介', '创建时间', '可创建账号数', '已使用数']
          const filterVal = ['userName', 'name', 'sex', 'phoneNumber', 'email', 'faceUrl', 'profile', 'createTime', 'count', 'usedCount']
          const data = this.formatJson(filterVal, jsonList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'customer-manage:' + parseTime(new Date())
          })
          this.downloadLoading = false
        })()
      })
    },
    formatJson(filterVal, jsonList) {
      return jsonList.map(v => filterVal.map(j => {
        if (j === 'createTime') {
          return parseTime(v[j])
        }
        if (j === 'sex') {
          return this.$options.filters.sexFilter(v[j])
        }
        return v[j]
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    reset(searchForm) {
      this.createTime = null
      this.$refs[searchForm].resetFields()
      this.getList(this.listQuery)
    },
    search() {
      this.listLoading = true
      this.searchForm.page = this.listQuery.page = 1
      this.searchForm.limit = this.listQuery.limit
      this.getList(this.searchForm)
      this.listLoading = false
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
