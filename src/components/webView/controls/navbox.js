  // navbox适应
export default function(content){
  content.find('.navbox').each(parse)
  function parse () {
    $(this).find('tr[style="height:2px"], tr[style="height:2px;"]').remove()
    $(this).find('.navbox-group').each(function () {
      $(this).css('padding', '5px').parent().addClass('contentBlock')
      var btn = $('<div class="navbox-collapse-btn">+</div>').click(function (e) {
        var body = $(e.target).parent().parent()
        if (body[0].classList.contains('group-spread')) {
          $(this).text('+')
        } else {
          var borderColor = body.find('.navbox-group').eq(0).css('background-color')
          body.css({ borderColor })
          $(this).text('-')
        }
        body.toggleClass('group-spread')
      })
      $(this).append(btn)
    })
  }
}