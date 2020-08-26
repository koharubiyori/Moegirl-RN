export namespace AccountApiData {
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

  interface GetInfo {
    query: {
      userinfo: {
        id: number
        name: string
        implicitgroups: ('*' | 'user' | 'autoconfirmed')[]
      }
    }
  }
}
