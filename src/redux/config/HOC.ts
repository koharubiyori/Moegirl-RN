import { SET, INIT, State } from './index'
import { connect } from 'react-redux'
import store from '~/redux'

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

export const configHOC = connect(
  state => ({ state }),
  dispatch => ({
    $config: { set, init }
  })
)
