import request from '@/utils/request'

export function fetchRecordInfo() {
  return request({
    url: '/dashboardWeb/dashboard/info',
    method: 'get'
  })
}

export function fetchDashboardRecordList(query) {
  return request({
    url: '/dashboardWeb/dashboard/list',
    method: 'get',
    params: query
  })
}

export function fetchEarlyWarnList(operation, query) {
  return request({
    url: '/dashboardWeb/dashboard/EarlyWarn/' + operation,
    method: 'get',
    params: query
  })
}
