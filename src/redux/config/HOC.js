import { SET, INIT } from './actionTypes'
import { connect } from 'react-redux'
import store from '~/redux'

const { dispatch } = store

export const set = config => dispatch({ type: SET, data: config })
export const init = () => dispatch({ type: INIT })

export default function(Element){
  return connect(
    state => ({ state }),
    dispatch => ({
      config: { set, init }
    })
  )(Element)
}