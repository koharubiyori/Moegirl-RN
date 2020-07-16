import AsyncStorage from '@react-native-community/async-storage'
import { SourceStorages } from './storage'
import { sourceList } from '~/request/moegirl'
import { SettingsStoreData } from '~/mobx/settings'

type LocalStorages = { settings: SettingsStoreData } & {
  [SiteName in keyof typeof sourceList]: SourceStorages
}

export interface MyStorageManager {
  set <Key extends keyof LocalStorages>(key: Key, val: LocalStorages[Key]): Promise<void>
  get <Key extends keyof LocalStorages>(key: Key): Promise<LocalStorages[Key] | null>
  remove (key: keyof LocalStorages): Promise<void>
  merge <Key extends keyof LocalStorages>(key: Key, val: Partial<LocalStorages[Key]>): Promise<void>
}

const baseStorage: MyStorageManager = {
  set: (key, val) => AsyncStorage.setItem(key, JSON.stringify(val)),
  get: key => AsyncStorage.getItem(key).then(data => JSON.parse(data || 'null')),
  remove: key => AsyncStorage.removeItem(key),
  merge: (key, val) => AsyncStorage.mergeItem(key, JSON.stringify(val))
}

export default baseStorage