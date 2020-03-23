// b站播放器
export default function() {
  let viewBox = $('#articleContentContainer')

  viewBox.find('.wikitable.bilibili-video-container').each(function () {
    let avId = parseInt($(this).data('id').toString().replace('av', ''))
    let page = $(this).data('page')

    let title = $('<div class="bilibili-video-title">标题获取中...</div>')
    title.click(function() {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'onPressBiliVideo', data: { avId, page } }))
    })

    let titlePhoneEvent = new Hammer(title[0])
    titlePhoneEvent.on('press', function() {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'vibrate' }))
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'openApp', data: { url: 'https://www.bilibili.com/video/' + avId } }))
    })

    let titleText = $(this).data('title')
    if (titleText) {
      title.text(titleText)
    } else {
      // title.text('av' + avId)

      let info = window._request({
        url: 'https://api.bilibili.com/x/web-interface/view',
        method: 'get',
        params: {
          aid: avId
        }
      }, function(data) {
        let { data: res } = data
        if (res.code !== 0) {
          title.text(res.code === -404 ? '视频又挂了_(:з」∠)_' : '标题获取失败')
        } else {
          title.text(res.data.title)
        }
      })

      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'request', data: info }))
    }

    $(this).css({
      display: 'block',
      width: '100%'
    })

    $(this).append(title)
  })
}