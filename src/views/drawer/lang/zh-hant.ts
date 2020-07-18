import zhHans from './zh-hans'

const zhHant: typeof zhHans = {
  index: {
    actionHintTitle: '操作提示',
    actionHints: [
      '1. 左滑開啟抽屜',
      '2. 條目頁右滑開啟目錄',
      '3. 條目內容中長按b站播放器按鈕跳轉至b站對應影片頁(當然前提是手機裡有b站app)',
      '4. 左右滑動影片播放器小窗可以關閉影片'
    ],
    welcome: '歡迎你，',
    loginHint: '登入/加入',
    moegirl: '萌娘百科',
    hmoe: 'H萌娘',
    
    items: {
      talk: '討論版',
      watchList: '監視列表',
      browsingHistory: '瀏覽歷史',
      actionHint: '操作提示',
      nightMode: (enable: boolean) => `${enable ? '開啟' : '關閉'}黑夜模式`,
    },
  
    settings: '設定',
    exit: '退出應用'
  }
}

export default zhHant