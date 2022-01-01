import request from '@/utils/request'

// ================客户===============

// 获取客户信息
export function getCustomerInfo(query) {
  return request({
    url: '/system/getCustomerInfo',
    method: 'get',
    params: query
  })
}

// 修改客户信息
export function editCustomerInfo(data) {
  return request({
    url: '/system/editCustomerInfo',
    method: 'post',
    data: data
  })
}

// 新增客户信息
export function addCustomerInfo(data) {
  return request({
    url: '/system/addCustomerInfo',
    method: 'post',
    data: data
  })
}

// 删除客户信息
export function deleteCustomerInfo(data) {
  return request({
    url: '/system/deleteCustomerInfo',
    method: 'delete',
    data: data
  })
}

// 上传照片
export function uploadImg(data) {
  return request({
    url: '/personnelWeb/uploadImg',
    method: 'post',
    data: data
  })
}
