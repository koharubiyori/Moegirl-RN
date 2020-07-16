import RNFetchBlob from 'rn-fetch-blob'
import { ARTICLE_DATA_CACHES_DIRNAME } from '~/constants'
import { ArticleApiData } from '~/api/article/types'
import store from '~/mobx'

const basePath = RNFetchBlob.fs.dirs.CacheDir + `/${ARTICLE_DATA_CACHES_DIRNAME}/`
const articleDataCachePath = (title: string) => basePath + `${store.settings.source}_${title}.json`

export default {
  addCache(title: string, data: ArticleApiData.GetContent) {
    return RNFetchBlob.fs.writeFile(articleDataCachePath(title), JSON.stringify(data), 'utf8')
  },

  clearCache() {
    return RNFetchBlob.fs.unlink(basePath)
  },
  
  async getCacheData(title: string) {
    try {
      let isExistsCacheFile = await RNFetchBlob.fs.exists(articleDataCachePath(title))
      if (!isExistsCacheFile) return null
  
      let articleDataStr: string = await RNFetchBlob.fs.readFile(articleDataCachePath(title), 'utf8')
      let stat = await RNFetchBlob.fs.stat(articleDataCachePath(title))
      let articleData: ArticleApiData.GetContent = JSON.parse(articleDataStr)
      return { articleData, lastModified: stat.lastModified }
    } catch (e) {
      console.log(e)
      return Promise.reject(e)
    }
  },

  async getCacheTitleList() {
    try {
      let articleCacheFileList = await RNFetchBlob.fs.lstat(basePath)
      return articleCacheFileList.map(item => decodeURIComponent(item.filename.replace(/\.json$/, '')))
    } catch (e) {
      return null
    }
  },
}
