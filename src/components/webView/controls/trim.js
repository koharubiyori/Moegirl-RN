export default function(content){
  var clientWidth = document.body.clientWidth
  // 防止图片越界
  content.find('img').each(function () {
    if ($(this).attr('width') > clientWidth - 20) {
      $(this).attr('width', clientWidth - 20).removeAttr('height')
    }
  })

  // 防止thumb越界
  content.find('.thumbinner').each(function () {
    if (parseInt($(this).css('width') || 0) > clientWidth - 20) {
      $(this).css('width', clientWidth - 20)
    }
  })

  // 干掉gallery默认样式
  content.find('ul.gallery *').each(function () {
    $(this).removeAttr('style')
  })
  
  // 宽表格适应
  content.find('table').each(function () {
    if ($(this).closest('.navbox').length) { return }
    $(this).wrap('<div style="overflow-x:auto; overflow-y:hidden; width:100%"></div>')
      .on('touchend', function (e) { e.stopPropagation() })
  })

  // 解决li中图片出界问题
  content.find('ul:not(.gallery) > li .thumb').each(function () {
    $(this).find('.thumbinner').removeAttr('style')
    var thumbBlock = $(this)
    var parent = thumbBlock.parent().parent()
    parent.after(thumbBlock)
  })
}