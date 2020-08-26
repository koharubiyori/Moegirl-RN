import zhHans from './zh-hans'

const zhHant: typeof zhHans = {
  index: {
    unwatchTitle: {
      check: (title: string) => `確定要將“${title}”從監視列表移除？`,
      success: '已移出監視列表'
    },
    title: '監視列表',
    netErr: '載入失敗，點選重試',
    allLoaded: '已經沒有啦'
  },

  item: {
    lastUpdate: (date: string) => `最後編輯於：${date}`,
    redirect: (title: string) => `重定向至：${title}`
  }
}

export default zhHant