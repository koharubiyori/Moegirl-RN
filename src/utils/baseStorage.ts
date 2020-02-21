import AsyncStorage from '@react-native-community/async-storage'
import { BrowsingHistory } from './saveHistory'
import { State as Config } from '~/redux/config'
import { ArticleApiData } from '~/api/article.d'
import { siteMaps } from './moeRequest'
import { SiteStorages } from './storage'

type LocalStorages = { config: Config } & {
  [SiteName in keyof typeof siteMaps]: SiteStorages
}

export interface MyStorageManager {
  set <Key extends keyof LocalStorages>(key: Key, val: LocalStorages[Key]): Promise<void>
  get <Key extends keyof LocalStorages>(key: Key): Promise<LocalStorages[Key] | null>
  remove (key: keyof LocalStorages): Promise<void>
  merge <Key extends keyof LocalStorages>(key: Key, val: Partial<LocalStorages[Key]>): Promise<void>
}

const baseStorage: MyStorageManager = {
  set: (key, val) => AsyncStorage.setItem(key, JSON.stringify(val)),
  get: key => new Promise((resolve, reject) => AsyncStorage.getItem(key).then(data => resolve(JSON.parse(data || 'null'))).catch(reject)),
  remove: key => AsyncStorage.removeItem(key),
  merge: (key, val) => AsyncStorage.mergeItem(key, JSON.stringify(val))
}

export default baseStorage