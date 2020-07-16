import { DeviceEventEmitter } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'
import articleApi from '~/api/article'
import { BROWSING_HISTORY_IMGS_DIRNAME } from '~/constants'
import storage from '~/utils/storage'

export interface BrowsingHistory {
  title: string
  timestamp: number
  imgPath: string | null
}

export default function(title: string) {
  const timestamp = new Date().getTime()

  articleApi.getMainImage(title, 250)
    .then(async img => {
      let _history = storage.get('browsingHistory') || []
      _history.some((item, index) => {
        if (item.title === title) {
          _history.splice(index, 1)
          return true
        }
      })

      let result: BrowsingHistory = { title, timestamp, imgPath: null }

      if (img) {
        try {
          const imgSuffixName = img.source.replace(/^.+\.([^\.]+)$/, '$1')
          const imgSavePath = `/${BROWSING_HISTORY_IMGS_DIRNAME}/${encodeURIComponent(title)}.${imgSuffixName}`
          await RNFetchBlob
            .config({ 
              path: RNFetchBlob.fs.dirs.DocumentDir + imgSavePath,
              timeout: 6000,
            })
            .fetch('get', img.source)
            .catch(console.log)

          result.imgPath = imgSavePath
        } catch (e) { console.log(e) }
      }

      _history.unshift(result)
      storage.set('browsingHistory', _history)
    })
    .catch(e => console.log(e))
}