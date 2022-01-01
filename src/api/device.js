import request from '@/utils/request'

export function fetchDoordeviceList(query) {
  return request({
    url: '/deviceWeb/doordevice/list',
    method: 'get',
    params: query
  })
}
export function addDoorDevice(data) {
  return request({
    url: '/deviceWeb/addDoorDevice',
    method: 'post',
    data
  })
}
export function deleteDoorDevice(data) {
  return request({
    url: '/deviceWeb/deleteDoorDevice',
    method: 'get',
    params: { 'deviceCode': data }
  })
}
export function editDoorDevice(data) {
  return request({
    url: '/deviceWeb/updateDoorDevice',
    method: 'post',
    data
  })
}

export function fetchVisdeviceList(query) {
  return request({
    url: '/deviceWeb/visDevice/list',
    method: 'get',
    params: query
  })
}
export function addVisDevice(data) {
  return request({
    url: '/deviceWeb/addVisDevice',
    method: 'post',
    data
  })
}
export function deleteVisDevice(data) {
  return request({
    url: '/deviceWeb/deleteVisDevice',
    method: 'get',
    params: { 'deviceCode': data }
  })
}
export function editVisDevice(data) {
  return request({
    url: '/deviceWeb/updateVisDevice',
    method: 'post',
    data
  })
}
export function changeServerUrl(data) {
  return request({
    url: '/user/changeServerUrl',
    method: 'post',
    data
  })
}
