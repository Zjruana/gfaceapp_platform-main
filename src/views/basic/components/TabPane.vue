<template>
  <el-table
    :data="list"
    fit
    border
    :row-style="{height: '50px'}"
    :cell-style="{padding: '0'}"
    :header-cell-style="{background:'#eef1f6', padding: '10px 0'}"
    style="width: 100%"
    highlight-current-row
  >
    <el-table-column
      v-loading="loading"
      align="center"
      label="模板ID"
      width="80"
      element-loading-text="请给我点时间！"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="80px" label="类目">
      <template slot-scope="{row}">
        <span>{{ row.title }}</span>
      </template>
    </el-table-column>

    <el-table-column width="180px" align="center" label="创建时间">
      <template slot-scope="scope">
        <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
    </el-table-column>

    <!-- <el-table-column width="120px" align="center" label="标签颜色">
      <template slot-scope="scope">
        <el-tag :type="scope.row.tag | statusTagFilter"><span style="padding:0 25px" /></el-tag>
      </template>
    </el-table-column> -->

    <el-table-column class-name="status-col" label="状态" width="80">
      <template slot-scope="{row}">
        <el-tag effect="plain" :type="row.status | statusTagFilter">
          {{ row.status | statusTypeFilter }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column align="center" label="备注">
      <template slot-scope="{row}">
        <span>{{ row.remark }}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作">
      <template slot-scope="scope">
        <span>{{ scope.row.pageviews }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchBasicList } from '@/api/basic'

export default {
  props: {
    type: {
      type: String,
      default: 'reasonVisit'
    }
  },
  data() {
    return {
      list: null,
      listQuery: {
        type: this.type
      },
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      fetchBasicList(this.listQuery).then(response => {
        this.list = response.data
        this.loading = false
      })
    }
  }
}
</script>

