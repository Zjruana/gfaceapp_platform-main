<template>
  <div class="app-container">
    <el-form ref="searchForm" size="small" :inline="true" :model="searchForm">
      <el-form-item prop="userName" label="员工姓名:">
        <el-input v-model="searchForm.userName" placeholder="员工姓名" />
      </el-form-item>
      <el-form-item prop="month" label="月份:">
        <el-date-picker
          v-model="searchForm.month"
          type="month"
          placeholder="选择月份"
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
    <!-- ----------------搜索结束---------------- -->
    <el-table
      v-loading="listLoading"
      :row-style="{height: '50px'}"
      :cell-style="{padding: '0'}"
      :header-cell-style="{background:'#eef1f6', padding: '10px 0'}"
      style="width: 100%;margin-top:5px"
      :data="list"
      fit
    >
      <el-table-column label="考勤编号" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工姓名" prop="userName" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="月份" prop="month" align="center">
        <template slot-scope="{row}">
          <span>{{ row.month }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出勤天数" prop="attendanceDays" align="center">
        <template slot-scope="{row}">
          <span>{{ row.attendanceDays }}</span>
        </template>
      </el-table-column>
      <el-table-column label="休息天数" prop="offDays" align="center">
        <template slot-scope="{row}">
          <span>{{ row.offDays }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作时长(分)" prop="workTime" align="center">
        <template slot-scope="{row}">
          <span>{{ row.workTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="迟到天数" prop="lateDay" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lateDay }}</span>
        </template>
      </el-table-column>
      <el-table-column label="迟到时长(分)" prop="lateTime" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="早退次数" prop="retreatNumber" align="center">
        <template slot-scope="{row}">
          <span>{{ row.retreatNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="早退时长" prop="retreatTime" align="center">
        <template slot-scope="{row}">
          <span>{{ row.retreatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="缺卡次数" prop="lackNumber" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lackNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="note" align="center">
        <template slot-scope="{row}">
          <span>{{ row.note }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { parseTime } from '@/utils'
import { attendanceMonthList } from '@/api/attendance'
export default {
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
      },
      downloadLoading: false,
      searchForm: {
        userName: null,
        shiftType: null,
        attendanceStatus: null,
        attendanceTime: null
      }
    }
  },
  created() {
    this.getList(this.searchForm)
  },
  methods: {
    getList(data) {
      this.listLoading = true
      data.page = this.listQuery.page
      data.limit = this.listQuery.limit
      data.sort = this.listQuery.sort
      attendanceMonthList(data).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        (async() => {
          let jsonList = ''
          await attendanceMonthList().then(response => { jsonList = response.data.items })
          const tHeader = ['考勤编号', '员工姓名', '月份', '出勤天数', '休息天数', '工作时长(分)', '迟到天数', '迟到时长(分)', '早退次数', '早退时长', '缺卡次数', '备注']
          const filterVal = ['id', 'userName', 'month', 'attendanceDays', 'offDays', 'workTime', 'lateDay', 'lateTime', 'retreatNumber', 'retreatTime', 'lackNumber', 'note']
          const data = this.formatJson(filterVal, jsonList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'AttendanceMonthList' + parseTime(new Date())
          })
          this.downloadLoading = false
        })()
      })
    },
    formatJson(filterVal, jsonList) {
      return jsonList.map(v => filterVal.map(j => {
        if (j === 'workTime') {
          return parseTime(v[j])
        }
        if (j === 'lateTime') {
          return parseTime(v[j])
        }
        if (j === 'retreatTime') {
          return parseTime(v[j])
        }
        return v[j]
      }))
    },
    reset(searchForm) {
      this.$refs[searchForm].resetFields()
      this.getList(this.listQuery)
    },
    search() {
      this.listLoading = true
      this.searchForm.page = this.listQuery.page = 1
      this.searchForm.limit = this.listQuery.limit
      this.searchForm.sort = this.listQuery.sort
      this.getList(this.searchForm)
      this.listLoading = false
    }
  }
}
</script>
