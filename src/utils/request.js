import axios from 'axios'
import qs from 'qs'
import CookieManager from 'react-native-cookies'

const domain = 'https://zh.moegirl.org'
const api = `${domain}/api.php`

const config = {
  timeout: 7000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },

  withCredentials: true,
  transformRequest: qs.stringify
}

var axiosInstance = axios.create({
  baseURL: api,
  ...config
})

axiosInstance.interceptors.request.use(requestDataHandler)
axiosInstance.interceptors.response.use(responseDataHandler)

// 请求拦截器
async function requestDataHandler(req){
  if(!req.params) req.params = {}
  req.params.format = 'json'

  if(req.method === 'post'){
    req.data = req.params
    delete req.params
  }

  // 发送cookie
  var cookies = await CookieManager.get(domain)
  cookies = Object.keys(cookies).map(item => `${item}=${cookies[item]}`).join(';')
  req.headers.cookie = cookies

  return req
}

// 响应拦截器
function responseDataHandler(res){

  // console.log(res)
  return res.data
}

export default axiosInstance