<template>
  <div class="chart-container">
    <chart :chart-data-time="chartDataTime" :chart-blacklist="chartBlacklist" :chart-stranger="chartStranger" :chart-door-count="chartDoorCount" :chart-fangkes="chartFangkes" height="90%" width="100%" />
  </div>
</template>

<script>
import Chart from '@/components/Charts/LineMarker'

export default {
  name: 'LineChart',
  components: { Chart },
  props: {
    chartDataTime: {
      type: Array,
      default: () => []
    },
    chartDoorCount: {
      type: Array,
      default: () => []
    },
    chartFangkes: {
      type: Array,
      default: () => []
    },
    chartBlacklist: {
      type: Array,
      default: () => []
    },
    chartStranger: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 220px);
}
</style>

