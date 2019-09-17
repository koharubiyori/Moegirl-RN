// collapsible实现
export default function(content){
  content.find('.mw-collapsible').each(function () {
    var btnText = this.classList.contains('mw-uncollapsed') ? '[折叠]' : '[展开]'
    var collapseBtn = $(`<div class="collapseBtn">${btnText}</div>`).click(function (e) {
      var body = $(e.target).closest('.mw-collapsible')
      if (body[0].classList.contains('mw-uncollapsed')) {
        collapseBtn.text('[展开]')
      } else {
        collapseBtn.text('[折叠]')
      }
      body.toggleClass('mw-uncollapsed')
    })
    var addTarget = $(this).find('tr:first-child > th:first-child')
    addTarget[0] && addTarget.eq(0).append(collapseBtn)
  })
}
