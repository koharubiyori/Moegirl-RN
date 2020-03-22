import { ArticleApiData } from '~/api/article.d'
import store from '~/redux'
import baseStorage from './baseStorage'
import { BrowsingHistory } from './saveHistory'

// 这一层封装主要是为了隔离各个domain的数据，便于萌百、h萌，或日后添加的更多domain时方便管理
/*
  storage: {
    config: {},
    domain1: SiteStorages,
    domain2: SiteStorages
    ...
  }  
*/

// 本地数据格式
export interface SiteStorages {
  articleCache: { [articleName: string]: ArticleApiData.GetContent }
  articleRedirectMap: { [pageName: string]: string }
  userName: string
  browsingHistory: BrowsingHistory[]
  searchHistory: string[]
}

export interface MyStorageManager {
  set <Key extends keyof SiteStorages>(key: Key, val: SiteStorages[Key]): Promise<void>
  get <Key extends keyof SiteStorages>(key: Key): Promise<SiteStorages[Key] | null>
  remove (key: keyof SiteStorages): Promise<void>
  merge <Key extends keyof SiteStorages>(key: Key, val: SiteStorages[Key]): Promise<void>
}

const siteStorageManager: MyStorageManager = {
  set: (key, val) => {
    const site = store.getState().config.source
    return baseStorage.merge(site, { [key]: val })
  },

  get: async key => {
    try {
      const site = store.getState().config.source
      const data = await baseStorage.get(site)
      return data ? data[key] : null
    } catch (e) {
      console.log(e)
      return null
    }
  },

  remove: async key => {
    try {
      const site = store.getState().config.source
      const data = await baseStorage.get(site)
      if (!data) { return }

      delete data[key]
      return baseStorage.set(site, data)
    } catch (e) {
      console.log(e)
    }
  },

  merge: async (key, val) => {
    const site = store.getState().config.source
    const data = await baseStorage.get(site)
    if (!data) { return }

    let currentData = data[key] || {}
    if (typeof currentData === 'object' && typeof val === 'object') {
      currentData = {
        ...currentData as any,
        ...val as any
      }
    } else {
      currentData = val
    }

    data[key] = currentData as any
    baseStorage.set(site, data)
  }
}

export default siteStorageManager