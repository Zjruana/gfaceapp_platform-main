import request from '@/utils/request'

export function fetchBasicList(query) {
  return request({
    url: '/basic/list',
    method: 'get',
    params: query
  })
}
