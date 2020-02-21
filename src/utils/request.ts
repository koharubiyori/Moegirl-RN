import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs'

const config = {
  timeout: 7000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },

  withCredentials: true,
  transformRequest: qs.stringify
}

const axiosInstance = axios.create(config)

axiosInstance.interceptors.request.use(requestDataHandler)
axiosInstance.interceptors.response.use(responseDataHandler)

// 请求拦截器
async function requestDataHandler(req: AxiosRequestConfig) {
  if (req.method === 'post') {
    req.data = req.params
    delete req.params
  }

  return req
}

// 响应拦截器
function responseDataHandler(res: AxiosResponse) {
  
  return res
}

export default axiosInstance