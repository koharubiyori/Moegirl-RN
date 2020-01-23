import storage from '~/utils/storage'

export const SET = Symbol()
export const INIT = Symbol()

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

const reducer: __Redux.ReduxReducer<State> = (state = init(), action) => {
  switch (action.type) {

    // data
    case SET: {
      storage.merge('config', action.data)
      return {
        ...state,
        ...action.data
      }
    }

    case INIT: {
      storage.set('config', init())
      return init()
    }

    default: {
      return state
    }
  }
}

export default reducer