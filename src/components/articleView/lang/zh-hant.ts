import zhHans from './zh-hans'

const zhHant: typeof zhHans = {
  index: {
    netErrExistsCache: '因讀取失敗，載入條目快取',
    netErr: '網路超時，讀取失敗',

    events: {
      noExists: '該條目還未建立',
      loginMsg: '登入後才可以進行編輯，要前往登入介面嗎？',
      pressImage: {
        loading: '獲取連結中...'
      },
    },
    reload: '重新載入'
  },

  controls: {
    biliPlayer: {
      loading: '標題獲取中...',
      removed: '影片又掛了',
      netErr: '標題獲取失敗'
    },
    collapsible: {
      collapse: '摺疊',
      unfold: '展開'
    }
  },

  scripts: {
    addCategoriesSection: {
      category: '分類'
    },
    addCapyright: {
      content: '本站全部內容禁止商業使用。文字內容除另有宣告外，均在<a href="https://creativecommons.org/licenses/by-nc-sa/3.0/deed.zh">知識共享 署名-非商業性使用-相同方式共享 3.0 (CC BY-NC-SA 3.0)</a> 許可協議下提供，附加條款亦可能應用，詳細資訊參見<a href="/萌娘百科:版权信息">萌娘百科:版權資訊</a>。其他型別作品版權歸屬原作者，如有授權遵照授權協議使用。'
    }
  }
}

export default zhHant