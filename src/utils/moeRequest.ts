import request from './request'
import { AxiosRequestConfig } from 'axios'
import CookieManager from '@koharubiyori/react-native-cookies'
import store from '~/redux'

export const siteMaps = {
  moegirl: 'https://zh.moegirl.org',
  hmoe: 'https://www.hmoegirl.com'
}

export default async function<ResponseData = any>(config: AxiosRequestConfig): Promise<ResponseData> {
  const userConfig = store.getState().config
  const domain = siteMaps[userConfig.currentSite]
  config.baseURL = domain + '/api.php'
  
  // 为所有萌百请求默认添加format: 'json'
  if (!config.params) config.params = {}
  config.params.format = 'json'
  // config.params.variant = 'zh-hant'
  
  // 发送cookie
  let cookies = await CookieManager.get(domain)
  let stringCookies = Object.keys(cookies).map(item => `${item}=${cookies[item]}`).join(';')
  config.headers = {
    cookie: stringCookies
  }

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