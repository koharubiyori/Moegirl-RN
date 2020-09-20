import zhHans from './zh-hans'

const zhHant: typeof zhHans = {
  index: {
    title: (title: string) => `評論：${title}`,
    popular: '熱門評論',
    count: (count: string | number) => `共${count}條評論`,
    netErr: '載入失敗，點選重試',
    allLoaded: '已經沒有啦',
    noData: '暫無評論'
  },

  editor: {
    closeHint: '關閉後當前編輯的評論內容將不會儲存，是否關閉？',
    submit: {
      emptyMsg: '評論或回覆內容不能為空',
      zeroMsg: '因萌百評論系統的bug，不能以“0”作為評論內容',
      submitting: '提交中...',
      netErr: '網路錯誤，請重試'
    },
    placeholder: '說點什麼吧...',
    submitBtn: '提交'
  },

  item: {
    reply: '回覆',
    lookMore: '檢視更多',
    
    like: {
      loginMsg: '未登入無法進行點贊，是否要前往登入介面？',
      netErr: '網路錯誤'
    },
    report: {
      againReportMsg: '不能重複舉報',
      checkMsg: (isReply: boolean) => `確定要舉報這條${isReply ? '回覆' : '評論'}嗎`,
      reportedMsg: '已舉報',
      netErr: '網路錯誤，請重試'
    },
    delete: {
      checkMsg: (isReply: boolean) => `確定要刪除自己的這條${isReply ? '回覆' : '評論'}嗎？`,
      netErr: '網路錯誤，請重試'
    }
  }
}

export default zhHant