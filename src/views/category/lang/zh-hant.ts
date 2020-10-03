import zhHans from './zh-hans'

const zhHant: typeof zhHans = {
  index: {
    title: (title: string) => '分類:' + title,
    categoryPageHint: '這個分類對應的條目為',
    netErr: '載入失敗，點選重試',
    allLoaded: '已經沒有啦',
    noData: '該分類下沒有條目',
  },

  item: {
    noImg: '暫無圖片'
  }
}

export default zhHant