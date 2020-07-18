import zhHans from './zh-hans'

const zhHant: typeof zhHans = {
  index: {
    saveImg: {
      unknownErr: '未知錯誤',
      noPermissionMsg: '您沒有授權訪問手機儲存，無法儲存圖片。是否要前往應用詳情介面設定許可權？',
      downloadStart: '開始下載圖片',
      downloading: '正在下載圖片...',
      saved: '圖片已儲存至：',
      netErr: '發生錯誤，請重試'
    },

    checkPermission: {
      title: '請求寫入儲存許可權',
      message: '儲存圖片需要使用你的手機儲存',
      buttonNeutral: '暫不授予',
      buttonNegative: '禁止',
      buttonPositive: '允許',
    }
  }
}

export default zhHant