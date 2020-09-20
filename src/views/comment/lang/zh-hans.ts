const zhHans = {
  index: {
    title: (title: string) => `评论：${title}`,
    popular: '热门评论',
    count: (count: string | number) => `共${count}条评论`,
    netErr: '加载失败，点击重试',
    allLoaded: '已经没有啦',
    noData: '暂无评论'
  },

  editor: {
    closeHint: '关闭后当前编辑的评论内容将不会保存，是否关闭？',
    submit: {
      emptyMsg: '评论或回复内容不能为空',
      zeroMsg: '因萌百评论系统的bug，不能以“0”作为评论内容',
      submitting: '提交中...',
      netErr: '网络错误，请重试'
    },
    placeholder: '说点什么吧...',
    submitBtn: '提交'
  },

  item: {
    reply: '回复',
    lookMore: '查看更多',
    
    like: {
      loginMsg: '未登录无法进行点赞，是否要前往登录界面？',
      netErr: '网络错误'
    },
    report: {
      againReportMsg: '不能重复举报',
      checkMsg: (isReply: boolean) => `确定要举报这条${isReply ? '回复' : '评论'}吗`,
      reportedMsg: '已举报',
      netErr: '网络错误，请重试'
    },
    delete: {
      checkMsg: (isReply: boolean) => `确定要删除自己的这条${isReply ? '回复' : '评论'}吗？`,
      netErr: '网络错误，请重试'
    }
  }
}

export default zhHans