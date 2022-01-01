<template>
  <div :class="className" :style="{height:height,width:width}">
    <el-skeleton style="width: 240px;float:left">
      <template slot="template">
        <el-skeleton-item variant="image" style="width: 240px; height: 240px;" />
        <div style="padding: 14px;">
          <el-skeleton-item variant="p" style="width: 50%" />
          <div
            style="display: flex; align-items: center; justify-items: space-between;"
          >
            <el-skeleton-item variant="text" style="margin-right: 16px;" />
            <el-skeleton-item variant="text" style="width: 30%;" />
          </div>
        </div>
      </template>
    </el-skeleton>
    <el-skeleton style="width: 240px;float:right" />
  </div>
</template>

<script>
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '509px'
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {

  }
}
</script>
