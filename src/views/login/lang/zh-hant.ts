import zhHans from './zh-hans'

const zhHant: typeof zhHans = {
  index: {
    submit: {
      userNameEmptyMsg: '使用者名稱不能為空',
      passwordEmptyMsg: '密碼不能為空',
      loggingIn: '登入中...',
      loggedIn: '登入成功',
      netErr: '網路錯誤，請重試'
    },
    catchCopy: '萌娘百科，萬物皆可萌的百科全書！',
    userName: '使用者名稱',
    password: '密碼',
    login: '登入',
    moegirl: '萌百',
    hmoe: 'H萌娘',
    noAccountHint: (siteName: string) => `還沒有${siteName}帳號？點選前往官網進行註冊`
  }
}

export default zhHant