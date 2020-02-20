import request from './request'
import { AxiosRequestConfig } from 'axios'

export const siteMaps = {
  moegirl: 'https://zh.moegirl.org',
  hmoe: 'https://www.hmoegirl.com'
}

export default function<ResponseData = any>(config: AxiosRequestConfig): Promise<ResponseData> {
  // 为所有萌百请求默认添加format: 'json'
  if (!config.params) config.params = {}
  config.params.format = 'json'
  // config.params.variant = 'zh-hant'

  return new Promise((resolve, reject) => {
    request(config)
      .then(data => {
        const { data: reqData } = data
        reqData.error ? reject(reqData.error) : resolve(reqData)
      })
      .catch(e => {
        console.log(e)
        reject()
      })
  })
  
}