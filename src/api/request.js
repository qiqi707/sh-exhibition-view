import axios from 'axios'
import { getBaseUrl } from './api.config'

class HttpRequest {
  // 默认的请求头配置
  getInsideConfig() {
    const config = {
      baseURL: getBaseUrl(),
      headers: {
        // 'X-Requested-With': 'XMLHttpRequest'
      }
      // withCredentials: true
    }
    return config
  }

  /**
   * @description: 初始化拦截器
   * @param {*} instance axios实例
   */
  interceptors(instance) {
    // 请求拦截
    instance.interceptors.request.use(
      (config) => {
        const token = ''
        if (token) {
          config.headers.token = token
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    // 响应拦截
    instance.interceptors.response.use(
      (response) => {
        // 过滤第一层http状态码数据
        return response.data
      },
      (error) => {
        // 全局处理错误提示弹窗
        // 401
        if (error.response.status === 401) {
          return
        }
        // 403
        if (error.response.status === 403) {
          // TODO 403
          return
        }
        // Message.error(error.message);
        console.log(error.message)
        return Promise.reject(error)
      }
    )
  }

  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }

  get(url, params) {
    return this.request({
      url: url,
      params: params,
      method: 'get'
    })
      .then()
      .catch((err) => {
        return Promise.reject(err)
      })
  }

  post(url, params) {
    return this.request({
      url: url,
      data: params,
      method: 'post'
    })
      .then()
      .catch((err) => {
        return Promise.reject(err)
      })
  }

  put(url, params) {
    return this.request({
      url: url,
      data: params,
      method: 'put'
    })
      .then()
      .catch((err) => {
        return Promise.reject(err)
      })
  }

  delete(url, params) {
    return this.request({
      url: url,
      data: params,
      method: 'delete'
    })
      .then()
      .catch((err) => {
        return Promise.reject(err)
      })
  }
}

export default new HttpRequest()
