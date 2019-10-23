import request from '~/utils/moeRequest'

function getToken(){
  return request({
    method: 'post',
    params: {
      action: 'query',
      meta: 'tokens',
      type: 'login'
    }
  })
}

function _login(token, username, password){
  return request({
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

export async function login(userName, password){
  try{
    const tokenData = await getToken()
    const token = tokenData.query.tokens.logintoken
    return _login(token, userName, password)
  }catch(e){
    return Promise.reject(e)
  }
}