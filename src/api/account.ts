import request from '~/utils/moeRequest'
import { AccountApiData } from './account.d'

function getToken() {
  return request<AccountApiData.getToken>({
    method: 'post',
    params: {
      action: 'query',
      meta: 'tokens',
      type: 'login'
    }
  })
}

function _login(token: string, username: string, password: string) {
  return request<AccountApiData.login>({
    method: 'post',
    params: {
      action: 'clientlogin',
      loginmessageformat: 'html',
      loginreturnurl: 'https://zh.moegirl.org/Mainpage',
      username, 
      password,
      rememberMe: true,
      logintoken: token    
    }
  })
}

async function login(userName: string, password: string) {
  try {
    const tokenData = await getToken()
    const token = tokenData.query.tokens.logintoken
    return _login(token, userName, password)
  } catch (e) {
    return Promise.reject(e)
  }
}

function logout() {
  return request({
    method: 'post',
    params: { action: 'logout' }
  })
}

function getInfo() {
  return request<AccountApiData.GetInfo>({
    params: {
      action: 'query',
      meta: 'userinfo',
      uiprop: 'implicitgroups'
    }
  })
}

const accountApi = { getToken, login, logout, getInfo }
export default accountApi