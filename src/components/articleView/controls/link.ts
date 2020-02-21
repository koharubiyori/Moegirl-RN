export default function() {
  let viewBox = $('#articleContentContainer')

  viewBox.find('.mw-editsection').each(function (e) {
    // 编辑按钮替换图片
    let link = $(this).find('a').eq(0).attr('href')
    $(this).addClass('page-editBtn').html(`<a href="${link}" class="edit-btn page-editBtn">`)
  })

  // 拦截点击链接
  viewBox.on('click', 'a', function(e) {
    e.preventDefault()

    // 配合黑幕的第一次点击不跳转
    if ($(this).parent('.heimu').data('unTapped')) {
      $(this).parent('.heimu').data('unTapped', false)
      return
    }

    // 编辑按钮导向
    if (this.classList.contains('page-editBtn')) {
      let page = decodeURIComponent(this.href.match(/title=(.+?)(&|$)/)[1])
      let section = this.dataset.section
      if (!section) {
        section = parseInt(this.href.match(/&section=(.+?)(&|$)/)[1])
      }

      return window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'onPressEdit', data: { page, section } }))
    }

    // 一般链接导向
    let link = ($(e.target).attr('href') || $(e.target).parent('a').attr('href') || $(this).attr('href'))!
    let type = 'inner'
    if (/^\/File:/.test(link)) {
      return window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'onPressImage', data: { name: decodeURIComponent(link.replace(/^\/File:/, '')) } }))
    } else if (/^#cite_note-/.test(link)) {
      let content = $(link).text().replace(/^\[跳转至目标\]/, '').trim()
      if (content.length > 400) { // 文字过多dialog会装不下
        document.querySelector(link)!.scrollIntoView()
        return window.scrollTo(0, window.scrollY - 60)
      } else {
        return window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'onPressNote', data: { anchor: link, content } }))
      }
    } else if (/^#/.test(link)) {
      document.querySelector(link)!.scrollIntoView()
      return window.scrollTo(0, window.scrollY - 60)
    } else if (link.indexOf('redlink=1') >= 0) {
      type = 'notExists'
    } else if (/^\//.test(link)) {
      link = decodeURIComponent(link.substring(1))
    } else if (/^https?:\/\//.test(link)) {
      type = 'outer'
    }

    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'onPressLink', data: { link, type } }))
  })
}
