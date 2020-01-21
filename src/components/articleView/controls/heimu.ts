export default function() {
  let viewBox = $('#webViewContainer')

  viewBox.find('.heimu').each(function () {
    if (window._appConfig.heimu) {
      $(this).data('unTapped', true)
      $(this).one('click', e => {
        $(this).css('color', 'white').find('a').css('color', '#5BCEFF')
        if ($(this).data('unTapped')) {
          $(this).data('unTapped', false)
          e.preventDefault()
          e.stopPropagation()
        }
      })
    } else {
      $(this).css('color', 'white').find('a').css('color', '#5BCEFF')
    }

  })
}