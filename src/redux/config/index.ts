import { ThemeColorType } from '~/theme'
import { siteMaps } from '~/utils/moeRequest'
import setActionHandler from '~/utils/redux/setActionHandler'

export const SET = Symbol()
export const WRITE = Symbol()

export interface ActionTypes {
  [SET]: {
    data: Partial<State>
  }

  [WRITE]: {
    data: State
  }
}

export const initState = (): State => ({
  heimu: true,
  immersionMode: false,
  changeThemeColorByArticleMainColor: false,
  showSiteSelector: false,
  currentSite: 'moegirl',
  theme: 'green'
})

export interface State {
  heimu: boolean
  immersionMode: boolean
  changeThemeColorByArticleMainColor: boolean
  showSiteSelector: boolean
  currentSite: keyof typeof siteMaps
  theme: ThemeColorType
}

const reducer: __Redux.ReduxReducer<State, keyof ActionTypes> = (state = initState(), action) => setActionHandler<ActionTypes, State>(action, {
  [SET]: action => {
    return { ...state, ...action.data }
  },

  [WRITE]: action => {
    return action.data
  }
}) || state

export default reducer