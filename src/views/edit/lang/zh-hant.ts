import zhHans from './zh-hans'

const zhHant: typeof zhHans = {
  index: {
    summarySuffix: ' // 來自Moegirl Viewer的編輯',
    leaveHint: '編輯還未儲存，確定要放棄編輯的內容？',
    unchangedHint: '內容未發生變化',
    edit: {
      title: (title: string) => `編輯：${title}`,
      submitting: '提交中...',
      success: '編輯成功',
      editConflict: '出現編輯衝突，請複製編輯的內容後再次進入編輯介面，並檢查差異',
      protectedPage: '沒有許可權編輯此頁面',
      readonly: '目前資料庫處於鎖定狀態，無法編輯',
      unknownErr: '未知錯誤',
      netErr: '網路錯誤，請稍候再試'
    },
    submit: {
      submitting: '提交中...'
    }
  },

  captcha: {
    title: '使用者驗證',
    loadingErr: '圖片載入失敗，點此重試',
    inputHint: '請輸入圖片中的字幕',
    inputHelp: '空格和標點符號無需輸入，若看不清可以點選圖片更換',
    cancel: '取消',
    submit: '提交'
  },

  submit: {
    title: '儲存編輯',
    summaryPlaceholder: '請輸入摘要',
    wordNumberLimit: (number: number) => `還能輸入${number}個字`,
    quickSummary: {
      title: '快速摘要',
      list: ['修飾語句', '修正筆誤', '內容擴充', '排版'],
    },
    cancel: '取消',
    submit: '提交'
  },

  codeEdit: {
    title: '維基文字',
    newSectionDefaultTitle: '請輸入標題',
    reload: '重新載入'
  },

  preview: {
    title: '預覽檢視',
    reload: '重新載入'
  }
}

export default zhHant