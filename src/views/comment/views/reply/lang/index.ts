import zhHans from './zh-hans'
import zhHant from './zh-hant'
import createI18n from '~/utils/createI18n'

const i = createI18n({
  'zh-hans': zhHans,
  'zh-hant': zhHant
})

export default i