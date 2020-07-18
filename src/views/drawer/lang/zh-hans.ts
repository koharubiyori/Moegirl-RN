const zhHans = {
  index: {
    actionHintTitle: '操作提示',
    actionHints: [
      '1. 左滑开启抽屉',
      '2. 条目页右滑开启目录',
      '3. 条目内容中长按b站播放器按钮跳转至b站对应视频页(当然前提是手机里有b站app)',
      '4. 左右滑动视频播放器小窗可以关闭视频'
    ],
    welcome: '欢迎你，',
    loginHint: '登录/加入',
    moegirl: '萌娘百科',
    hmoe: 'H萌娘',
    
    items: {
      talk: '讨论版',
      watchList: '监视列表',
      browsingHistory: '浏览历史',
      actionHint: '操作提示',
      nightMode: (enable: boolean) => `${enable ? '开启' : '关闭'}黑夜模式`,
    },
  
    settings: '设置',
    exit: '退出应用'
  }
}

export default zhHans