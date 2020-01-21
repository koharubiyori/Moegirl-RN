// b站播放器
export default function() {
  let viewBox = $('#webViewContainer')

  viewBox.find('.wikitable.bilibili-video-container').each(function () {
    let avId = parseInt($(this).data('aid').toString().replace('av', ''))
    let page = $(this).data('page')
    let isReload = window._appConfig.biliPlayerReload
    let player = `<iframe src="https://player.bilibili.com/player.html?aid=${avId}&page=${$(this).data('page')}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width:100%; background-color:#ccc" class="bilibili-player"></iframe>`

    let title = $('<div class="bilibili-video-title">标题获取中...</div>')
    // let container = $(this).data('collapsed', true)
    title.click(function() {
      // if(container.data('collapsed')){
      //   isReload && container.append(player)
      //   container.find('.bilibili-player').slideDown(200)
      //   container.data('collapsed', false)
      // }else{
      //   container.find('.bilibili-player').slideUp(200, function(){
      //     isReload && $(this).remove()
      //   })
      //   container.data('collapsed', true)
      // }
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'onTapBiliVideo', data: { avId, page } }))
    })

    let titlePhoneEvent = new Hammer(title[0])
    titlePhoneEvent.on('press', function() {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'openApp', data: { url: 'bilibili://video/' + avId } }))
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
        let res = JSON.parse(data)
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
    !isReload && $(this).append(player)
  })
}