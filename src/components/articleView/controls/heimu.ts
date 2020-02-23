export default function() {
  let viewBox = $('#articleContentContainer')

  viewBox.find('.heimu').each(function () {
    if (window._appConfig.heimu) {
      $(this).data('unTapped', true)
      $(this).one('click', e => {
        $(this).addClass('heimu-tapped')
        if ($(this).data('unTapped')) {
          $(this).data('unTapped', false)
          e.preventDefault()
          e.stopPropagation()
        }
      })
    } else {
      $(this).addClass('heimu-tapped')
    }

  })
}