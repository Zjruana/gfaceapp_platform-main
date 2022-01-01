<template>
  <div class="dashboard-container">
    <div v-loading="listLoading" class="dashboard-editor-container">

      <panel-group
        :today-guokang-green="todayGuokangGreen"
        :today-guokang-yellow="todayGuokangYellow"
        :today-guokang-red="todayGuokangRed"
        :early-warn-status="earlyWarnStatus"
        :early-warn-data="earlyWarnData"
        :stranger="stranger"
        :blacklist="blacklist"
        :all-record="allRecord"
        :yuangong="yuangong"
        :fangke="fangke"
        :all-device="allDevice"
      />

      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart v-if="isShow" :chart-blacklist="chartBlacklist" :chart-stranger="chartStranger" :chart-data-time="chartDataTime" :chart-fangkes="chartFangkes" :chart-door-count="chartDoorCount" />
      </el-row>

      <el-row :gutter="8">
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 8}" :xl="{span: 8}" style="margin-bottom:30px;">
          <div class="chart-wrapper">
            <real-time-preview />
          </div>
        </el-col>
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 16}" :xl="{span: 16}" style="padding-right:8px;margin-bottom:30px;">
          <transaction-table />
        </el-col>
      </el-row>
      <el-dialog
        :visible.sync="dialogEarlyWarn"
        width="60%"
        @closed="closedEarlyWarn"
      >
        <span slot="title" style="color: red;">新预警提醒!</span>
        <div v-for="(item, index) in dialogEarlyWarnList" :key="index">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-image v-show="item.picUrl!==null" fit="scale-down" :preview-src-list="[item.picUrl]" style="width: 100%; height: 350px" :src="item.picUrl">
                  <div slot="error" style="width: 100%; height:350px; background-color: #F5F7FA; line-height:350px;color: #909399;vertical-align: middle;text-align:center;vertical-align: middle;">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
                <div style="padding: 14px;">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-tag v-if="item.temperature >= 37.3" style="width: 100%" :type="item.temperature | temperatureTagFilter">
                        体温过高: {{ item.temperature | temperatureFilter }}
                      </el-tag>
                    </el-col>
                    <el-col :span="12">
                      <el-tag v-if="item.guokangStatus === '2' || item.guokangStatus === '3'" style="width: 100%" :type="item.guokangStatus | statusFilter">
                        健康码异常: {{ item.guokangStatus | healthTypeFilter }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
              <el-col :span="12">
                <el-descriptions style="margin-top: 15px" :column="1">
                  <el-descriptions-item label="姓名">{{ item.name }}</el-descriptions-item>
                  <el-descriptions-item label="人员类型">{{ item.personType | personTypeFilter }}</el-descriptions-item>
                  <el-descriptions-item label="来源设备">{{ item.deviceCode }}</el-descriptions-item>
                  <el-descriptions-item label="体温"><el-tag :type="item.temperature | temperatureTagFilter">{{ item.temperature | temperatureFilter }}</el-tag></el-descriptions-item>
                  <el-descriptions-item label-class-name="my-label" label="健康码"><el-tag :type="item.guokangStatus | statusFilter">{{ item.guokangStatus | healthTypeFilter }}</el-tag></el-descriptions-item>
                  <el-descriptions-item label="身份证号"> {{ item.guokangCardId }} </el-descriptions-item>
                  <el-descriptions-item label="核酸记录"> {{ item.hsjl | hsjlFilter }} </el-descriptions-item>
                  <el-descriptions-item label="疫苗记录"> {{ item.ymjl | ymjlFilter }} </el-descriptions-item>
                  <el-descriptions-item label="行程记录"> {{ item.xcjl === null ? '未知' : item.xcjl }} </el-descriptions-item>
                  <el-descriptions-item label="通行时间"> {{ item.recordTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }} </el-descriptions-item>
                </el-descriptions>
              </el-col>
            </el-row>
          </el-card>
          <br>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogEarlyWarn = false">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>

// import PanelGroup from './components/PanelGroup'
// import LineChart from './components/LineChart'
// import PieChart from './components/PieChart'
import TransactionTable from './components/TransactionTable'
import { fetchRecordInfo, fetchEarlyWarnList } from '@/api/dashboard'

export default {
  name: 'Dashboard',
  components: {
    PanelGroup: () => import('./components/PanelGroup'),
    LineChart: () => import('./components/LineChart'),
    RealTimePreview: () => import('./components/RealTimePreview'),
    TransactionTable
  },
  filters: {
    personTypeFilter(num) {
      const personTypeMap = {
        0: '员工',
        1: '访客',
        2: '黑名单',
        3: '陌生人'
      }
      return personTypeMap[num]
    },
    statusFilter(status) {
      const statusMap = {
        null: 'info',
        1: 'success',
        2: 'warning',
        3: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      listLoading: true,
      allRecord: null,
      fangke: null,
      yuangong: null,
      blacklist: null,
      stranger: null,
      allDevice: null,
      todayGuokangRed: null,
      todayGuokangYellow: null,
      todayGuokangGreen: null,
      chartDataTime: [],
      chartDoorCount: [],
      chartFangkes: [],
      chartBlacklist: [],
      chartStranger: [],
      isShow: false,
      toMonth: null,
      timer: null,
      earlyWarnData: null,
      dialogEarlyWarn: false,
      dialogEarlyWarnList: [],
      earlyWarnStatus: false
    }
  },
  activated: function() {
    this.getList()
    this.setTimer()
  },
  deactivated: function() {
    clearInterval(this.timer)
    this.timer = null
  },
  created() {
    this.listLoading = true
    this.getList()
    this.setTimer()
  },
  beforeDestroy() {
    console.log(1)
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    getList() {
      this.isShow = false
      fetchRecordInfo().then(response => {
        this.allRecord = response.data.recordInfo.allRecord
        this.yuangong = response.data.recordInfo.todayDoorRecord
        this.fangke = response.data.recordInfo.todayVisRecord
        this.stranger = response.data.recordInfo.todayStranger
        this.blacklist = response.data.recordInfo.todayBlacklist
        this.allDevice = response.data.recordInfo.allDevice
        this.todayGuokangRed = response.data.recordInfo.todayGuokangRed
        this.todayGuokangYellow = response.data.recordInfo.todayGuokangYellow
        this.todayGuokangGreen = response.data.recordInfo.todayGuokangGreen
        this.chartDataTime = response.data.dataTime
        this.chartDoorCount = response.data.doorCount
        this.chartFangkes = response.data.visCount
        this.chartBlacklist = response.data.blackCount
        this.chartStranger = response.data.strangerCount
        this.isShow = true
        this.listLoading = false
      })
    },
    closedEarlyWarn() {
      // 弹框关闭，清空数组
      this.dialogEarlyWarnList = []
    },
    setTimer() {
      clearTimeout(this.timer)
      const that = this
      this.timer = setTimeout(async() => {
        await fetchEarlyWarnList('get').then(res => {
          that.earlyWarnData = res.data
          // 在数组头部添加
          res.data.filter((item) => { return item.newMsg }).forEach(element => {
            this.dialogEarlyWarnList.unshift(element)
            // 弹框打开后，消息类型变为非新消息
            fetchEarlyWarnList('popOk', { 'ids': element.id })
          })
          // 有新消息显示弹窗
          if (this.dialogEarlyWarnList.length > 0) {
            this.dialogEarlyWarn = true
          }
          this.earlyWarnStatus = true
        }).catch(() => { this.earlyWarnStatus = false }).finally(() => {
          that.setTimer() // 使用finally递归的好处： 不会有卡死的情况
        })
      }, 5000)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

