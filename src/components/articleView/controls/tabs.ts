// tabs实现
export default function() {
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

    if (window._appConfig.theme === 'night') {
      theme = {
        before: {
          back: window._colors.night.primary,
          text: window._colors.night.text
        },
        after: {
          back: window._colors.night.accent,
          text: window._colors.night.onSurface
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
      let btn = $(`<span class="tabBtn" style="display:inline-block; height:24px; line-height:24px; border-radius:10px; background:${theme.before.back}; color:${theme.before.text}; margin:5px 2.5px; padding:0 8px;">${titles[i]}</span>`)
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
}