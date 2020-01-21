// navbox适应
export default function() {
  let viewBox = $('#webViewContainer')

  viewBox.find('.navbox').each(parse)
  function parse (this: HTMLElement) {
    $(this).find('tr[style="height:2px"], tr[style="height:2px;"]').remove()
    $(this).find('.navbox-group').each(function () {
      $(this).css('padding', '5px').parent().addClass('contentBlock')
      let btn = $('<div class="navbox-collapse-btn">+</div>').click(function (e) {
        let body = $(e.target).parent().parent()
        if (body[0].classList.contains('group-spread')) {
          $(this).text('+')
        } else {
          let borderColor = body.find('.navbox-group').eq(0).css('background-color')
          body.css({ borderColor })
          $(this).text('-')
        }
        body.toggleClass('group-spread')
      })
      $(this).append(btn)
    })
  }
}