import request from '@/utils/request'

export function fetchRecordList(query) {
  return request({
    url: '/recordWeb/record/list',
    method: 'get',
    params: query
  })
}

export function fetchRecordInfo() {
  return request({
    url: '/recordWeb/dashboard/info',
    method: 'get'
  })
}

export function fetchDashboardRecordList(query) {
  return request({
    url: '/recordWeb/dashboard/list',
    method: 'get',
    params: query
  })
}
export function fetchVisRecordList(query) {
  return request({
    url: '/recordWeb/record_vis/list',
    method: 'get',
    params: query
  })
}
export function fetchBlacklistRecordList(query) {
  return request({
    url: '/recordWeb/record_blacklist/list',
    method: 'get',
    params: query
  })
}
export function fetchStrangertRecordList(query) {
  return request({
    url: '/recordWeb/record_stranger/list',
    method: 'get',
    params: query
  })
}
