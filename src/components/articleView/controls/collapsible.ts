import createControls from '../utils/createControl'

export default createControls('折叠面板', () => {
  let viewBox = $('#articleContentContainer')

  viewBox.find('.mw-collapsible').each(function () {
    let btnText = this.classList.contains('mw-uncollapsed') ? '[折叠]' : '[展开]'
    let collapseBtn = $(`<div class="collapseBtn">${btnText}</div>`).click(function (e) {
      let body = $(e.target).closest('.mw-collapsible')
      if (body[0].classList.contains('mw-uncollapsed')) {
        collapseBtn.text('[展开]')
      } else {
        collapseBtn.text('[折叠]')
      }
      body.toggleClass('mw-uncollapsed')
    })
    let addTarget = $(this).find('tr:first-child > th:first-child, tr:first-child > td:first-child')
    addTarget[0] && addTarget.eq(0).append(collapseBtn)
  })
}, {
  '.mw-collapsible': {
    margin: '5px 0 !important',

    '&.mw-uncollapsed': {
      maxWidth: '100%',
    },

    '&:not(.mw-uncollapsed) > tbody > tr:not(:first-child)': {
      opacity: 0,
      display: 'none'
    },

    '& .collapseBtn': {
      float: 'right',
      color: '#0b0080',
      marginLeft: 5
    },

    '& .image > img': {
      maxWidth: '100%',
      height: 'auto'
    },

    '& .tl-outerImage': {
      width: 'auto !important',

      '& > .img': {
        width: '100%'
      }
    }
  },
})