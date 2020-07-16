import createControls from '../utils/createControl'

// navbox适应
export default createControls('navbox', () => {
  let viewBox = $('#articleContentContainer')

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
}, {
  'table.navbox': {
    border: '1px #aaa solid',
    padding: 1,
    textAlign: 'center',
    width: '100%',
    fontSize: '90%',
    margin: '10px 0 !important',

    // image模板适应
    '& li': {
      listStyle: 'none'
    },

    '& .mw-collapsible': {
      margin: '0 !important'
    },

    '& .navbar, .navbox-list': {
      display: 'none',

      '&[colspan="2"]': {
        display: 'initial'
      }
    },

    '& tr.group-spread': {
      width: 'calc(100% - 5px)',
      display: 'table',
      borderLeftWidth: 15,
      borderLeftStyle: 'solid',
      boxSizing: 'border-box',

      '& > .navbox-list': {
        display: 'table-row'
      }
    },

    '& .navbox-group > div': {
      display: 'inline-block'
    },

    '& .navbox-group:first-child': {
      textAlign: 'center',
      whiteSpace: 'nowrap',

      '& .navbox-collapse-btn': {
        float: 'none'
      }
    },
    
    // 取消查论编块的占位
    '& div[style="float:left; width:6em;text-align:left;"], .noprint.plainlinks.hlist.navbar.nomobile': {
      display: 'none'
    },

    // 嵌套大家族模板显示
    '& > tbody > tr > td > table > tbody > tr:not([style="display: inline-table; margin: 5px;"]) > td': {
      display: 'block'
    },

    '& div[style="text-align:center; line-height:10pt"]': {
      lineHeight: 'inherit !important',
    },

    '& .mw-collapsible.mw-collapsed tr': {
      opacity: 1
    },

    '& .contentBlock': {
      margin: 5,
      display: 'inline-table',
      borderLeft: 'none',
      boxSizing: 'initial',

      '& > .navbox-list': {
        display: 'none'
      }
    },

    '& .group-spread .navbox-collapse-btn': {
      float: 'right !important' as any
    },

    '& div[style="word-spacing: 100px;"]': {
      wordSpacing: 'initial !important',

      '& > small a:nth-child(2)': {
        margin: '0 20px'
      },

      '& .navbox-title::before': {
        content: '""',
        display: 'inline-block',
        width: '3em'
      }
    },

    '& .mw-collapsible.navbox-subgroup': {
      backgroundColor: 'white',

      '& .navbox-title': {
        padding: 5,
        position: 'relative',

        '& .collapseBtn': {
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 5,
          display: 'flex',
          alignItems: 'center'
        },
      }
    }
  },

  '.navbox-title, table.navbox th': {
    backgroundColor: '#a5e4a5',
    lineHeight: 1.5
  },

  [`.navbox-abovebelow,
    .navbox-group,
    .navbox-title
  `]: {
    backgroundColor: '#c0ecc0'
  },

  '.navbox-even': {
    backgroundColor: '#f5fcf5'
  },

  '.navbox-collapse-btn': {
    float: 'right',
    fontSize: 16,
    padding: '0 5px',
    fontWeight: 'bold',
    transform: 'scale(1.3)'
  },
})