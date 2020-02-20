import storage from '~/utils/storage'
import setActionHandler from '~/utils/redux/setActionHandler'
import { ThemeType } from '~/theme'

export const SET = Symbol()
export const INIT = Symbol()

export interface ActionTypes {
  [SET]: {
    data: Partial<State>
  }

  [INIT]: null
}

export const siteMaps = {
  moegirl: 'https://zh.moegirl.org',
  hmoe: 'https://www.hmoegirl.com'
}

export interface State {
  heimu: boolean
  immersionMode: boolean
  changeThemeColorByArticleMainColor: boolean
  showSiteSelector: boolean
  currentSite: keyof typeof siteMaps
  theme: ThemeType
}

const init = (): State => ({
  heimu: true,
  immersionMode: false,
  changeThemeColorByArticleMainColor: false,
  showSiteSelector: false,
  currentSite: 'moegirl',
  theme: 'green'
})

const reducer: __Redux.ReduxReducer<State, keyof ActionTypes> = (state = init(), action) => setActionHandler<ActionTypes, State>(action, {
  [SET]: action => {
    storage.merge('config', action.data)
    return { ...state, ...action.data }
  },

  [INIT]: action => {
    storage.set('config', init())
    return init()
  }
}) || state

export default reducer