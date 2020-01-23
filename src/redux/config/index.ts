import storage from '~/utils/storage'
import setActionHandler from '~/utils/redux/setActionHandler'

export const SET = Symbol()
export const INIT = Symbol()

export interface ActionTypes {
  [SET]: {
    data: Partial<State>
  }

  [INIT]: null
}

export interface State {
  heimu: boolean
  biliPlayerReload: boolean
  immersionMode: boolean
}

const init = () => ({
  heimu: true,
  biliPlayerReload: false,
  immersionMode: false,
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