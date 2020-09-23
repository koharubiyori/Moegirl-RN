import createControls from '../utils/createControl'

export default createControls('链接处理', () => {
  let viewBox = $('#articleContentContainer')

  viewBox.find('.mw-editsection').each(function (e) {
    // 编辑按钮替换图片
    let link = $(this).find('a').eq(0).attr('href')
    $(this).html(`<a href="${link}" class="edit-btn page-editBtn">`)
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

      return window._postRnMessage('onPressEdit', { page, section })
    }

    // 一般链接导向
    let link = ($(e.target).attr('href') || $(e.target).parent('a').attr('href') || $(this).attr('href'))!
    let displayTitle = (
      $(e.target).attr('title') || 
      $(e.target).find('> img').eq(0).attr('alt') ||
      $(e.target).parent('a').attr('title') || 
      $(this).attr('title') ||
      $(this).find('> img').eq(0).attr('alt')
    )!
    let type: 'inner' | 'outer' | 'notExists' = 'inner'
    link = decodeURIComponent(link)
    if (/^\/([Ff]ile|文件):/.test(link)) {
      return window._postRnMessage('onPressImage', { type: 'name', name: link.replace(/^\/([Ff]ile|文件):/, '') })
    } else if (/^#cite_note-/.test(link)) {
      document.querySelector(link)!.scrollIntoView()
      window.scrollTo(0, window.scrollY - 120)
      $(link).addClass('activeNote')
      setTimeout(() => $(link).removeClass('activeNote'), 2000)
      return
    } else if (/^#/.test(link)) {
      document.querySelector(link)!.scrollIntoView()
      window.scrollTo(0, window.scrollY - 120)
      $(link).addClass('activeNote')
      setTimeout(() => $(link).removeClass('activeNote'), 2000)
      return
    } else if (link.indexOf('redlink=1') >= 0) {
      type = 'notExists'
    } else if (/^\//.test(link)) {
      link = link.substring(1)
    } else if (/^https?:\/\//.test(link)) {
      type = 'outer'
    }

    if (/^([Ss]pecial|特殊):/.test(link)) { return }
    
    return window._postRnMessage('onPressLink', { link, type, displayTitle })
  })

  $('head').append(`<style>
    @keyframes flash {
      from {
        background-color: ${window._colors.accent};
      }

      to {
        background-color: transparent;
      }
    }

    .activeNote {
      animation: flash 2s;
    }
  </style>`)

  // 给外链图片添加点击显示大图
  $('img:not([data-file-width][data-file-height])').click(function() {
    window._postRnMessage('onPressImage', { type: 'url', url: $(this).attr('src')! })
  })
}, {

})