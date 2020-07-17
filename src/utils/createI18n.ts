import { SettingsStoreData } from '~/mobx/settings'
import store from '~/mobx'

export type createI18nLangList = { [LangCode in SettingsStoreData['lang']]: { [wordName: string]: any } }

export default function createI18n<T extends createI18nLangList>(langList: T) {
  return <WordName extends keyof (T[keyof T])>(wordName: WordName): T[SettingsStoreData['lang']][WordName] => langList[store.settings.lang][wordName as string]
}