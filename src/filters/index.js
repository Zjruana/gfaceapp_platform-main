// import parseTime, formatTime and set to filter
import { parseTime } from '@/utils'
export { parseTime }
/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function statusTagFilter(status) {
  const statusMap = {
    1: '',
    2: 'info',
    3: 'success',
    4: 'warning',
    5: 'danger'
  }
  return statusMap[status]
}
export function statusTypeFilter(status) {
  const statusMap = {
    1: '启用',
    2: '禁用'
  }
  return statusMap[status]
}
export function sexFilter(status) {
  const statusMap = {
    0: '未知',
    1: '男',
    2: '女'
  }
  return statusMap[status]
}
export function reasonVisitFilter(status) {
  const statusMap = {
    1: '访友',
    2: '工作',
    3: '购物',
    4: '游玩'
  }
  return statusMap[status]
}
export function openTypeFilter(status) {
  const statusMap = {
    1: '人脸验证',
    2: '人脸抓拍',
    3: '刷身份证',
    4: '刷ic卡',
    5: '人证合一',
    8: '健康码',
    9: '身份证健康码',
    10: '密码验证',
    11: '人卡合一',
    12: '远程开门'
  }
  return statusMap[status] === undefined ? '无' : statusMap[status]
}
export function deviceTypeFilter(status) {
  const statusMap = {
    1: '进',
    2: '出',
    0: '未知'
  }
  return statusMap[status]
}
export function occlusionFilter(status) {
  const statusMap = {
    '-1': '未启用',
    0: '未佩戴',
    1: '佩戴'
  }
  return statusMap[status]
}

export function userTypeFilter(status) {
  const statusMap = {
    1: '员工',
    2: '访客'
  }
  return statusMap[status]
}
export function healthTypeFilter(status) {
  const statusMap = {
    null: '无',
    1: '绿码',
    2: '黄码',
    3: '红码'
  }
  return statusMap[status]
}

export function temperatureTagFilter(temp) {
  if (temp > 37.3) {
    return 'danger'
  } else if (temp < 30) {
    return 'info'
  } else {
    return 'success'
  }
}
export function temperatureFilter(temp) {
  if (temp === -1) {
    return '未启用'
  } else if (temp === 0) {
    return '测温失败'
  }
  return temp
}
export function validDateEndFilter(validDateEnd) {
  if (validDateEnd === null || validDateEnd === '0') {
    return '长期'
  }
  return parseTime(validDateEnd, '{y}-{m}-{d} {h}:{i}:{s}')
}

export function hsjlFilter(val) {
  if (val === null || val === '0' || val === '') {
    return '未知'
  } else if (val === '1') {
    return '未查询到记录'
  }
  return val
}
export function ymjlFilter(val) {
  if (val === '1') {
    return '未接种'
  } else if (val === '2') {
    return '接种未完成'
  } else if (val === '3') {
    return '接种完成'
  } else {
    return '未知'
  }
}
