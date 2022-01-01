import request from '@/utils/request'

export function fetchEmployeeList(query) {
  return request({
    url: '/personnelWeb/employee/list',
    method: 'get',
    params: query
  })
}

export function addUser(data) {
  return request({
    url: '/personnelWeb/addUser',
    method: 'post',
    data
  })
}
export function loadAllDevice() {
  return request({
    url: '/personnelWeb/loadAllDevice',
    method: 'post'
  })
}
export function deleteUser(personId) {
  return request({
    url: '/personnelWeb/deleteUser',
    method: 'get',
    params: { 'personId': personId }
  })
}
export function editUser(data) {
  return request({
    url: '/personnelWeb/updateUser',
    method: 'post',
    data
  })
}
// ==================== 访客 ===============
export function fetchVisitorList(query) {
  return request({
    url: '/personnelWeb/visitor/list',
    method: 'get',
    params: query
  })
}
export function addVisUser(data) {
  return request({
    url: '/personnelWeb/addVisUser',
    method: 'post',
    data
  })
}
export function deleteVisUser(personId) {
  return request({
    url: '/personnelWeb/deleteVisUser',
    method: 'get',
    params: { 'personId': personId }
  })
}
export function editVisUser(data) {
  return request({
    url: '/personnelWeb/updateVisUser',
    method: 'post',
    data
  })
}
export function loadAllVisDevice() {
  return request({
    url: '/personnelWeb/loadAllVisDevice',
    method: 'post'
  })
}
// ==================== 黑名单 ===============
export function fetchBlacklistList(query) {
  return request({
    url: '/personnelWeb/blacklist/list',
    method: 'get',
    params: query
  })
}
export function addBlacklistUser(data) {
  return request({
    url: '/personnelWeb/addBlacklistUser',
    method: 'post',
    data
  })
}
export function deleteBlacklistUser(personId) {
  return request({
    url: '/personnelWeb/deleteBlacklistUser',
    method: 'get',
    params: { 'personId': personId }
  })
}
export function editBlacklistUser(data) {
  return request({
    url: '/personnelWeb/updateBlacklistUser',
    method: 'post',
    data
  })
}

