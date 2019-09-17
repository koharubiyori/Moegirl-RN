  // b站播放器
export default function(content, vueObj, config){
  content.find('.wikitable.bilibili-video-container').each(function () {
    var avId = $(this).data('aid').toString().replace('av', '')
    var isReload = 'isbiliPlayerReload' in config && config.isbiliPlayerReload
    var player = `<iframe src="https://player.bilibili.com/player.html?aid=${avId}&page=${$(this).data('page')}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width:100%" class="bilibili-player"></iframe>`

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
      location.href = 'bilibili://video/' + avId
    })
    var titleText = $(this).data('title')
    if(titleText){
      title.text(titleText)
    }else{
      $.ajax({
        url: '/relay.php',
        type: 'post',
        timeout: 7000,
        data: {
          url: 'https://api.bilibili.com/x/web-interface/view',
          type: 'get',
          data: {
            aid: avId
          },
          timeout: 7
        }
      }).done(function(data){
        if('data' in data){
          title.text(data.data.title)
        }else{
          switch(data.code){
            default: {
              title.text('标题获取失败')
            }
            case '-404': {
              title.text('视频又挂了_(:з」∠)_')
            }
          }
        }
      }).fail(function(){
        title.text('标题获取失败')
      })
    }

    $(this).css({
      display: 'block',
      width: '100%'
    })

    $(this).append(title)
    !isReload && $(this).append(player)
  })
}