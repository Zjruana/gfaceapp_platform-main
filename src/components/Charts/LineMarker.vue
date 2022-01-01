<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>
<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
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
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      this.chart.setOption({
        backgroundColor: '#FFFFFF',
        title: {
          top: 20,
          text: '最近7天访问详情',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#24212D'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#008ACD'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['陌生人', '黑名单', '访客', '员工'],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#24212D'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '3%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            chartRightMargin: '50',
            lineStyle: {
              color: '#008ACD'
            }
          },
          data: this.chartDataTime
        }],
        yAxis: [{
          type: 'value',
          name: '(人)',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#008ACD'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#DCDCDC'
            }
          }
        }],
        series: [{
          name: '陌生人',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(255, 165, 0, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(255, 165, 0, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(255, 165, 0)',
              borderColor: 'rgba(255, 165, 0, 0.2)',
              borderWidth: 12
            }
          },
          data: this.chartStranger
        }, {
          name: '黑名单',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(105, 105, 105, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(105, 105, 105, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(105, 105, 105)',
              borderColor: 'rgba(105, 105, 105, 0.2)',
              borderWidth: 12
            }
          },
          data: this.chartBlacklist
        }, {
          name: '访客',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(219, 50, 51, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(219, 50, 51, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(219, 50, 51)',
              borderColor: 'rgba(219, 50, 51, 0.2)',
              borderWidth: 12
            }
          },
          data: this.chartFangkes
        }, {
          name: '员工',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(64, 201, 198, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(64, 201, 198, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(64, 201, 198)',
              borderColor: 'rgba(64, 201, 198,0.2)',
              borderWidth: 12

            }
          },
          data: this.chartDoorCount
        }]
      })
    }
  }
}
</script>
