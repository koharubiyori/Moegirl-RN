const zhHans = {
  index: {
    summarySuffix: ' // 来自Moegirl Viewer的编辑',
    leaveHint: '编辑还未保存，确定要放弃编辑的内容？',
    unchangedHint: '内容未发生变化',
    edit: {
      title: (title: string) => `编辑：${title}`,
      submitting: '提交中...',
      success: '编辑成功',
      editConflict: '出现编辑冲突，请复制编辑的内容后再次进入编辑界面，并检查差异',
      protectedPage: '没有权限编辑此页面',
      readonly: '目前数据库处于锁定状态，无法编辑',
      unknownErr: '未知错误',
      netErr: '网络错误，请稍候再试'
    },
    submit: {
      submitting: '提交中...'
    }
  },

  captcha: {
    title: '用户验证',
    loadingErr: '图片加载失败，点此重试',
    inputHint: '请输入图片中的字幕',
    inputHelp: '空格和标点符号无需输入，若看不清可以点击图片更换',
    cancel: '取消',
    submit: '提交'
  },

  submit: {
    title: '保存编辑',
    summaryPlaceholder: '请输入摘要',
    wordNumberLimit: (number: number) => `还能输入${number}个字`,
    quickSummary: {
      title: '快速摘要',
      list: ['修饰语句', '修正笔误', '内容扩充', '排版'],
    },
    cancel: '取消',
    submit: '提交'
  },

  codeEdit: {
    title: '维基文本',
    newSectionDefaultTitle: '请输入标题',
    reload: '重新加载'
  },

  preview: {
    title: '预览视图',
    reload: '重新加载'
  }
}

export default zhHans