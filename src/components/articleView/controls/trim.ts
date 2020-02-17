export default function() {
  let viewBox = $('#articleContentContainer')

  let clientWidth = document.body.clientWidth
  // 防止图片越界
  viewBox.find('img').each(function () {
    if (parseInt($(this).attr('width')!) > clientWidth - 20) {
      $(this).attr('width', clientWidth - 20).removeAttr('height')
    }
  })

  // 防止thumb越界
  viewBox.find('.thumbinner').each(function () {
    if (parseInt($(this).css('width')! || '0') > clientWidth - 20) {
      $(this).css('width', clientWidth - 20)
    }
  })

  // 干掉gallery默认样式
  viewBox.find('ul.gallery *').each(function () {
    $(this).removeAttr('style')
  })

  // 宽表格适应
  viewBox.find('table').each(function () {
    if ($(this).closest('.navbox').length) { return }
    if (isTemplateHide(this)) { return }
    $(this).wrap('<div class="wide-table-wrapper"></div>')
      .on('touchend', function (e) { e.stopPropagation() })
  })

  function isTemplateHide(element: HTMLElement) {
    let tr = $(element).children('tbody').children('tr')
    if ($(element).hasClass('mw-collapsible') && tr.length === 2) {
      if ($(tr[0]).children('th').length === 1 && $(tr[1]).children('td').length === 1) {
        return true
      }
    }
    return false
  }

  // 解决li中图片出界问题
  viewBox.find('ul:not(.gallery) > li .thumb').each(function () {
    $(this).find('.thumbinner').removeAttr('style')
    let thumbBlock = $(this)
    let parent = thumbBlock.parent().parent()
    parent.after(thumbBlock)
  })

  viewBox.find('a[href^="#cite_ref"]').text('[跳转至目标]').css('color', window._colors.accent)
}
