import store from '~/redux'
import myConnect from '~/utils/redux/myConnect'
import { WRITE, SET, initState, State } from './index'
import baseStorage from '~/utils/baseStorage'

const { dispatch, getState } = store

export const set = (config: Partial<State>) => {
  dispatch({ type: SET, data: config })
  return baseStorage.set('config', { ...getState().config, ...config })
}

export const init = () => {
  dispatch({ type: WRITE, data: initState() })
  return baseStorage.set('config', initState())
}

export interface ConnectedDispatch {
  $config: {
    set: typeof set
    init: typeof init
  }
}

export type ConfigConnectedProps = ConnectedDispatch & {
  state: { config: State }
}

export const configHOC = myConnect('$config', { set, init })
