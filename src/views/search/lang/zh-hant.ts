import zhHans from './zh-hans'

const zhHant: typeof zhHans = {
  index: {
    keywordEmptyMsg: '搜索關鍵詞不能爲空',
    clearSearchHistory: {
      check: '確定要刪除所有搜索記錄嗎？',
      success: '操作成功'
    },
  },

  header: {
    searchInputPlaceholder: (siteName: string) => `搜索${siteName}...`,
    moegirl: '萌娘百科',
    hmoe: 'H萌娘'
  },

  recentSearch: {
    title: '最近搜索',
    noData: '暫無搜索記錄',
    removeSearchHistory: {
      check: '是否要刪除這條搜索記錄？'
    }
  },

  searchHint: {
    searching: '搜索中...'
  }
}

export default zhHant