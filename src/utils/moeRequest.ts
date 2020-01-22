import request from './request'
import { AxiosRequestConfig } from 'axios'

export default function<ResponseData = any>(config: AxiosRequestConfig): Promise<ResponseData> {
  // 为所有萌百请求默认添加format: 'json'
  if (!config.params) config.params = {}
  config.params.format = 'json'

  // const timeout = new Promise(resolve => setTimeout(() => resolve('timeout'), 12000))

  // return new Promise((resolve, reject) => {
  //   Promise.race([request(config), timeout])
  //     .then(data => {
  //       if (data === 'timeout') {
  //         console.log('timeout', config)
  //         return reject()
  //       }
      
  //       data.error ? reject(data.error) : resolve(data)
  //     })
  //     .catch(e => {
  //       console.log(e)
  //       reject()
  //     })
  // })

  return new Promise((resolve, reject) => {
    request(config)
      .then(data => {
        // if (data === 'timeout') {
        //   console.log('timeout', config)
        //   return reject()
        // }
        
        const { data: reqData } = data
        reqData.error ? reject(reqData.error) : resolve(reqData)
      })
      .catch(e => {
        console.log(e)
        reject()
      })
  })
  
}