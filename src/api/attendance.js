import request from '@/utils/request'

export function attendanceMonthList(query) {
  return request({
    url: '/attendanceWeb/attendanceMonth/list',
    method: 'get',
    params: query
  })
}

export function attendanceList(query) {
  return request({
    url: '/attendanceWeb/attendance/list',
    method: 'get',
    params: query
  })
}
export function attendanceConfigList(query) {
  return request({
    url: '/attendanceWeb/attendanceConfig/list',
    method: 'get',
    params: query
  })
}
