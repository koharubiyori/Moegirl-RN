import { DeviceEventEmitter } from 'react-native'
import storage from '~/utils/storage'
import axios from 'axios'
import articleApi from '~/api/article'

export interface BrowsingHistory {
  title: string
  timestamp: number
  img: null | { uri: string }
}

export default function(title: string) {
  const timestamp = new Date().getTime()

  Promise.all([
    storage.get('browsingHistory'),
    articleApi.getMainImage(title)
  ]).then(async ([history, img]) => {
    let _history = history || []
    _history.some((item, index) => {
      if (item.title === title) {
        _history.splice(index, 1)
        return true
      }
    })

    let result: BrowsingHistory = { title, timestamp, img: null }

    if (img) {
      try {
        let { data: blob } = await axios({ url: img.source, responseType: 'blob' })
        blob = new Blob([blob], { type: `image/${img.source.replace(/^.+\.([^\.]+)$/, '$1')}` }) // 上面拿到的blob没有类型，必须手动设置
        
        await new Promise((resolve, reject) => {
          let reader = new FileReader()
          reader.readAsDataURL(blob)
          reader.onload = () => {
            result.img = {
              uri: reader.result as string
            }
            resolve()
          }

          reader.onerror = reject
        })
      } catch (e) { console.log(e) }
    }

    _history.unshift(result)
    storage.set('browsingHistory', _history).then(() => 
      DeviceEventEmitter.emit('refreshHistory')
    )
  }).catch(e => console.log(e))
}