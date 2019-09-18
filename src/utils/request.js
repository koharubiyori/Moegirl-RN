import axios from 'axios'
import qs from 'qs'

const api = 'https://zh.moegirl.org/api.php'

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
function requestDataHandler(req){
  console.log(req)

  if(req.method === 'post'){
    req.data = req.params
    delete req.params
  }

  return req
}

// 响应拦截器
function responseDataHandler(res){

  return res.data
}

export default axiosInstance