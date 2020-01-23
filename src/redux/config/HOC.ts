import store from '~/redux'
import myConnect from '~/utils/redux/myConnect'
import { INIT, SET, State } from './index'

const { dispatch, getState } = store

export const set = (config: Partial<State>) => dispatch({ type: SET, data: config })
export const init = () => dispatch({ type: INIT })

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
