export default function() {
  let viewBox = $('#articleContentContainer')
  
  viewBox.find('.mainpage-banner-page, .mainpage-subject .mainpage-page').each(function () {
    let aTag = $(this).find('.mainpage-page-intro > a').eq(0)
    let link = aTag.attr('href')
    let title = aTag.text()
    aTag.remove()
    $(this).wrap(`<a href="${link}">`).find('.mainpage-page-intro').append(`<span style="color:${window._themeColors.primary}">${title}</span>`)
  })
}