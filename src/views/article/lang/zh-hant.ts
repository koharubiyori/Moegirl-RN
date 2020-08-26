import zhHans from './zh-hans'

const zhHant: typeof zhHans = {
  index: {
    redirectFrom: (title: string) => '重定向自' + title,
    anchorGoto: (anchorName: string) => `該連結指向了${anchorName}章節`,
    addedToWatchList: '已加入監視列表',
    removedFromWatchList: '已移出監視列表',
    netErr: '網路錯誤',
    userPageNoExistMsg: '你的用戶頁不存在，請點選空白區域編輯並建立',
    noExistMsg: '該條目或用戶頁還未建立',
  },

  header: {
    actions: {
      refresh: '刷新',
      login: '登入',
      addedToWatchList: '加入監視列表',
      removeFromWatchList: '移出監視列表',
      editPage: '編輯此頁',
      addSection: '新增話題',
      shareText: '分享',
      share: {
        title: '萌娘百科分享',
        moegirl: '萌娘百科',
        hmoe: 'H萌娘' 
      },
      showContents: '開啟目錄',
      
    }
  },

  commentButton: {
    loadingMsg: '載入中，請稍候'
  },

  contentsView: {
    title: '目錄'
  }
}

export default zhHant