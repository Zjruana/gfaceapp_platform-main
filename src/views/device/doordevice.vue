<template>
  <div class="app-container">
    <el-form ref="searchForm" size="small" :inline="true" :model="searchForm">
      <el-form-item prop="deviceId" label="设备ID:">
        <el-input v-model="searchForm.deviceId" placeholder="设备ID" />
      </el-form-item>
      <el-form-item prop="vendors" label="设备厂商:">
        <el-input v-model="searchForm.vendors" placeholder="设备厂商" />
      </el-form-item>
      <el-form-item prop="deviceName" label="设备名:">
        <el-input v-model="searchForm.deviceName" placeholder="设备名" />
      </el-form-item>
      <el-form-item prop="location" label="位置:">
        <el-input v-model="searchForm.location" placeholder="位置" />
      </el-form-item>
      <el-form-item prop="openType" label="进出类方向:">
        <el-select v-model="searchForm.openType" placeholder="请选择">
          <el-option label="进" value="1" />
          <el-option label="出" value="2" />
          <el-option label="未知" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item prop="status" label="设备状态:">
        <el-select v-model="searchForm.status" placeholder="请选择">
          <el-option label="未知" value="-1" />
          <el-option label="正常" value="1" />
          <el-option label="异常" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item prop="date" label="创建时间:">
        <el-date-picker
          v-model="visitTime"
          style="width:230px"
          type="daterange"
          range-separator="-"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
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

    <el-button size="mini" type="primary" icon="el-icon-plus" @click="dialogFormVisible = true,loadAll(),dialogTitle='添加设备'">新增</el-button><el-divider direction="vertical" />
    <!-- -------------------------------编辑------------------------------- -->
    <el-dialog :width="dialogWidth" :title="dialogTitle" :visible.sync="dialogFormVisible" @closed="closedDialog()">
      <el-form ref="addDeviceForm" label-width="90px" :rules="rules" :inline="true" :model="addDeviceForm">
        <el-form-item v-show="deviceCodeDisabled" prop="deviceCode" label="设备ID:">
          <el-input v-model="addDeviceForm.deviceCode" :disabled="deviceCodeDisabled" style="width:205px" placeholder="设备ID" />
        </el-form-item>
        <el-form-item v-if="!deviceCodeDisabled" prop="deviceIP">
          <span slot="label">IP / ID
            <el-popover
              v-if="!deviceCodeDisabled"
              placement="top-start"
              width="400"
              trigger="hover"
            >
              <div>可输入设备ID 或 设备 IP, 当前服务器地址为
                <div><br>
                  <el-input v-model="serverUrl" style="width: 300px" size="mini" placeholder="不填则恢复默认地址" />
                  <el-button type="primary" size="mini" style="margin-left: 10px" @click="updateServerUrl">修改</el-button>
                </div>
              </div>
              <span slot="reference"><i class="el-icon-question" /></span>
            </el-popover>
          </span>
          <el-input v-model="addDeviceForm.deviceIP" :disabled="deviceIPDisabled" style="width:205px" placeholder="例: 192.168.x.x 或 设备ID" />
        </el-form-item>
        <el-form-item v-else prop="editDeviceIP">
          <span slot="label">设备IP
            <el-popover
              v-if="deviceCodeDisabled"
              placement="top-start"
              width="400"
              trigger="hover"
            >
              <div>输入 IP 将重新请求设备(不是IP将不请求),设置新的服务器地址
                <div><br>
                  <el-input v-model="serverUrl" style="width: 300px" size="mini" placeholder="不填则恢复默认地址" />
                  <el-button type="primary" size="mini" style="margin-left: 10px" @click="updateServerUrl">修改</el-button>
                </div>
              </div>
              <span slot="reference"><i class="el-icon-question" /></span>
            </el-popover>
          </span>
          <el-input v-model="addDeviceForm.deviceIP" style="width:205px" placeholder="设备IP" />
        </el-form-item>
        <el-form-item prop="deviceName" label="设备名称:">
          <el-input v-model="addDeviceForm.deviceName" style="width:205px" placeholder="设备名称" />
        </el-form-item>
        <el-form-item prop="location" label="设备位置:">
          <el-input v-model="addDeviceForm.location" style="width:205px" placeholder="设备位置" />
        </el-form-item>
        <el-form-item prop="vendors" label="设备厂商:">
          <el-input v-model="addDeviceForm.vendors" style="width:205px" placeholder="设备厂商" />
        </el-form-item>
        <el-form-item prop="deviceGroup" label="设备组:">
          <!-- <el-input v-model="addDeviceForm.deviceGroup" style="width:205px" placeholder="设备组" />           -->
          <el-select
            v-model="addDeviceForm.deviceGroup"
            style="width: 100%"
            filterable
            allow-create
            default-first-option
            placeholder="输入或选择"
          >
            <el-option
              v-for="item in restaurants"
              :key="item.value"
              :value-key="new Date().getTime()"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="openType" label="进出方向:">
          <el-select v-model="addDeviceForm.openType" placeholder="请选择">
            <el-option label="进" value="1" />
            <el-option label="出" value="2" />
            <el-option label="未知" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item prop="remark" label="备注:">
          <el-input v-model="addDeviceForm.remark" style="width:505px" placeholder="备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closedDialog(), dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loadingDevice" @click="dialogTitle=='添加设备'?addDevice('addDeviceForm'):editDoorDevice('addDeviceForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- ------------------------- -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :row-style="{height: '50px'}"
      :cell-style="{padding: '0'}"
      :header-cell-style="{background:'#eef1f6', padding: '10px 0'}"
      style="width: 100%;margin-top:5px"
      :data="list"
      fit
      highlight-current-row
    >
      <el-table-column
        label="设备编号"
        prop="id"
        align="center"
        width="80"
        type="index"
        :index="indexMethod"
      />
      <el-table-column label="设备名" prop="deviceName" align="center">
        <template slot-scope="{row}">
          <span>{{ row.deviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备ID" prop="deviceId" align="center">
        <template slot-scope="{row}">
          <span>{{ row.deviceCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备IP" prop="deviceIP" align="center">
        <template slot-scope="{row}">
          <span>{{ row.deviceIP }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备厂商" prop="vendors" align="center">
        <template slot-scope="{row}">
          <span>{{ row.vendors }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进出方向" prop="location" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.openType | deviceTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="位置" prop="location" align="center">
        <template slot-scope="{row}">
          <span>{{ row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" align="center" width="100">
        <template slot="header">
          <span>设备状态</span>
          <el-tooltip popper-class="tooltip" placement="top">
            <i class="el-icon-question" />
            <div slot="content" class="tooltip-content">
              <div>在线：设备正常运行</div>
              <div>离线：超过60s没有与设备取得连接</div>
              <div>未知：新添加的设备，等待20s后才进行状态更新</div>
            </div>
          </el-tooltip>
        </template>
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusTagFilter">{{ row.status | statusTypeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="设备组" prop="deviceGroup" align="center">
        <template slot-scope="{row}">
          <span>{{ row.deviceGroup }}</span>
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
            @click="handleEdit(row),loadAll(),dialogTitle='修改设备'"
          ><i class="el-icon-edit" />编辑</el-button>

          <el-popconfirm
            style="margin-left: 10px"
            title="确定删除此设备吗？"
            @confirm="handleDelete(row.deviceCode)"
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
<style>
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
<script>
import { fetchDoordeviceList, addDoorDevice, deleteDoorDevice, editDoorDevice, changeServerUrl } from '@/api/device'
import { loadAllDevice } from '@/api/personnel'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import $ from 'jquery'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  filters: {
    statusTypeFilter(status) {
      const statusMap = {
        0: '未知',
        1: '在线',
        2: '离线'
      }
      return statusMap[status]
    },
    statusTagFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listDeviceLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
      },
      downloadLoading: false,
      searchForm: {
        deviceId: null,
        deviceName: null,
        vendors: null,
        location: null,
        status: null,
        openType: null
      },
      visitTime: null,
      addDeviceForm: {
        deviceCode: null,
        deviceName: null,
        location: null,
        openType: null,
        vendors: null,
        remark: null,
        deviceGroup: null,
        deviceIP: null
      },
      loadingDevice: false,
      serverUrl: null,
      dialogWidth: '40%',
      dialogFormVisible: false,
      tableDeviceData: null,
      dialogTitle: null,
      deviceCodeDisabled: false,
      deviceIPDisabled: false,
      inputIp1: null,
      inputIp2: null,
      restaurants: [],
      rules: {
        // deviceCode: [
        //   { required: true, message: '请输入设备ID', trigger: 'blur' }
        // ],
        deviceIP: [
          { required: true, message: '请输入设备IP 或 设备ID', trigger: 'blur' }
        ],
        deviceGroup: [
          { required: true, message: '请输入设备组', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.setDialogWidth()
    this.getList(this.searchForm)
    this.serverUrl = this.$store.getters.serverUrl
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
      data.sort = this.listQuery.sort
      fetchDoordeviceList(data).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleEdit(info) {
      this.deviceIPDisabled = false
      this.dialogFormVisible = true
      this.addDeviceForm.deviceCode = info.deviceCode
      this.addDeviceForm.deviceName = info.deviceName
      this.addDeviceForm.location = info.location
      this.addDeviceForm.openType = info.openType + ''
      this.addDeviceForm.vendors = info.vendors
      this.addDeviceForm.remark = info.remark
      this.addDeviceForm.deviceGroup = info.deviceGroup
      this.addDeviceForm.deviceIP = info.deviceIP
      this.deviceCodeDisabled = true
    },
    async loadAll() {
      await loadAllDevice().then(res => {
        this.restaurants = res.data
      })
    },
    editDoorDevice(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loadingDevice = true
          // 如果编辑时，设备ip有填入，就再去请求设备设置服务器地址
          var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
          const isIp = reg.test(this.addDeviceForm.deviceIP)
          if (isIp) {
            const s_url = 'http://' + this.addDeviceForm.deviceIP + ':6789/device/setHttpServiceUrl?httpServiceUrl=' + this.serverUrl
            $.ajax({
              url: s_url,
              method: 'get',
              timeout: 3000
            }).then(res => {
              res = JSON.parse(res)
              if (res.code === 200) {
                this.$message.success('更新设备服务器地址成功：' + this.serverUrl)
              } else {
                this.addDeviceForm.deviceIP = null
                this.$message.error(res.message)
                this.$refs[form].resetFields()
              }
              editDoorDevice(this.addDeviceForm).then(res => {
                this.dialogFormVisible = false
                if (res.status === 200) {
                  this.$message.success(res.message)
                  this.getList(this.searchForm)
                  this.$refs[form].resetFields()
                } else {
                  this.$message.error(res.message)
                  this.$refs[form].resetFields()
                }
              }).finally(() => {
                this.loadingDevice = false
              })
            }).catch(err => {
              console.log(err)
              this.addDeviceForm.deviceIP = null
              editDoorDevice(this.addDeviceForm).then(res => {
                this.dialogFormVisible = false
                if (res.status === 200) {
                  this.$message.warning('设备端：请求失败, 修改设备信息：' + res.message)
                  this.getList(this.searchForm)
                  this.$refs[form].resetFields()
                } else {
                  this.$message.error(res.message)
                  this.$refs[form].resetFields()
                }
              }).finally(() => {
                this.loadingDevice = false
              })
              this.loadingDevice = false
            })
          } else {
            this.addDeviceForm.deviceIP = null
            editDoorDevice(this.addDeviceForm).then(res => {
              this.dialogFormVisible = false
              if (res.status === 200) {
                this.$message.success(res.message)
                this.getList(this.searchForm)
                this.$refs[form].resetFields()
              } else {
                this.$message.error(res.message)
                this.$refs[form].resetFields()
              }
            }).finally(() => {
              this.loadingDevice = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleDelete(deviceCode) {
      deleteDoorDevice(deviceCode).then(res => {
        if (res.status === 200) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
        this.getList(this.searchForm)
      })
    },
    closedDialog() {
      this.deviceCodeDisabled = false
      this.addDeviceForm.deviceCode = null
      this.addDeviceForm.deviceName = null
      this.addDeviceForm.location = null
      this.addDeviceForm.openType = null
      this.addDeviceForm.vendors = null
      this.addDeviceForm.remark = null
      this.addDeviceForm.deviceGroup = null
      this.addDeviceForm.deviceIP = null
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
    updateServerUrl() {
      changeServerUrl({ 'serverUrl': this.serverUrl }).then(res => {
        if (res.status === 200) {
          this.$store.dispatch('user/getInfo').then(() => {
            this.serverUrl = this.$store.getters.serverUrl
            this.$message.success(res.message)
          }).catch(() => {
            this.$message.error('err')
          })
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.$message.error('error')
      })
    },
    addDevice(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loadingDevice = true
          var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
          const isIp = reg.test(this.addDeviceForm.deviceIP)
          if (isIp) {
            const s_url = 'http://' + this.addDeviceForm.deviceIP + ':6789/device/setHttpServiceUrl?httpServiceUrl=' + this.serverUrl
            $.ajax({
              url: s_url,
              method: 'get',
              timeout: 3000
            }).then(res => {
              res = JSON.parse(res)
              if (res.code === 200) {
                this.addDeviceForm.deviceCode = res.data.deviceCode
                addDoorDevice(this.addDeviceForm).then(res => {
                  this.dialogFormVisible = false
                  if (res.status === 200) {
                    this.$message.success(res.message)
                    this.getList(this.searchForm)
                    this.$refs[form].resetFields()
                  } else {
                    this.$message.error(res.message)
                    this.$refs[form].resetFields()
                  }
                }).finally(() => {
                  this.loadingDevice = false
                })
              } else {
                this.$message.error(res.message)
                this.$refs[form].resetFields()
              }
            }).catch(err => {
              console.log(err)
              this.$message.error('请求设备失败')
              this.loadingDevice = false
            })
          } else {
            this.addDeviceForm.deviceCode = this.addDeviceForm.deviceIP
            this.addDeviceForm.deviceIP = null
            addDoorDevice(this.addDeviceForm).then(res => {
              this.dialogFormVisible = false
              if (res.status === 200) {
                this.$message.success(res.message)
                this.getList(this.searchForm)
                this.$refs[form].resetFields()
              } else {
                this.$message.error(res.message)
                this.$refs[form].resetFields()
              }
            }).finally(() => {
              this.loadingDevice = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    indexMethod(index) {
      return ((this.listQuery.page - 1) * this.listQuery.limit) + index + 1
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        (async() => {
          let jsonList = ''
          await fetchDoordeviceList().then(response => { jsonList = response.data.items })
          const tHeader = ['设备ID', '设备型号', '设备名', '进出方向', '位置', '创建时间', '设备状态', '备注']
          const filterVal = ['deviceCode', 'vendors', 'deviceName', 'openType', 'location', 'createTime', 'status', 'remark']
          const data = this.formatJson(filterVal, jsonList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'DoorDevice：' + parseTime(new Date())
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
        if (j === 'openType') {
          return this.$options.filters.deviceTypeFilter(v[j])
        }
        if (j === 'status') {
          return this.$options.filters.statusTypeFilter(v[j])
        }
        return v[j]
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    reset(searchForm) {
      this.visitTime = null
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
      if (this.visitTime !== null) {
        this.searchForm.beginTime = this.visitTime[0]
        this.searchForm.endTime = this.visitTime[1]
      }
      this.getList(this.searchForm)
      this.listLoading = false
    }
  }
}
</script>
