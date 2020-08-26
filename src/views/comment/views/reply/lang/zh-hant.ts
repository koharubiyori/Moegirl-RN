import zhHans from './zh-hans'

const zhHant: typeof zhHans = {
  index: {
    title: (userName: string) => '回覆:' + userName,
    count: (count: string | number) => `共${count}條回覆`,
    allLoaded: '已經沒有啦',
    noData: '暫無回覆'
  },
}

export default zhHant