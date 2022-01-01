<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :row-style="{height: '50px'}"
      :cell-style="{padding: '0'}"
      :header-cell-style="{background:'#eef1f6', padding: '10px 0'}"
      style="width: 100%;margin-top:5px"
      :data="list"
      fit
    >
      <el-table-column label="班次编号" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班次名称" prop="workName" align="center">
        <template slot-scope="{row}">
          <span>{{ row.workName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组织" prop="deviceGroup" align="center">
        <template slot-scope="{row}">
          <span>{{ row.deviceGroup }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上班时间" prop="toWorkTime" align="center">
        <template slot-scope="{row}">
          <span>{{ row.toWorkTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下班时间" prop="offWorkTime" align="center">
        <template slot-scope="{row}">
          <span>{{ row.offWorkTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上班前可打卡(分)" prop="beforeWorkTime" align="center">
        <template slot-scope="{row}">
          <span>{{ row.beforeWorkTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上班后可打卡(分)" prop="afterWorkTime" align="center">
        <template slot-scope="{row}">
          <span>{{ row.afterWorkTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下班前可打卡(分)" prop="allowRetreat" align="center">
        <template slot-scope="{row}">
          <span>{{ row.allowRetreat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下班后可打卡(分)" prop="allowLate" align="center">
        <template slot-scope="{row}">
          <span>{{ row.allowLate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="note" align="center">
        <template slot-scope="{row}">
          <span>{{ row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button
            slot="reference"
            type="text"
            size="small"
            @click="handleEdit(row)"
          ><i class="el-icon-edit" />编辑</el-button>

          <el-popconfirm
            style="margin-left: 10px"
            title="确定删除吗？"
            @confirm="handleDelete(row.id)"
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
  </div>
</template>
<script>
import { attendanceConfigList } from '@/api/attendance'
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
        workName: null
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
      attendanceConfigList(data).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleEdit(info) {
      console.log(info)
    },
    handleDelete(id) {
      console.log(id)
    }
  }
}
</script>
