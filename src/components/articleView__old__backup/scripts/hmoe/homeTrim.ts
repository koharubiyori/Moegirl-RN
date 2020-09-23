export default function() {
  let viewBox = $('#articleContentContainer')
  
  viewBox.find('.mainpage-banner-page, .mainpage-subject .mainpage-page').each(function () {
    let aTag = $(this).find('.mainpage-page-intro > a').eq(0)
    let link = aTag.attr('href')
    let title = aTag.text()
    aTag.remove()
    $(this).wrap(`<a class="imgLinkWrapper" href="${link}">`).find('.mainpage-page-intro').append(`<span style="color:${window._colors.primary}">${title}</span>`)
  })

  viewBox.find('.mainpage-flex > .imgLinkWrapper').css('flex', 1)
}