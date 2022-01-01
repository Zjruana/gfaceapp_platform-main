<template>
  <div style="background-color: #FFFFFF; padding: 16px">
    <el-row>
      <el-button :disabled="isdisabled" round size="mini" plain @click="getList('today'),listQuery.page = 1, title='today', isdisabled = !isdisabled">今日访问</el-button>
      <el-button :disabled="!isdisabled" round size="mini" plain @click="getList('yesterday'),listQuery.page = 1, title='yesterday', isdisabled = !isdisabled">昨日访问</el-button>
    </el-row>
    <el-table v-loading="listLoading" :data="list" :height="list && list.length === 0?'463px':'339px'" :row-style="{height:0+'px'}" :cell-style="{padding:5+'px'}" style="width: 100%;padding-top: 10px;">
      <el-table-column :index="indexMethod" label="#" align="center" min-width="10" type="index" />
      <el-table-column label="人员类型" align="center" min-width="50">
        <template slot-scope="scope">
          {{ scope.row.personType | personTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" min-width="50">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="照片" align="center" min-width="50">
        <template slot-scope="scope">
          <el-image v-show="scope.row.picUrl!==null" fit="scale-down" :preview-src-list="userImgList" style="width: 40px; height: 40px" :src="scope.row.picUrl">
            <div slot="error">
              <!-- <el-image style="width: 50px; height: 50px" fit="scale-down" :src="errorImage" /> -->
              <i style="width: 40px; height: 40px; background-color: #F5F7FA; line-height:40px;color: #909399" class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="记录时间" width="195" align="center">
        <template slot-scope="scope">
          {{ scope.row.recordTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column label="佩戴口罩" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.occlusion | occlusionFilter }}
        </template>
      </el-table-column>
      <el-table-column label="门禁卡" align="center">
        <template slot-scope="scope">
          {{ scope.row.icCard === '0'?"":scope.row.icCard }}
        </template>
      </el-table-column>
      <el-table-column label="体温" width="100" align="center">
        <template slot-scope="{row}">
          <span :style="row.temperature | temperatureTagFilter">{{ row.temperature | temperatureFilter }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :auto-scroll="false" :total="total" :page-sizes="[5, 10, 20, 30, 50]" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList(title)" />
  </div>
</template>

<script>
import { fetchDashboardRecordList } from '@/api/dashboard'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
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
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      isdisabled: true,
      listQuery: {
        page: 1,
        limit: 5
      },
      title: 'today',
      userImgList: []
    }
  },
  created() {
    this.getList(this.title)
  },
  methods: {
    getList(title) {
      this.listLoading = true
      this.listQuery.title = title
      fetchDashboardRecordList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.list.forEach((item) => { this.userImgList.push(item.picUrl) })
        this.listLoading = false
      })
    },
    indexMethod(index) {
      return ((this.listQuery.page - 1) * this.listQuery.limit) + index + 1
    }
  }
}
</script>
