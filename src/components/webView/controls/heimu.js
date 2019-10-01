export default function(){
  var viewBox = $('#webViewContainer')

  viewBox.find('.heimu').each(function () {
    // if('isHeimuOn' in config && config.isHeimuOn){
    //   $(this).data('unTapped', true)
    //   $(this).one('click', e => {
    //     $(this).css('color', 'white').find('a').css('color', '#5BCEFF')
    //     if (e.target.tagName.toUpperCase() === 'A') {
    //       if ($(this).data('unTapped')) {
    //         $(this).data('unTapped', false)
    //       }
    //     }
    //   })
    // }else{
    //   $(this).css('color', 'white').find('a').css('color', '#5BCEFF')
    // }

    $(this).data('unTapped', true)
    $(this).one('click', e => {
      $(this).css('color', 'white').find('a').css('color', '#5BCEFF')
      if ($(this).data('unTapped')) {
        $(this).data('unTapped', false)
        e.preventDefault()
        e.stopPropagation()
      }
    })
  })
}