import createControls from '../utils/createControl'

// tabs实现
export default createControls('tabs', () => {
  let viewBox = $('#articleContentContainer')

  viewBox.find('.Tabs').each(function () {
    let titles: string[] = []
    let theme = {
      before: {
        back: '#26ca9b',
        text: 'white'
      },
      after: {
        back: '#BDFFE6',
        text: '#26ca9b'
      }
    }

    if (window._settings.theme === 'night') {
      theme = {
        before: {
          back: window._colors.background,
          text: window._colors.text
        },
        after: {
          back: window._colors.placeholder,
          text: window._colors.accent
        }
      }
    }

    $(this).find('.TabLabelText').each(function () {
      titles.push(this.innerText)
      $(this).next('.TabContentText').hide()
      $(this).remove()
    })
    
    let nav = $('<div class="tabNav" style="text-align:center; margin-bottom:5px;">')
    for (let i = 0; i < titles.length; i++) {
      let btn = $(`<span class="tabBtn" style="background:${theme.before.back}; color:${theme.before.text};">${titles[i]}</span>`)
        .click(function () {
          $(this).parent().find('.tabBtn').css({
            background: theme.before.back,
            color: theme.before.text
          }).eq(i).css({
            background: theme.after.back,
            color: theme.after.text
          })
          $(this).parent().next('.Tabs').find('.TabContentText').hide().eq(i).show()
        })
      nav.append(btn)
    }
    
    $(this).before(nav)
    $(this).prev('.tabNav').find('.tabBtn').eq(0).css({
      background: theme.after.back,
      color: theme.after.text
    })
    $(this).find('.TabContentText').eq(0).show()
  })
}, {
  '.tabNav': {
    textAlign: 'center', 
    marginBottom: 5
  },

  '.tabBtn': {
    display: 'inline-block', 
    height: 24,
    lineHeight: '24px',
    borderRadius: 10,
    margin: '5px 2.5px',
    padding: '0 8px'
  }
})