const zhHans = {
  index: {
    title: (userName: string) => '回复：' + userName,
    count: (count: string | number) => `共${count}条回复`,
    allLoaded: '已经没有啦',
    noData: '暂无回复'
  },
}

export default zhHans