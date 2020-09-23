import createControls from '../utils/createControl'

// b站播放器
export default createControls('b站播放器', () => {
  let viewBox = $('#articleContentContainer')
  const i = window._i.controls.biliPlayer

  viewBox.find('.wikitable.bilibili-video-container').each(function () {
    let avId = parseInt($(this).data('id').toString().replace('av', ''))
    let page = $(this).data('page')

    let title = $(`<div class="bilibili-video-title">${i.loading}</div>`)
    title.click(function() {
      window._postRnMessage('onPressBiliVideo', { avId: avId as any as string, page })
    })

    let titlePhoneEvent = new Hammer(title[0])
    titlePhoneEvent.on('press', function() {
      window._postRnMessage('vibrate')
      window._postRnMessage('openApp', { url: 'https://www.bilibili.com/video/' + avId })
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
          title.text(res.code === -404 ? i.removed : i.netErr)
        } else {
          title.text(res.data.title)
        }
      })
    }

    $(this).css({
      display: 'block',
      width: '100%'
    })

    $(this).append(title)
  })
}, {
  '.bilibili-video-container': {
    border: 'none !important',
    borderRadius: 5,

    '& .bilibili-title': {
      display: 'none'
    },

    '& .bilibili-video-title': {
      padding: 5,
      fontSize: 18,
      textAlign: 'center',
      color: 'white',
      backgroundColor: '#F45A8D !important',
      borderRadius: 3,
      marginBottom: 5,
      userSelect: 'none'
    },

    '& .bilibili-player': {
      width: '100%'
    }
  },
})