<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
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
      default: '490px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
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
      const layouts = [[[0, 0]], [[-0.25, 0], [0.25, 0]]]
      const pathes = [
        'M501.041414 62.931285c125.654838 0 227.51269 100.19498 227.51269 223.775576 0 123.605156-101.856829 223.805252-227.51269 223.805252-125.650745 0-227.506551-100.199073-227.506551-223.805252C273.53384 163.097612 375.424438 62.931285 501.041414 62.931285L501.041414 62.931285 501.041414 62.931285zM501.041414 62.931285c125.654838 0 227.51269 100.19498 227.51269 223.775576 0 123.605156-101.856829 223.805252-227.51269 223.805252-125.650745 0-227.506551-100.199073-227.506551-223.805252C273.53384 163.097612 375.424438 62.931285 501.041414 62.931285L501.041414 62.931285 501.041414 62.931285zM415.730423 585.125461l189.629895 0c162.314783 0 293.880237 129.387859 293.880237 289.057395l0 18.622126c0 62.922075-131.593084 65.313541-293.880237 65.313541L415.730423 958.118524c-162.319899 0-293.880237-0.092098-293.880237-65.313541l0-18.622126C121.852232 714.51332 253.411547 585.125461 415.730423 585.125461L415.730423 585.125461 415.730423 585.125461z',
        'M112.9728 923.89888c-16.69632 0-30.27968-13.48096-30.27968-30.04416l0-73.63584c0-73.54368 22.2464-144.35328 64.3328-204.75904 41.10336-58.98752 98.17088-104.20224 165.02272-130.7392l11.00288-4.37248-9.33376-7.28576c-52.60288-41.05216-82.77504-102.4-82.77504-168.31488 0-118.07232 96.72192-214.12864 215.59808-214.12864s215.59808 96.06144 215.59808 214.12864c0 65.91488-30.17216 127.26272-82.76992 168.32l-9.33376 7.28576 11.00288 4.37248c66.86208 26.53696 123.92448 71.73632 165.0176 130.71872 42.09152 60.40576 64.3328 131.22048 64.3328 204.7744l0 73.64096c0 16.55808-13.58336 30.03904-30.27968 30.03904L112.9728 923.89888 112.9728 923.89888zM863.18592 813.43488c-0.3584-20.15744 22.22592-218.65984-143.39584-307.47136-22.38976-15.30368-28.71296-17.35168-28.71296-29.76768 0-12.1088 8.09984-22.98368 20.62848-27.70432l0.2048-0.0768 0.19456-0.09216c116.56192-124.48256-22.31808-271.68256-43.73504-281.07264-3.49696-5.65248-4.28032-6.88128-1.83296-2.9696 97.00352 1.65888 175.43168 80.56832 175.43168 177.32608 0 43.89376-16.49664 86.13376-46.44352 118.93248l-5.97504 6.54848 7.8848 4.06016c96.05632 49.41824 155.7248 147.23584 155.71968 255.28832l0 56.96c0 16.55808-13.57824 30.0288-30.27456 30.0288L863.18592 813.43488 863.18592 813.43488z'
      ]
      const colors = ['#40C9C6', '#F4516C']

      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {},
        calendar: [{
          left: 'center',
          top: 'middle',
          cellSize: [50, 65],
          yearLabel: {
            show: false
          },
          orient: 'vertical',
          dayLabel: {
            firstDay: 1,
            nameMap: 'cn'
          },
          monthLabel: {
            show: false
          },
          range: '2021-11' // 主要月份
        }],
        series: [{
          type: 'custom',
          coordinateSystem: 'calendar',
          renderItem: function(params, api) {
            const cellPoint = api.coord(api.value(0))
            const cellWidth = params.coordSys.cellWidth
            const cellHeight = params.coordSys.cellHeight
            const value = api.value(1)
            const events = value && value.split('|')
            if (isNaN(cellPoint[0]) || isNaN(cellPoint[1])) {
              return
            }
            const group = {
              type: 'group',
              children: (layouts[events.length - 1] || []).map(function(
                itemLayout,
                index
              ) {
                return {
                  type: 'path',
                  shape: {
                    pathData: pathes[+events[index]],
                    x: -8,
                    y: -8,
                    width: 13,
                    height: 13
                  },
                  position: [
                    cellPoint[0] +
                      echarts.number.linearMap(
                        itemLayout[0],
                        [-0.5, 0.5],
                        [-cellWidth / 2, cellWidth / 2]
                      ),
                    cellPoint[1] +
                      echarts.number.linearMap(
                        itemLayout[1],
                        [-0.5, 0.5],
                        [-cellHeight / 2 + 20, cellHeight / 2]
                      )
                  ],
                  style: api.style({
                    fill: colors[+events[index]]
                  })
                }
              }) || []
            }
            group.children.push({
              type: 'text',
              style: {
                x: cellPoint[0],
                y: cellPoint[1] - cellHeight / 2 + 15,
                text: echarts.format.formatTime('dd', api.value(0)),
                fill: '#777',
                textFont: api.font({
                  fontSize: 14
                })
              }
            })
            return group
          },
          dimensions: [undefined, {
            type: 'ordinal'
          }],
          data: [['2021-11-01', '1|0'], ['2021-11-02', ''], ['2021-11-03', '1'], ['2021-11-04', '0|1'], ['2021-11-05', '1|1'], ['2021-11-06', '0'], ['2021-11-07', ''], ['2021-11-08', ''], ['2021-11-09', '0'], ['2021-11-10', '1'], ['2021-11-11', '0|1'], ['2021-11-12', '0|1'], ['2021-11-13', ''], ['2021-11-14', '1'], ['2021-11-15', '0'], ['2021-11-16', ''], ['2021-11-17', ''], ['2021-11-18', '1'], ['2021-11-19', ''], ['2021-11-20', ''], ['2021-11-21', '0'], ['2021-11-22', '0'], ['2021-11-23', '1'], ['2021-11-24', ''], ['2021-11-25', ''], ['2021-11-26', '0'], ['2021-11-27', '1|1'], ['2021-11-28', ''], ['2021-11-29', '1|1'], ['2021-11-30', '']] // 数据
        }]
      })
    }
  }
}
</script>
