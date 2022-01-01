<template>
  <div class="app-container">
    <el-form ref="searchForm" size="small" :inline="true" :model="searchForm">
      <el-form-item prop="userName" label="员工姓名:">
        <el-input v-model="searchForm.userName" placeholder="员工姓名" />
      </el-form-item>
      <el-form-item prop="attendanceStatus" label="考勤状态:">
        <el-select v-model="searchForm.attendanceStatus" placeholder="请选择">
          <el-option label="未打卡" value="-1" />
          <el-option label="正常" value="1" />
          <el-option label="迟到" value="2" />
          <el-option label="早退" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item prop="attendanceTime" label="考勤日期:">
        <el-date-picker
          v-model="searchForm.attendanceTime"
          type="date"
          placeholder="选择日期"
          align="center"
          format="yyyy 年 MM 月 dd 日"
          value-format="timestamp"
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
      :span-method="objectSpanMethod"
      :row-style="{height: '50px'}"
      :cell-style="{padding: '0'}"
      :header-cell-style="{background:'#eef1f6', padding: '10px 0'}"
      style="width: 100%;margin-top:5px"
      :data="list"
      fit
    >
      <el-table-column label="考勤日期" prop="attendanceTime" align="center">
        <template slot-scope="{row}">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班次编号" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工姓名" prop="userName" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组织" prop="deviceGroup" align="center">
        <template slot-scope="{row}">
          <span>{{ row.deviceGroup }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班次名称" prop="shiftName" align="center">
        <template slot-scope="{row}">
          <span>{{ row.workName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上班时间" prop="shiftType" align="center">
        <template slot-scope="{row}">
          <span>{{ row.toWorkSignTime|timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下班时间" prop="attendanceStatus" align="center">
        <template slot-scope="{row}">
          <span>{{ row.offWorkSignTime|timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="异常时长" prop="errorTime" align="center">
        <template slot-scope="{row}">
          <span>{{ row.errorTime }}</span>
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
import { attendanceList } from '@/api/attendance'
export default {
  filters: {
    timeFilter(time) {
      if (time === -1) {
        return '未打卡'
      }
      return parseTime(time, '{h}:{i}:{s}')
    }
  },
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
      attendanceList(data).then(response => {
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
          await attendanceList().then(response => { jsonList = response.data.items })
          const tHeader = ['考勤编号', '员工姓名', '考勤日期', '班次名称', '打卡时间', '班次类型', '考勤状态', '异常时长', '备注']
          const filterVal = ['id', 'userName', 'attendanceTime', 'shiftName', 'toWorkTime', 'shiftType', 'attendanceStatus', 'errorTime', 'note']
          const data = this.formatJson(filterVal, jsonList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'AttendanceList：' + parseTime(new Date())
          })
          this.downloadLoading = false
        })()
      })
    },
    formatJson(filterVal, jsonList) {
      return jsonList.map(v => filterVal.map(j => {
        if (j === 'attendanceTime') {
          return parseTime(v[j])
        }
        if (j === 'toWorkTime') {
          return parseTime(v[j])
        }
        return v[j]
      }))
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log(row)
      // console.log(column)
      // console.log(rowIndex)
      // console.log(columnIndex)
      // console.log('------------')
      // if (columnIndex === 0) {
      //   if (rowIndex % 6 === 0) {
      //     return {
      //       rowspan: 6,
      //       colspan: 1
      //     }
      //   } else {
      //     return {
      //       rowspan: 0,
      //       colspan: 0
      //     }
      //   }
      // }
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
