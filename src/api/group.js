import request from '@/utils/request'

export function groupList(query) {
  return request({
    url: '/groupWeb/group/list',
    method: 'get',
    params: query
  })
}

export function groupVisList(query) {
  return request({
    url: '/groupWeb/group_vis/list',
    method: 'get',
    params: query
  })
}
