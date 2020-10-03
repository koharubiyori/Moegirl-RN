import zhHans from './zh-hans'

const zhHant: typeof zhHans = {
  index: {
    clearArticleCache: {
      check: '確定要清空條目快取嗎？',
      success: '已清除所有條目快取'
    },
    clearHistory: {
      check: '確定要清空瀏覽歷史嗎？',
      success: '已清除所有瀏覽歷史'
    },
    logout: {
      check: '確定要登出嗎？',
      success: '已登出'
    },
    checkNewVersion: {
      loading: '檢視新版本...',
      none: '當前为最新版本',
      netErr: '網路錯誤',
    },
    sourceSelection: {
      title: '選擇資料來源',
      options: {
        moegirl: '萌娘百科',
        hmoe: 'H萌娘'
      }
    },
    themeSelection: {
      title: '選擇主題',
      checkText: '確定'
    },
    langSelection: {
      title: '選擇語言'
    },
    title: '設定',
    article: {
      title: '條目',
      heimu: {
        title: '黑幕開關',
        subtext: '關閉後黑幕將預設為刮開狀態'
      },
      stopAudio: {
        title: '離開停止所有音訊',
        subtext: '離開條目時停止當前條目上所有正在播放的音訊'
      }
    },
    view: {
      theme: '更换主題'
    },
    cache: {
      title: '快取',
      cachePriority: {
        title: '快取優先模式',
        subtext: '開啟後如果條目有快取將優先使用'
      },
      clearCache: '清除條目快取',
      clearHistory: '清除瀏覽歷史'
    },
    account: {
      title: '賬戶',
      login: '登入',
      logout: '登出'
    },
    other: {
      title: '其他',
      changeSource: '更換資料來源',
      selectLang: '選擇語言',
      about: '關於',
      checkVersion: '檢視新版本',
      checkNewVersionOnGithub: '在Github上檢視新版本',
      gotoGithub: '前往Github下載支援H萌娘的版本'
    }
  }
}

export default zhHant