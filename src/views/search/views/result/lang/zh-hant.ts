import zhHans from './zh-hans'
import { Moment } from 'moment'

const zhHant: typeof zhHans = {
  index: {
    title: (keyword: string) => `搜尋：${keyword}`,
    resultCount: (count: number) => `共搜尋到${count}條結果。`,
    netErr: '載入失敗，點選重試',
    allLoaded: '已經沒有啦',
    noData: '什麼也沒找到...',
  },

  item: {
    subInfo: {
      redirect: (title: string) => `「${title}」指向該頁面`,
      sectionTitle: (title: string) => `該頁面有名為“${title}”的章節`,
      category: (title: string) => `匹配自頁面分類：${title}`
    },
    noData: '頁面內貌似沒有內容呢...',
    updateDate: (moment: Moment) => `最後更新於：${moment.format('YYYY年MM月DD日')}`
  }
}

export default zhHant