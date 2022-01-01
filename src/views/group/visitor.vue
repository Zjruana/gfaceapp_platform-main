<template>
  <div class="app-container">
    <p style="color: red;font-size: 12px;">* 请在 设备管理-门禁设备 添加设备时输入设备组，设备组将会显示在此处</p>
    <el-table
      v-loading="listLoading"
      :row-style="{height: '50px'}"
      :cell-style="{padding: '0'}"
      :header-cell-style="{background:'#eef1f6', padding: '10px 0'}"
      style="width: 100%;margin-top:5px"
      :data="list"
      fit
    >
      <el-table-column label="设备组名称" width="200px" prop="groupName" align="center">
        <template slot-scope="{row}">
          <span>{{ row.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备ID" prop="deviceCodes">
        <template slot-scope="{row}">
          <el-tag
            v-for="item in row.deviceCodes"
            :key="item.label"
            :type="item.type"
            effect="plain"
            style="margin: 5px"
          >
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="{row}">
          <el-button slot="reference" disabled type="text" size="small" @click="handleEdit(row)"><i class="el-icon-edit" />编辑
          </el-button>

          <el-popconfirm style="margin-left: 10px" title="确定删除吗？" @confirm="handleDelete(row.id)">
            <el-button slot="reference" disabled type="text" size="small"><i class="el-icon-remove-outline" />删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  groupVisList
} from '@/api/group'
export default {
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.getList(this.searchForm)
  },
  methods: {
    getList(data) {
      this.listLoading = true
      groupVisList(data).then(response => {
        this.list = response.data.map((item) => { return { 'groupName': item.groupName, 'deviceCodes': item.deviceCodes.split(',') } })
      }).finally(() => {
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
<style scoped>

</style>
