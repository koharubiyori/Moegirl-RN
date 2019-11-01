  // b站播放器
export default function(){
  var viewBox = $('#webViewContainer')

  viewBox.find('.wikitable.bilibili-video-container').each(function () {
    var avId = $(this).data('aid').toString().replace('av', '')
    // var isReload = 'isbiliPlayerReload' in config && config.isbiliPlayerReload
    var isReload = true
    var player = `<iframe src="https://player.bilibili.com/player.html?aid=${avId}&page=${$(this).data('page')}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width:100%; background-color:#ccc" class="bilibili-player"></iframe>`

    var title = $('<div class="bilibili-video-title">标题获取中...</div>')
    var container = $(this).data('collapsed', true)
    title.click(function(){
      if(container.data('collapsed')){
        isReload && container.append(player)
        container.find('.bilibili-player').slideDown(200)
        container.data('collapsed', false)
      }else{
        container.find('.bilibili-player').slideUp(200, function(){
          isReload && $(this).remove()
        })
        container.data('collapsed', true)
      }
    })

    var titlePhoneEvent = new Hammer(title[0])
    titlePhoneEvent.on('press', function(){
      ReactNativeWebView.postMessage(JSON.stringify({ type: 'openApp', data: { url: 'bilibili://video/' + avId  } }))
    })

    var titleText = $(this).data('title')
    if(titleText){
      title.text(titleText)
    }else{
      // title.text('av' + avId)

      var info = _request({
        url: 'https://api.bilibili.com/x/web-interface/view',
        method: 'get',
        params: {
          aid: avId
        }
      }, function(data){
        data = JSON.parse(data)
        if(data.error) return title.text('标题获取失败')
        if('data' in data){
          title.text(data.data.title)
        }else{
          switch(data.code){
            default: {
              return title.text('标题获取失败')
            }
            case '-404': {
              return title.text('视频又挂了_(:з」∠)_')
            }
          }
        }
      })

      ReactNativeWebView.postMessage(JSON.stringify({ type: 'request', data: info }))
    }

    $(this).css({
      display: 'block',
      width: '100%'
    })

    $(this).append(title)
    !isReload && $(this).append(player)
  })
}