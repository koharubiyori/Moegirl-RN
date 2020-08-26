import store from '~/mobx'
import baseStorage from './baseStorage'
import { BrowsingHistory } from './saveHistory'
import { sourceList } from '~/request/moegirl'
import { SearchHistory } from '~/views/search'

// 这一层封装主要是为了隔离各个source的数据，便于萌百、h萌，或日后添加的更多source时方便管理
/*
  storage: {
    config: {},
    source1: SourceStorages,
    source2: SourceStorages
    ...
  }  
*/

// 本地数据格式
export interface SourceStorages {
  articleRedirectMap: { [pageName: string]: string }
  userName: string
  browsingHistory: BrowsingHistory[]
  searchHistory: SearchHistory[]
}

export interface MyStorageManager {
  load (): Promise<void>
  set <Key extends keyof SourceStorages>(key: Key, val: SourceStorages[Key]): void
  get <Key extends keyof SourceStorages>(key: Key): SourceStorages[Key] | null
  remove (key: keyof SourceStorages): void
  merge <Key extends keyof SourceStorages>(key: Key, val: SourceStorages[Key]): void
}

// 利用一个数据实例，解决每次操作整份数据可能导致的响应缓慢。
// 所有方法都会在实例上进行操作，同时再操作实际存储。不等待实际存储的Promise
let sourceStorages: SourceStorages = {} as any
// 当前source，只在load中获取一次
let source: keyof typeof sourceList

const storage: MyStorageManager = {
  // 初始化数据实例和source
  load: async () => {
    const currentSettings = store.settings
    source = currentSettings.source

    const data = await baseStorage.get(source)
    if (data) {
      sourceStorages = data
    } else {
      await baseStorage.set(source, {} as any)
    }
  },
  
  set: (key, val) => {
    sourceStorages[key] = val
    // 这里放弃使用merge，因为之前发生了丢数据的情况，怀疑是这个merge方法导致的(官网标注没有被所有原生实现支持)
    baseStorage.set(source, sourceStorages)
  },

  get: key => {
    return (key in sourceStorages) ? sourceStorages[key] : null
  },

  remove: key => {
    delete sourceStorages[key]
    baseStorage.set(source, sourceStorages)
  },

  merge: (key, val) => {
    let currentData = sourceStorages[key] || {}
    if (typeof currentData === 'object' && typeof val === 'object') {
      sourceStorages[key] = {
        ...currentData as any,
        ...val as any
      }
    } else {
      sourceStorages[key] = val
    }

    baseStorage.set(source, sourceStorages)
  }
}

export default storage