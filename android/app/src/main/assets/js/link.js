var viewBox = $('#webViewContainer')

// 拦截点击链接
viewBox.on('click', 'a', function(e){
  e.preventDefault()
  var link = $(e.target).attr('href') || $(e.target).parent('a').attr('href')
  var type = 'inner'
  if(/^\//.test(link)){
    link = decodeURIComponent(link.substring(1))
  }
  if(/^https?:\/\//.test(link)){
    type = 'outer'
  }
  if(link.indexOf('redlink=1') >= 0){
    type = 'notExists'
  }

  ReactNativeWebView.postMessage(JSON.stringify({ type: 'onTapLink', data:{ link, type } }))
})
