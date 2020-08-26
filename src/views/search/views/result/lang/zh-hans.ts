import { Moment } from 'moment'

const zhHans = {
  index: {
    title: (keyword: string) => `搜索：${keyword}`,
    resultCount: (count: number) => `共搜索到${count}条结果。`,
    netErr: '加载失败，点击重试',
    allLoaded: '已经没有啦',
    noData: '什么也没找到...',
  },

  item: {
    subInfo: {
      redirect: (title: string) => `「${title}」指向该页面`,
      sectionTitle: (title: string) => `该页面有名为“${title}”的章节`,
      category: (title: string) => `匹配自页面分类：${title}`
    },
    noData: '页面内貌似没有内容呢...',
    updateDate: (moment: Moment) => `最後更新於：${moment.format('YYYY年MM月DD日')}`
  }
}

export default zhHans