import request from './request'

export default {
  // 大事回顾
  getImgUrl(params) {
    return request.post('/gallery/gallery/3D/getByType', params)
  }
}
