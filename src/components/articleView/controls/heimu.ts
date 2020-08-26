import createControls from '../utils/createControl'

export default createControls('黑幕', () => {
  let viewBox = $('#articleContentContainer')
  viewBox.find('.heimu').each(function () {
    if (window._settings.heimu) {
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
}, {
  '.heimu': {
    backgroundColor: 'black',
    color: 'black',
    transition: 'all 0.3s',

    '& a': {
      color: 'black',
      transition: 'inherit'
    }
  },

  '.heimu-tapped': {
    color: 'white',

    '& a': {
      color: '#5BCEFF'
    }
  },
})