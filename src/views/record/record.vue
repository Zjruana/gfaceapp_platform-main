<template>
  <div class="app-container">
    <el-form ref="searchForm" size="small" :inline="true" :model="searchForm">
      <el-form-item prop="name" label="姓名:">
        <el-input v-model="searchForm.name" placeholder="姓名" />
      </el-form-item>
      <el-form-item prop="deviceName" label="设备名称:">
        <el-input v-model="searchForm.deviceName" placeholder="设备名称" />
      </el-form-item>
      <el-form-item prop="icCard" label="门禁卡:">
        <el-input v-model="searchForm.icCard" placeholder="门禁卡号" />
      </el-form-item>
      <el-form-item prop="occlusion" label="佩戴口罩:">
        <el-select v-model="searchForm.occlusion" placeholder="请选择">
          <el-option label="未开启" value="-1" />
          <el-option label="未佩戴" value="0" />
          <el-option label="佩戴" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item prop="guokangStatus" label="健康码:">
        <el-select v-model="searchForm.guokangStatus" placeholder="请选择">
          <el-option label="绿码" value="1" />
          <el-option label="黄码" value="2" />
          <el-option label="红码" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item prop="ymjl" label="疫苗记录:">
        <el-select v-model="searchForm.ymjl" placeholder="请选择">
          <el-option label="未知" value="0" />
          <el-option label="未接种" value="1" />
          <el-option label="接种未完成" value="2" />
          <el-option label="接种完成" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item prop="xcjl" label="行程记录:">
        <el-input v-model="searchForm.xcjl" placeholder="行程记录" />
      </el-form-item>
      <el-form-item prop="hsjl" label="核酸记录:">
        <el-input v-model="searchForm.hsjl" placeholder="核酸记录" />
      </el-form-item>
      <!-- <el-form-item prop="temp" label="体温:">
        <el-input v-model="searchForm.temp" placeholder="体温" />
      </el-form-item> -->
      <el-form-item prop="date" label="记录时间:">
        <el-date-picker
          v-model="date"
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

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      :row-style="{height: '40px'}"
      :cell-style="{padding: '5px 0 0'}"
      :header-cell-style="{background:'#eef1f6', padding: '10px 0'}"
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        label="#"
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
      <el-table-column label="身份证" prop="guokangCardId" align="center">
        <template slot-scope="{row}">
          <span>{{ row.guokangCardId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="佩戴口罩" prop="userType" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.occlusion | occlusionFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="体温" prop="temp" align="center" width="80">
        <template slot-scope="{row}">
          <el-tag :type="row.temperature | temperatureTagFilter">{{ row.temperature | temperatureFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="记录时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.recordTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开门类型" width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.recordType | openTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="照片" width="80" align="center">
        <template slot-scope="{row}">
          <el-image :preview-src-list="userImgList" style="width: 50px; height: 50px" fit="scale-down" :src="row.picUrl">
            <div slot="error">
              <!-- <el-image style="width: 50px; height: 50px" fit="scale-down" :src="errorImage" /> -->
              <i style="width: 50px; height: 50px; background-color: #F5F7FA; line-height:50px;color: #909399" class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('table.reasonVisit')" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.reasonVisit | reasonVisitFilter }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="健康码" width="80" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.guokangStatus | statusFilter">{{ row.guokangStatus | healthTypeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="核酸记录" align="center">
        <template slot-scope="{row}">
          <span>{{ row.hsjl | hsjlFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="疫苗记录" width="90" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ymjl | ymjlFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="行程记录" align="center">
        <template slot-scope="{row}">
          <span>{{ row.xcjl === '' ? '未知' : row.xcjl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="门禁卡号" prop="icCard" align="center">
        <template slot-scope="{row}">
          <span>{{ row.icCard === '0'? '-' : row.icCard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名" prop="deviceName" align="center">
        <template slot-scope="{row}">
          <span>{{ row.deviceName }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList(searchForm)" />
  </div>
</template>

<script>
import { fetchRecordList } from '@/api/record'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'RecordTable',
  components: { Pagination },
  directives: { waves },
  filters: {
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
      tableKey: 0,
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
        name: null,
        icCard: null,
        occlusion: null,
        guokangStatus: null,
        temp: null,
        deviceName: null,
        ymjl: null,
        hsjl: null,
        xcjl: null
      },
      userImgList: [],
      date: null
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
      fetchRecordList(data).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.list.forEach((item) => { this.userImgList.push(item.picUrl) })
        this.listLoading = false
      })
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
          await fetchRecordList().then(response => { jsonList = response.data.items })
          const tHeader = ['姓名', '佩戴口罩', '体温', '记录时间', '开门类型', '人脸', '健康码', '门禁卡', '核酸记录', '疫苗记录', '行程记录', '身份证号', '设备名']
          const filterVal = ['name', 'occlusion', 'temperature', 'recordTime', 'recordType', 'picUrl', 'guokangStatus', 'icCard', 'hsjl', 'ymjl', 'xcjl', 'guokangCardId', 'deviceName']
          const data = this.formatJson(filterVal, jsonList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'Record：' + parseTime(new Date())
          })
          this.downloadLoading = false
        })()
      })
    },
    formatJson(filterVal, jsonList) {
      return jsonList.map(v => filterVal.map(j => {
        if (j === 'occlusion') {
          return this.$options.filters.occlusionFilter(v[j])
        }
        if (j === 'recordTime') {
          return parseTime(v[j])
        }
        if (j === 'recordType') {
          return this.$options.filters.openTypeFilter(v[j])
        }
        if (j === 'guokangStatus') {
          return this.$options.filters.healthTypeFilter(v[j])
        }
        if (j === 'hsjl') {
          return this.$options.filters.hsjlFilter(v[j])
        }
        if (j === 'ymjl') {
          return this.$options.filters.ymjlFilter(v[j])
        }
        return v[j]
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    reset(searchForm) {
      this.date = null
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
      if (this.date !== null) {
        this.searchForm.beginTime = this.date[0]
        this.searchForm.endTime = this.date[1]
      }
      this.getList(this.searchForm)
      this.listLoading = false
    }
  }
}
</script>
