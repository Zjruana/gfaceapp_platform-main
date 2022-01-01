import request from '@/utils/request'

// ==================== 上传图片 =====================
export function uploadImg(data) {
  return request({
    url: '/publicWeb/uploadImg',
    method: 'post',
    data
  })
}
// ==================== 批量导入人员 =====================
export function batchUploadPersonnel(data) {
  return request({
    url: '/publicWeb/batchUploadPersonnel',
    method: 'post',
    data
  })
}
