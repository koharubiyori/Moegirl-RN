import { ThemeColorType } from '~/theme'
import { siteMaps } from '~/utils/moeRequest'
import setActionHandler from '~/utils/redux/setActionHandler'
import { isHmoe } from '~/../app.json'

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

export interface State {
  heimu: boolean
  immersionMode: boolean
  changeThemeColorByArticleMainColor: boolean
  source: keyof typeof siteMaps
  theme: ThemeColorType
  lastTheme: ThemeColorType // 用于在黑夜模式和其他theme间切换
}

export const initState = (): State => ({
  heimu: true,
  immersionMode: false,
  changeThemeColorByArticleMainColor: false,
  source: isHmoe ? 'hmoe' : 'moegirl',
  theme: isHmoe ? 'pink' : 'green',
  lastTheme: isHmoe ? 'pink' : 'green',
})

const reducer: __Redux.ReduxReducer<State, keyof ActionTypes> = (state = initState(), action) => setActionHandler<ActionTypes, State>(action, {
  [SET]: action => {
    return { ...state, ...action.data }
  },

  [WRITE]: action => {
    return action.data
  }
}) || state

export default reducer