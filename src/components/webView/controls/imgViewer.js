import getImgUrl from '@u/page/getImgUrl'
export default function(content){
  content.find('a.image > img').click(function(){
    var scrollTop = window.scrollY
    var shade = $('<div class="shade" style="z-index:11">').click(function(e){
      if(e.target != shade[0]){ return }
      $(this).fadeOut(200, function(){
        $(this).remove()
      })
      $('.imgViewer-img').fadeOut(200, function(){
        $(this).remove()
      })
      $('html').css('overflow-y', '') 
      $('body').removeClass('fixed').css('top', '').css('width', '')
      $(window).scrollTop(scrollTop)
      $('html').css('scroll-behavior', '')
    })
    $(document.body).append(shade)
    $('body').addClass('fixed').css('top', -scrollTop + 'px').css('width', window.outerWidth)
    $('html').css('scroll-behavior', 'initial')

    function imgStatus(status = ''){
      var text = {
        loading: '图片加载中...',
        error: '图片加载失败',
        '': ''
      }
      shade.html(`<div style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); font-size:22px; color:white;">${text[status]}</div>`)
    }
    // 向遮罩添加关闭图片查看器的事件
    // 添加图片查看手势
    // 开启遮罩后要禁止页面滚动
    var {x, y, width, height} = this.getBoundingClientRect()

    var imgName = decodeURIComponent(this.src).replace(/^.+px-(.+)$/, '$1')

    imgStatus('loading')
    getImgUrl(imgName, function(url){
      if(url){
        var img = new Image()
        img.src = url
        img.onload = function(){
          imgStatus()
          img = $(img).css({
            width: width + 'px',
            position: 'fixed',
            top: y + 'px', left: x + 'px',
            transition: 'width, top, left, transform, 0.3s',
            zIndex: '12'
          })
          shade.append(img.addClass('imgViewer-img'))
          setTimeout(function(){
            var nWidth = img[0].naturalWidth
            var nHeight = img[0].naturalHeight
            var targetWidth = nWidth < (parseInt(window.innerWidth) * 0.8) ? nWidth : '80%'
            img.css({
              width: targetWidth,
              top: window.innerHeight / 2,
              left: window.innerWidth / 2,
              transform: 'translate(-50%, -50%)'
            })
            setTimeout(() =>{
              img.css('transition', '')
            }, 400)
            
            var imgEvent = new Hammer(img[0])
            imgEvent.get('pinch').set({ enable: true })
            imgEvent.on('pinchin', function(){
              var size = img.width() - 10
              if(size < window.innerWidth / 2){
                size = window.innerWidth / 2
              }
              img.width(size)
            }).on('press', function(e){
              e.preventDefault()
              img.animate({
                width: targetWidth,
                top: window.innerHeight / 2,
                left: window.innerWidth / 2,
                transform: 'translate(-50%, -50%)',
              }, 300)
            }).on('pinchout', function(){
              var size = img.width() + 10
              if(size > window.innerWidth * 1.5){
                size = window.innerWidth * 1.5
              }
              img.width(size)
            })

            var startPoint = {}
            var moveMode = false
            img.on('touchstart', function(e){
              e.stopPropagation()
              if(e.touches.length == 1){
                setTimeout(() =>{
                  moveMode = true
                }, 100)
              }
              e = e.touches[0]
              startPoint.x = e.pageX - e.target.offsetLeft
              startPoint.y = e.pageY - e.target.offsetTop

            }).on('touchmove', function(e){
              if(moveMode){
                e = e.touches[0]
                var left = e.pageX - startPoint.x + 'px'
                var top = e.pageY - startPoint.y + 'px'
                img.css({ left, top })
              }
            }).on('touchend', function(){
              moveMode = false
            })
          }, 200)
        }

        img.onerror = function(){
          imgStatus('error')
        }
      }else{
        imgStatus('error')
      }
    })

  })
}