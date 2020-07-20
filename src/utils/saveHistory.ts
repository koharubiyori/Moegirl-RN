import RNFetchBlob from 'rn-fetch-blob'
import articleApi from '~/api/article'
import { BROWSING_HISTORY_IMGS_DIRNAME } from '~/constants'
import storage from '~/utils/storage'
import md5 from 'md5'
import store from '~/mobx'

export interface BrowsingHistory {
  title: string
  displayTitle?: string
  timestamp: number
  imgPath: string | null
}

export const historyImgPath = (title: string, imgSuffixName: string) => 
  `/${BROWSING_HISTORY_IMGS_DIRNAME}/${md5(store.settings.source + title)}.${imgSuffixName}`

export default async function saveHistory(title: string, displayTitle?: string) {
  const timestamp = new Date().getTime()

  const img = await articleApi.getMainImage(title, 250).catch(e => {
    console.log('获取条目图片失败', e)
    return Promise.resolve(null)
  })

  console.log('条目图片', img)
  let _history = storage.get('browsingHistory') || []
  _history.some((item, index) => {
    if (item.title === title) {
      _history.splice(index, 1)
      return true
    }
  })

  let result: BrowsingHistory = { title, timestamp, imgPath: null, displayTitle }

  if (img) {
    try {
      const imgSuffixName = img.source.replace(/^.+\.([^\.]+)$/, '$1')
      const imgSavePath = historyImgPath(title, imgSuffixName)
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
}

export function getHistoryImgBase64(path: string): Promise<string> {
  const imgPath = RNFetchBlob.fs.dirs.DocumentDir + path
  const imgSuffixName = path.match(/\.([^\.]+)$/)![1]

  return RNFetchBlob.fs.readFile(imgPath, 'base64')
    .then(data => `data:image/${imgSuffixName};base64,${data}`)
    .catch(e => console.log(e)) as any
}