import request from './base'
import { AxiosRequestConfig } from 'axios'
import store from '~/mobx'

export const sourceList = {
  moegirl: 'https://zh.moegirl.org.cn',
  hmoe: 'https://www.hmoegirl.com'
}

async function moeRequest<ResponseData = any>(config: AxiosRequestConfig): Promise<ResponseData> {
  config.baseURL = `${sourceList[store.settings.source]}/api.php`

  if (!config.params) config.params = {}
  config.params.format = 'json' // 为所有萌百请求默认添加format: 'json'
  config.params.variant = store.settings.lang // 语言参数
  
  return Promise.race([
    new Promise<any>((resolve, reject) => {
      request(config)
        .then(data => {
          const { data: reqData } = data
          reqData.error ? reject(reqData.error) : resolve(reqData)
        })
        .catch(e => {
          console.log(e)
          reject()
        })
    }),

    // 不知道为什么设定的请求超时无效，这里只好这么玩
    new Promise<any>((resolve, reject) => setTimeout(reject, 9000))
  ])
}

export default moeRequest