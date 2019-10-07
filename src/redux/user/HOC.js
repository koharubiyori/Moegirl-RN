import { connect } from 'react-redux'
import { SET_INFO, CLEAR_INFO } from './actionTypes'
import { login as _login } from '~/api/login'

function mapDispatchToProps(dispatch){
  const login = (userName, password) => dispatch(dispatch => 
    new Promise((resolve, reject) =>{
      _login(userName, password).then(data =>{
        if(data.clientlogin.status === 'PASS'){
          dispatch({ type: SET_INFO, name: data.clientlogin.username })
          resolve(data.clientlogin.username)
        }else{ reject(data.clientlogin.status) }
      }).catch(reject)
    })
  )

  const logout = () => dispatch({ type: CLEAR_INFO })

  return { login, logout }
}

export default function(Element){
  return connect(
    state => ({ state }),
    dispatch => ({ user: mapDispatchToProps(dispatch) })
  )(Element)
}
