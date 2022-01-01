<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="24" :sm="12" :md="12" :lg="6" class="card-panel-col">
      <div class="card-panel-main" @click="dialogEarlyWarn = true">
        <el-tooltip class="item" effect="dark" :content="earlyWarnStatus?'预警系统连接正常...':'预警系统连接失败...'" placement="top">
          <span :class="earlyWarnStatus?'early-warn-status-success':'early-warn-status-error'" />
        </el-tooltip>
        <div class="card-panel-description">
          <!-- <div class="card-panel-text">
            今日概况
          </div> -->
          <!-- <span>疑似发热</span><count-to :start-val="0" :end-val="allRecord" :duration="2500" class="card-panel-num" />
          <span>48小时核酸</span><count-to :start-val="0" :end-val="allRecord" :duration="2500" class="card-panel-num" />
          <span>72小时核酸</span><count-to :start-val="0" :end-val="allRecord" :duration="2500" class="card-panel-num" />
          <span>无核酸记录</span><count-to :start-val="0" :end-val="allRecord" :duration="2500" class="card-panel-num" />
          <span>未接种</span><count-to :start-val="0" :end-val="allRecord" :duration="2500" class="card-panel-num" />
          <span>接种第一针</span><count-to :start-val="0" :end-val="allRecord" :duration="2500" class="card-panel-num" />
          <span>接种第二针</span><count-to :start-val="0" :end-val="allRecord" :duration="2500" class="card-panel-num" />
          <span>接种第三针</span><count-to :start-val="0" :end-val="allRecord" :duration="2500" class="card-panel-num" /> -->
        </div>
      </div>
    </el-col>
    <el-drawer
      :visible.sync="dialogEarlyWarn"
      direction="rtl"
      size="35%"
    >
      <div slot="title" class="header-title">
        <span style="color: red">预警消息记录</span>
      </div>
      <el-table :data="earlyWarnData">
        <el-table-column prop="personType" align="center" width="80" label="人员类型">
          <template slot-scope="{row}">
            {{ row.personType | personTypeFilter }}
          </template>
        </el-table-column>
        <el-table-column property="name" align="center" label="姓名" />
        <el-table-column property="deviceCode" align="center" label="设备" />
        <el-table-column label="体温" width="70" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.temperature | temperatureTagFilter">{{ row.temperature | temperatureFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="健康码" width="90" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.guokangStatus | statusFilter">{{ row.guokangStatus | healthTypeFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="照片" align="center" min-width="60">
          <template slot-scope="{row}">
            <el-image v-show="row.picUrl!==null" fit="scale-down" :preview-src-list="[row.picUrl]" style="width: 40px; height: 40px" :src="row.picUrl">
              <div slot="error">
                <i style="width: 40px; height: 40px; background-color: #F5F7FA; line-height:40px;color: #909399" class="el-icon-picture-outline" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="通行时间" width="180" align="center">
          <template slot-scope="{row}">
            {{ row.recordTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>

    <el-col :xs="24" :sm="12" :md="12" :lg="18" class="card-panel-col">
      <!-- 第一列 -->
      <el-row :gutter="40">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" class="card-panel-col">
          <div class="card-panel">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="card-panel-description-guokang">
                  <div class="card-panel-text">
                    今日红码
                  </div>
                  <count-to :start-val="0" :end-val="todayGuokangRed" :duration="1500" class="card-panel-num-red" />
                </div>
              </el-col>
              <el-col :span="8">
                <div class="card-panel-description-guokang">
                  <div class="card-panel-text">
                    今日黄码
                  </div>
                  <count-to :start-val="0" :end-val="todayGuokangYellow" :duration="1500" class="card-panel-num-yellow" />
                </div>
              </el-col>
              <el-col :span="8">
                <div class="card-panel-description-guokang">
                  <div class="card-panel-text">
                    今日绿码
                  </div>
                  <count-to :start-val="0" :end-val="todayGuokangGreen" :duration="1500" class="card-panel-num-green" />
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="6" class="card-panel-col">
          <div class="card-panel" @click="clickPeople">
            <div class="card-panel-icon-wrapper icon-record">
              <svg-icon icon-class="chart" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                总通行量
              </div>
              <count-to :start-val="0" :end-val="allRecord" :duration="2500" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="6" class="card-panel-col">
          <div class="card-panel" @click="clickDeviceTotal">
            <div class="card-panel-icon-wrapper icon-device">
              <svg-icon icon-class="tree-table" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                设备总数
              </div>
              <count-to :start-val="0" :end-val="allDevice" :duration="2500" class="card-panel-num" />
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 第二列 -->
      <el-row :gutter="40">
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel" @click="clickToDayRecord">
            <div class="card-panel-icon-wrapper icon-money">
              <svg-icon icon-class="peoples" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                今日员工通行
              </div>
              <count-to :start-val="0" :end-val="yuangong" :duration="2500" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel" @click="clickRecord">
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="peoples" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                今日访客通行
              </div>
              <count-to :start-val="0" :end-val="fangke" :duration="2500" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel" @click="clickStrangerTotal">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="peoples" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                今日陌生人通行
              </div>
              <count-to :start-val="0" :end-val="stranger" :duration="2500" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel" @click="clickBlacklistTotal">
            <div class="card-panel-icon-wrapper icon-shopping">
              <svg-icon icon-class="peoples" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                今日黑名单通行
              </div>
              <count-to :start-val="0" :end-val="blacklist" :duration="2500" class="card-panel-num" />
            </div>
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
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
  props: {
    allRecord: {
      type: Number,
      default: 0
    },
    fangke: {
      type: Number,
      default: 0
    },
    yuangong: {
      type: Number,
      default: 0
    },
    blacklist: {
      type: Number,
      default: 0
    },
    stranger: {
      type: Number,
      default: 0
    },
    allDevice: {
      type: Number,
      default: 0
    },
    todayGuokangGreen: {
      type: Number,
      default: 0
    },
    todayGuokangYellow: {
      type: Number,
      default: 0
    },
    todayGuokangRed: {
      type: Number,
      default: 0
    },
    earlyWarnData: {
      type: Array,
      default: null
    },
    earlyWarnStatus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogEarlyWarn: false
    }
  },
  methods: {
    clickPeople() {
      this.$router.push('/record/record')
    },
    clickRecord() {
      this.$router.push('/record/vis-record')
    },
    clickToDayRecord() {
      this.$router.push('/record/record')
    },
    clickDeviceTotal() {
      this.$router.push('/device/doordevice')
    },
    clickStrangerTotal() {
      this.$router.push('/record/stranger-record')
    },
    clickBlacklistTotal() {
      this.$router.push('/record/blacklist-record')
    }
  }
}
</script>

<style  scoped>
.early-warn-status-success{
  padding: 4px;
  background-color: green;
  display: block;
}
.early-warn-status-error{
  padding: 4px;
  background-color: #FF3030;
  display: block;
}
</style>
<style lang="scss" scoped>
.panel-group {

  .card-panel-col {
    margin-bottom: 20px;
  }

  .card-panel {
    height: 80px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    border-color: rgba(0, 0, 0, .05);
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-record {
        background: #CDB7B5;
      }

      .icon-device {
        background: #63B8FF;
      }

      .icon-people {
        background: #FFA500;
      }

      .icon-message {
        background: #f4516c;
      }

      .icon-money {
        background: #40c9c6;
      }

      .icon-shopping {
        background: #696969
      }
    }

    .icon-record {
      color: #CDB7B5;
    }

    .icon-device {
      color: #63B8FF;
    }

    .icon-people {
      color: #FFA500;
    }

    .icon-message {
      color: #f4516c;
    }

    .icon-money {
      color: #40c9c6;
    }

    .icon-shopping {
      color: #696969
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 6px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 38px;
    }

    .card-panel-description-guokang {
      font-weight: bold;
      margin: 16px;
      text-align: center;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num-red {
        font-size: 20px;
        color: red;
      }

      .card-panel-num-yellow {
        font-size: 20px;
        color: #FFD700;
      }

      .card-panel-num-green {
        font-size: 20px;
        color: green;
      }
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 16px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
  .card-panel-main {
    height: 180px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    border-color: rgba(0, 0, 0, .05);
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .card-panel-description {
      float: left;
      font-weight: bold;
      margin: 16px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}

@media (max-width:1200px) {
 .panel-group {
   .card-panel-main {
    height: 380px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    border-color: rgba(0, 0, 0, .05);
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
 }
}
</style>
