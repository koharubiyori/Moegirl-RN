import { connect } from 'react-redux'

export default function myConnect(namespace: string, dispatchList: { [dispatchName: string]: Function }) {
  return connect(
    state => ({ state }),
    () => ({ [namespace]: dispatchList })
  )
}