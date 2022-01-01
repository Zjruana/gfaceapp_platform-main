<template>
  <div class="app-container">
    <el-form ref="searchForm" size="small" :inline="true" :model="searchForm">
      <el-form-item prop="name" label="员工姓名:">
        <el-input v-model="searchForm.name" placeholder="姓名" />
      </el-form-item>
      <el-form-item prop="mobilePhone" label="手机:">
        <el-input v-model="searchForm.mobilePhone" placeholder="手机号码" />
      </el-form-item>
      <el-form-item prop="icCard" label="门禁卡号:">
        <el-input v-model="searchForm.icCard" placeholder="门禁卡号" />
      </el-form-item>
      <el-form-item prop="idCardNo" label="身份证号:">
        <el-input v-model="searchForm.idCardNo" placeholder="身份证号" />
      </el-form-item>
      <el-form-item prop="createTime" label="创建时间:">
        <el-date-picker
          v-model="createTime"
          style="width:230px"
          type="daterange"
          range-separator="-"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          align="center"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()">搜索</el-button>
        <el-button @click="reset('searchForm')">重置</el-button>
        <el-divider direction="vertical" />
        <el-button title="将所有记录导出至excel" @click="handleDownload">导出Excel<i class="el-icon-upload el-icon--right" /></el-button>
      </el-form-item>
    </el-form>
    <el-button size="mini" type="primary" icon="el-icon-plus" @click="dialogFormVisible = true,loadAll(),dialogTitle='添加员工',nameDisabled=false">新增</el-button><el-divider direction="vertical" />
    <el-button size="mini" type="primary" icon="el-icon-download" @click="dialogBatchUserVisible = true">批量导入</el-button>
    <!-- 批量导入 弹出框 -->
    <el-dialog :width="dialogWidth" title="批量导入人员" :visible.sync="dialogBatchUserVisible" @closed="closedDialog()">
      <el-upload
        ref="uploadUploadPersonnelFileRef"
        class="upload-demo"
        drag
        accept=".zip"
        :limit="1"
        :http-request="uploadUploadPersonnelFile"
        action="customize"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传zip文件 且 文件不超过100MB</div>
      </el-upload>
      <!-- <el-table
        v-if="batchPersonnelList.length>0"
        :key="tableKey"
        v-loading="listLoading"
        :data="batchPersonnelList"
        fit
        highlight-current-row
        :row-style="{height: '40px'}"
        :cell-style="{padding: '5px 0 0'}"
        :header-cell-style="{background:'#eef1f6', padding: '10px 0'}"
        style="width: 100%;margin-top:5px"
        @sort-change="sortChange"
      >
        <el-table-column label="姓名" prop="name" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机" prop="mobilePhone" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.mobilePhone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="门禁卡号" prop="icCard" align="center">
          <template slot-scope="{row}">
            <span>{{ row.icCard }}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份证号" prop="idCardNo" align="center">
          <template slot-scope="{row}">
            <span>{{ row.idCardNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备组" prop="deviceGroup" align="center">
          <template slot-scope="{row}">
            <span>{{ row.deviceGroup }}</span>
          </template>
        </el-table-column>
        <el-table-column label="过期时间" width="160px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.endTime | validDateEndFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="照片" align="center">
          <template slot-scope="{row}">
            <el-image v-show="row.imageUrl!==null" fit="scale-down" :preview-src-list="userImgList" style="width: 50px; height: 50px" :src="row.imageUrl">
              <div slot="error">
                <i style="width: 50px; height: 50px; background-color: #F5F7FA; line-height:50px;color: #909399" class="el-icon-picture-outline" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="工号" prop="jobNumber" align="center">
          <template slot-scope="{row}">
            <span>{{ row.jobNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开门密码" prop="openDoorPassword" align="center">
          <template slot-scope="{row}">
            <span>{{ row.openDoorPassword }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" align="center">
          <template slot-scope="{row}">
            <span>{{ row.remark }}</span>
          </template>
        </el-table-column>
      </el-table> -->
      <el-divider content-position="left">
        <el-tag type="info" effect="plain">解析总人数: {{ batchPersonnelListTag.all }} </el-tag>&nbsp;
        <el-tag type="success" effect="plain">成功: {{ batchPersonnelListTag.success }} </el-tag>&nbsp;
        <el-tag type="warning" effect="plain">警告: {{ batchPersonnelListTag.warning }} </el-tag>&nbsp;
        <el-tag type="danger" effect="plain">失败: {{ batchPersonnelListTag.danger }} </el-tag>
      </el-divider>
      <el-progress :percentage="batchPersonnelListPercentage" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="closedDialog(), dialogBatchUserVisible = false">取 消</el-button>
        <el-button :disabled="batchPersonnelListBtnDisabled" type="primary" @click="clickBatchPersonnelList">一键导入</el-button>
      </div>
    </el-dialog>
    <!-- 添加员工 弹出框 -->
    <el-dialog :width="dialogWidth" :title="dialogTitle" :visible.sync="dialogFormVisible" @closed="closedDialog()">
      <el-form ref="addUserForm" label-width="90px" :rules="rules" :inline="true" :model="addUserForm">
        <el-form-item prop="name" label="员工姓名:">
          <el-input v-model="addUserForm.name" :disabled="nameDisabled" placeholder="姓名" />
        </el-form-item>
        <el-form-item prop="mobilePhone" label="手机号码:">
          <el-input v-model="addUserForm.mobilePhone" style="width:205px" placeholder="手机号码" />
        </el-form-item>
        <el-form-item prop="jobNumber" label="工号:">
          <el-input v-model="addUserForm.jobNumber" placeholder="长度大于6位" />
        </el-form-item>
        <el-form-item prop="openDoorPassword" label="开门密码:">
          <el-input v-model="addUserForm.openDoorPassword" style="width:205px" placeholder="长度大于6位" />
        </el-form-item>
        <el-form-item prop="deviceGroup" label="组织:">
          <el-select v-model="addUserForm.deviceGroup" placeholder="请选择">
            <el-option
              v-for="item in restaurants"
              :key="item.value"
              :value-key="new Date().getTime()"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item prop="sex" label="员工性别:">
          <el-select v-model="addUserForm.sex" placeholder="请选择">
            <el-option label="男" value="1" />
            <el-option label="女" value="2" />
          </el-select>
        </el-form-item> -->
        <el-form-item prop="idCardNo" label="身份证号:">
          <el-input v-model="addUserForm.idCardNo" placeholder="身份证号" />
        </el-form-item>
        <el-form-item prop="icCard" label="门禁卡号:">
          <el-input v-model="addUserForm.icCard" placeholder="门禁卡号" />
        </el-form-item>
        <el-form-item prop="endTime" label="过期时间:">
          <el-date-picker
            v-model="addUserForm.endTime"
            style="width:205px"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item prop="remark">
          <label slot="label">备注:</label>
          <el-input v-model="addUserForm.remark" placeholder="备注" />
        </el-form-item>
        <el-form-item prop="imageUrl" label="员工照片:">
          <el-upload
            class="avatar-uploader"
            action="#"
            :http-request="upLoad"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="addUserForm.imageUrl" :src="addUserForm.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">请上传正面人脸照片，照片大小不超过5M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closedDialog(), dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="isLoading" @click="dialogTitle=='添加员工'?addUsers('addUserForm'):editUser('addUserForm')">确 定</el-button>
      </div>
    </el-dialog>

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
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        align="center"
        width="80"
        type="index"
        :index="indexMethod"
      />
      <el-table-column label="姓名" prop="name" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机" prop="mobilePhone" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.mobilePhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="门禁卡号" prop="icCard" align="center">
        <template slot-scope="{row}">
          <span>{{ row.icCard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" prop="idCardNo" align="center">
        <template slot-scope="{row}">
          <span>{{ row.idCardNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备组" prop="deviceGroup" align="center">
        <template slot-scope="{row}">
          <span>{{ row.deviceGroup }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('personnelEmployee.sex')" prop="sex" align="center" width="60">
        <template slot-scope="{row}">
          <span>{{ row.sex | sexFilter }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="创建时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.validDateStart | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="过期时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.validDateEnd |validDateEndFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="照片" align="center">
        <template slot-scope="{row}">
          <el-image v-show="row.faceUrl!==null" fit="scale-down" :preview-src-list="userImgList" style="width: 50px; height: 50px" :src="row.faceUrl">
            <div slot="error">
              <!-- <el-image style="width: 50px; height: 50px" fit="scale-down" :src="errorImage" /> -->
              <i style="width: 50px; height: 50px; background-color: #F5F7FA; line-height:50px;color: #909399" class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="工号" prop="jobNumber" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jobNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开门密码" prop="openDoorPassword" align="center">
        <template slot-scope="{row}">
          <span>{{ row.openDoorPassword | filterOpenDoorPassword }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="{row}">
          <el-button
            slot="reference"
            type="text"
            size="small"
            @click="handleEdit(row),dialogTitle='修改员工信息'"
          ><i class="el-icon-edit" />编辑</el-button>

          <el-popconfirm
            style="margin-left: 10px"
            title="确定删除此人员吗？"
            @confirm="handleDelete(row.personId)"
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
import { fetchBlacklistList, addBlacklistUser, loadAllDevice, deleteBlacklistUser, editBlacklistUser } from '@/api/personnel'
import { batchUploadPersonnel, uploadImg } from '@/api/public'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  filters: {
    filterOpenDoorPassword(pwd) {
      if (pwd !== null && pwd.length > 2) {
        let char = '*'
        for (let index = 2; index < pwd.length; index++) {
          char += '*'
        }
        return pwd.substr(0, 1) + char + pwd.substr(pwd.length - 1, 1)
      } else if (pwd !== null && pwd.length <= 2) {
        return pwd.substr(0, 1) + '*'
      } else {
        return pwd
      }
    }
  },
  data() {
    var validatorPhone = function(rule, value, callback) {
      if (value === null || value === '') {
        callback()
      } else if (!/^1\d{10}$/.test(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
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
      dialogBatchUserVisible: false,
      uploadUrl: '',
      restaurants: [],
      addUserForm: {
        name: null,
        mobilePhone: null,
        sex: null,
        icCard: null,
        endTime: null,
        imageUrl: null,
        deviceGroup: null,
        deviceCodes: null,
        openDoorPassword: null,
        jobNumber: null,
        idCardNo: null,
        remark: null
      },
      batchPersonnelListTag: {
        all: 0,
        success: 0,
        warning: 0,
        danger: 0
      },
      batchPersonnelListPercentage: 0,
      batchPersonnelListCount: 0,
      downloadLoading: false,
      batchPersonnelListBtnDisabled: false,
      searchForm: {
        name: null,
        mobilePhone: null,
        sex: null,
        idCardNo: null,
        icCard: null
      },
      createTime: null,
      dialogTitle: null,
      nameDisabled: false,
      userImgList: [],
      isLoading: false,
      dialogWidth: '40%',
      batchPersonnelList: [],
      rules: {
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        mobilePhone: [
          { required: false, validator: validatorPhone, trigger: 'blur' }
        ],
        deviceCodes: [
          { required: true, message: '请输入设备ID', trigger: 'blur' }
        ],
        deviceGroup: [
          { required: true, message: '请选择组织', trigger: 'blur' }
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
    // this.restaurants = this.loadAll()
  },
  methods: {
    getList(data) {
      this.listLoading = true
      data.page = this.listQuery.page
      data.limit = this.listQuery.limit
      data.sort = this.listQuery.sort
      fetchBlacklistList(data).then(response => {
        this.userImgList = []
        this.list = response.data.items
        this.total = response.data.total
        this.list.forEach((item) => { this.userImgList.push(item.faceUrl) })
        this.listLoading = false
      })
    },
    async handleEdit(info) {
      await loadAllDevice().then((res) => {
        this.restaurants = res.data
        var deviceGroup = res.data.find(item => { return item.label === info.deviceGroup })
        this.nameDisabled = true
        this.dialogFormVisible = true
        this.addUserForm.name = info.name
        this.addUserForm.mobilePhone = info.mobilePhone
        this.addUserForm.sex = info.sex + ''
        this.addUserForm.icCard = info.icCard
        this.addUserForm.endTime = info.validDateEnd
        this.addUserForm.imageUrl = info.faceUrl
        this.addUserForm.deviceGroup = deviceGroup ? deviceGroup.value : null
        this.addUserForm.remark = info.remark
        this.addUserForm.personId = info.personId
        this.addUserForm.jobNumber = info.jobNumber
        this.addUserForm.openDoorPassword = info.openDoorPassword
        this.addUserForm.idCardNo = info.idCardNo
      })
    },
    handleDelete(personId) {
      deleteBlacklistUser(personId).then(res => {
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
          var date = parseTime(this.addUserForm.endTime, '{y}-{m}-{d} 23:59:59')
          this.addUserForm.endTime = new Date(date).getTime()
          editBlacklistUser(this.addUserForm).then(res => {
            this.dialogFormVisible = false
            if (res.status === 200) {
              this.$message.success(res.message)
              this.getList(this.searchForm)
              this.$refs[form].resetFields()
            } else {
              this.$message.error(res.message)
              this.$refs[form].resetFields()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // querySearch(queryString, cb) {
    //   this.loadAll()
    //   var restaurants = this.restaurants
    //   var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
    //   // 调用 callback 返回建议列表的数据
    //   console.log(results)
    //   cb(results)
    // },
    // createFilter(queryString) {
    //   return (restaurant) => {
    //     return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    //   }
    // },
    async loadAll() {
      await loadAllDevice().then(res => {
        this.restaurants = res.data
      })
    },
    upLoad(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      uploadImg(formData).then((res) => {
        if (res.status === 200) {
          this.addUserForm.imageUrl = res.data // 请求之后将返回的URL给修改的接口在进行一次修改请求
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    uploadUploadPersonnelFile(param) {
      this.batchPersonnelListTag.all = 0
      this.batchPersonnelListTag.success = 0
      this.batchPersonnelListTag.warning = 0
      this.batchPersonnelListTag.danger = 0
      this.batchPersonnelListPercentage = 0
      this.batchPersonnelListPercentageNum = 0
      var fileObj = param.file
      this.$refs.uploadUploadPersonnelFileRef.clearFiles() // 上传前清除历史记录
      // FormData 对象
      var form = new FormData()
      // 文件对象
      form.append('file', fileObj)
      batchUploadPersonnel(form).then((res) => {
        if (res.status === 200) {
          this.$message.success(res.message)
          this.batchPersonnelList = res.data
          this.batchPersonnelListCount = res.data.length
          this.batchPersonnelList.forEach((item) => { this.userImgList.push(item.imageUrl) })
          this.batchPersonnelListTag.all = res.data.length
          if (this.batchPersonnelList.length > 0) {
            this.batchPersonnelListBtnDisabled = false
          }
        } else {
          this.$message.error(res.message)
        }
      }).finally(() => {})
    },
    async clickBatchPersonnelList() {
      await loadAllDevice().then(async(r) => {
        var batchPersonnelListPercentageNum = 0
        this.batchPersonnelListBtnDisabled = true
        for (const item of this.batchPersonnelList) {
          const deviceGroup = r.data.find(g => g.label === item.deviceGroup)
          item.deviceGroup = deviceGroup === undefined ? null : deviceGroup.value
          item.faceUrl = item.imageUrl
          await addBlacklistUser(item).then((res) => {
            this.dialogFormVisible = false
            this.isLoading = false
            if (res.status === 200) {
              if (item.deviceGroup === null) {
                this.batchPersonnelListTag.warning++
              } else {
                this.batchPersonnelListTag.success++
              }
              // this.batchPersonnelList.splice(item, 1)
            } else {
              this.batchPersonnelListTag.danger++
            }
          }).catch((err) => {
            this.isLoading = false
            err
            this.batchPersonnelListTag.danger++
          }).finally(() => {
            // this.batchPersonnelList.splice(item, 1)
            this.batchPersonnelListPercentage = parseInt((++batchPersonnelListPercentageNum / this.batchPersonnelListCount) * 100)
          })
        }
        if (this.batchPersonnelListTag.warning > 0) {
          this.$message.warning('添加人员完成, 部分设备组未找到请手动修改')
        }
        this.getList(this.searchForm)
        this.batchPersonnelListBtnDisabled = false
      })
    },
    //  handleSuccess(file) {
    // console.log(file);
    // this.$store.dispatch('person/setAvatar', '头像地址');
    // },
    addUsers(addUserForm) {
      var date = parseTime(this.addUserForm.endTime, '{y}-{m}-{d} 23:59:59')
      this.addUserForm.endTime = new Date(date).getTime()
      this.$refs[addUserForm].validate((valid) => {
        if (valid) {
          this.isLoading = true
          addBlacklistUser(this.addUserForm).then(res => {
            this.dialogFormVisible = false
            this.$refs[addUserForm].resetFields()
            this.isLoading = false
            if (res.status === 200) {
              this.getList(this.searchForm)
              this.$message.success(res.message)
            } else {
              this.$message.error(res.message)
            }
          }).catch((err) => {
            this.isLoading = false
            err
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closedDialog() {
      this.nameDisabled = false
      this.addUserForm.name = null
      this.addUserForm.mobilePhone = null
      this.addUserForm.sex = null
      this.addUserForm.icCard = null
      this.addUserForm.endTime = null
      this.addUserForm.imageUrl = null
      this.addUserForm.deviceGroup = null
      this.addUserForm.remark = null
      this.addUserForm.jobNumber = null
      this.addUserForm.openDoorPassword = null
      this.batchPersonnelList = []
      this.batchPersonnelListTag.all = 0
      this.batchPersonnelListTag.success = 0
      this.batchPersonnelListTag.warning = 0
      this.batchPersonnelListTag.danger = 0
      this.batchPersonnelListPercentage = 0
      this.batchPersonnelListPercentageNum = 0
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
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isJPG && isLt2M
    },
    indexMethod(index) {
      return ((this.listQuery.page - 1) * this.listQuery.limit) + index + 1
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        (async() => {
          let jsonList = ''
          await fetchBlacklistList().then(response => { jsonList = response.data.items })
          const tHeader = ['姓名', '手机', '门禁卡号', '身份证', '设备组', '过期时间', '创建时间', '员工照片', '备注']
          const filterVal = ['name', 'mobilePhone', 'icCard', 'idCardNo', 'deviceGroup', 'validDateEnd', 'validDateStart', 'faceUrl', 'remark']
          const data = this.formatJson(filterVal, jsonList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'Employee：' + parseTime(new Date())
          })
          this.downloadLoading = false
        })()
      })
    },
    formatJson(filterVal, jsonList) {
      return jsonList.map(v => filterVal.map(j => {
        if (j === 'validDateStart') {
          return parseTime(v[j])
        }
        if (j === 'validDateEnd') {
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
      this.searchForm.beginTime = null
      this.searchForm.endTime = null
      this.$refs[searchForm].resetFields()
      this.getList(this.listQuery)
    },
    search() {
      this.listLoading = true
      this.searchForm.page = this.listQuery.page = 1
      this.searchForm.limit = this.listQuery.limit
      this.searchForm.sort = this.listQuery.sort
      if (this.createTime !== null) {
        this.searchForm.beginTime = this.createTime[0]
        this.searchForm.endTime = this.createTime[1]
      }
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
  .upload-demo{
    text-align: center;
  }
</style>
