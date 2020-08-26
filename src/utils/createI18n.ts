import SettingsStore, { SettingsStoreData } from '~/mobx/settings'
import store from '~/mobx'

export type createI18nLangList = { [LangCode in SettingsStoreData['lang']]: { [wordName: string]: any } }

export default function createI18n<T extends createI18nLangList>(langList: T, lang?: SettingsStore['lang']): T[SettingsStoreData['lang']] {
  return new Proxy({}, {
    get: (target, prop) => langList[lang || store.settings.lang][prop as string]
  }) as any
}