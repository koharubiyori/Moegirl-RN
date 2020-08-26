const zhHans = {
  index: {
    unwatchTitle: {
      check: (title: string) => `确定要将“${title}”从监视列表移除？`,
      success: '已移出监视列表'
    },
    title: '监视列表',
    netErr: '加载失败，点击重试',
    allLoaded: '已经没有啦'
  },

  item: {
    lastUpdate: (date: string) => `最后编辑于：${date}`,
    redirect: (title: string) => `重定向至：${title}`
  }
}

export default zhHans