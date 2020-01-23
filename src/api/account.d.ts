export namespace ApiData {
  interface getToken {
    query: {
      tokens: {
        logintoken: string
      }
    }
  } 
  
  interface login {
    clientlogin: {
      status: 'FAIL' | 'PASS'
      message?: string
      messagecode?: string
      username?: string
    }
  }
}