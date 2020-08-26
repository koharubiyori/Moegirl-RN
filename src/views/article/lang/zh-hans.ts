const zhHans = {
  index: {
    redirectFrom: (title: string) => '重定向自' + title,
    anchorGoto: (anchorName: string) => `该链接指向了${anchorName}章节`,
    addedToWatchList: '已加入监视列表',
    removedFromWatchList: '已移出监视列表',
    netErr: '网络错误',
    userPageNoExistMsg: '你的用户页不存在，请点击空白区域编辑并创建',
    noExistMsg: '该条目或用户页还未创建',
  },

  header: {
    actions: {
      refresh: '刷新',
      login: '登录',
      editPage: '编辑此页',
      addSection: '添加话题',
      addedToWatchList: '加入监视列表',
      removeFromWatchList: '移出监视列表',
      shareText: '分享',
      share: {
        title: '萌娘百科分享',
        moegirl: '萌娘百科',
        hmoe: 'H萌娘' 
      },
      showContents: '打开目录'
    }
  },

  commentButton: {
    loadingMsg: '加载中，请稍候'
  },

  contentsView: {
    title: '目录'
  }
}

export default zhHans