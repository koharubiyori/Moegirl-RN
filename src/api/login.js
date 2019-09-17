import request from '~/utils/moeRequest'

export function getToken(){
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
    const {query:{tokens:{logintoken: token}}} = await getToken()
  }catch(e){
    console.log(e)
  }
}