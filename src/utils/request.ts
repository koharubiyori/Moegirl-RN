import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs'
import CookieManager from '@koharubiyori/react-native-cookies'

const domain = 'https://zh.moegirl.org'
const api = `${domain}/api.php`

const config = {
  baseURL: api,
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

  // 发送cookie
  let cookies = await CookieManager.get(domain)
  let stringCookies = Object.keys(cookies).map(item => `${item}=${cookies[item]}`).join(';')
  req.headers.cookie = stringCookies

  return req
}

// 响应拦截器
function responseDataHandler(res: AxiosResponse) {
  
  return res
}

export default axiosInstance