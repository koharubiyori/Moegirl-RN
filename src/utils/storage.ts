import { ArticleApiData } from '~/api/article.d'
import store from '~/redux'
import { init as initConfig, set as setConfig } from '~/redux/config/HOC'
import baseStorage from './baseStorage'
import { siteMaps } from './moeRequest'
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
  load (): Promise<void>
  set <Key extends keyof SiteStorages>(key: Key, val: SiteStorages[Key]): void
  get <Key extends keyof SiteStorages>(key: Key): SiteStorages[Key] | null
  remove (key: keyof SiteStorages): void
  merge <Key extends keyof SiteStorages>(key: Key, val: SiteStorages[Key]): void
}

// 利用一个数据实例，解决每次操作整份数据可能导致的响应缓慢。
// 所有方法都会在实例上进行操作，同时再操作实际存储。不等待实际存储的Promise
let siteStorages: SiteStorages = {} as any
// 当前domain，只在load中获取一次
let site: keyof typeof siteMaps

const siteStorageManager: MyStorageManager = {
  // 初始化数据实例和domain
  load: async () => {
    const currentConfig = store.getState().config
    site = currentConfig.source

    const data = await baseStorage.get(site)
    if (data) {
      siteStorages = data
    } else {
      await baseStorage.set(site, {} as any)
    }
  },
  
  set: (key, val) => {
    siteStorages[key] = val
    // 这里放弃使用merge，因为之前发生了丢数据的情况，怀疑是这个merge方法导致的(官网标注没有被所有原生实现支持)
    baseStorage.set(site, siteStorages)
  },

  get: key => {
    return (key in siteStorages) ? siteStorages[key] : null
  },

  remove: key => {
    delete siteStorages[key]
    baseStorage.set(site, siteStorages)
  },

  merge: (key, val) => {
    let currentData = siteStorages[key] || {}
    if (typeof currentData === 'object' && typeof val === 'object') {
      siteStorages[key] = {
        ...currentData as any,
        ...val as any
      }
    } else {
      siteStorages[key] = val
    }

    baseStorage.set(site, siteStorages)
  }
}

export default siteStorageManager