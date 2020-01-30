import jss from 'jss'
import preset from 'jss-preset-default'
import externalImg from './base64Imgs/external'
import listPointImg from './base64Imgs/listPoint'
import EditImg from './base64Imgs/edit'
import styleVars from './styleVars'

jss.setup(preset())

// 已知问题：提供值范围的属性，加important后会报错，但报错在@global上面，提示不相关。目前的解决办法：给提供值范围的属性加important后要as any
export default jss.createStyleSheet({
  '@global': {
    // 消除移动端hoverPic中绝对定位带来的内容溢出问题
    '.PicHoverBox': {
      position: 'relative'
    },

    // 隐藏默认目录
    '#toc, .tochide': {
      display: 'none'
    },

    'html, body': {
      overflowX: 'hidden'
    },

    'h2, h3': {
      fontWeight: 'initial'
    },

    a: {
      textDecoration: 'none',
      color: '#0b0080',
      '-webkit-tap-highlight-color': 'transparent',
      transition: 'opacity 0.2s',
      
      '&:active': {
        opacity: 0.3
      },

      '&[target="_blank"]': {
        paddingRight: 16,
        backgroundImage: `url(${externalImg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 15,
        backgroundPosition: 'right 70%'
      },

      '&.new': {
        color: '#ba0000',

        '&:visited': {
          color: '#a55858'
        }
      }
    },

    dd: {
      marginLeft: '1em'
    },

    ul: {
      paddingLeft: '1em',

      '& li': {
        listStyle: `url(${listPointImg})`
      }
    },

    ol: {
      paddingLeft: 20
    },

    pre: {
      color: '#000',
      backgroundColor: '#f8f9fa',
      border: '1px solid #eaecf0',
      padding: '1em',
      lineHeight: '1.2',
      whiteSpace: 'initial',
      wordBreak: 'break-all'
    },

    table: {
      margin: '0 auto !important',
      float: 'none !important' as any,

      '&.infobox': {
        width: '100% !important',
        ...styleVars.baseShadow,
        marginBottom: '10px !important'
      },
    },

    '.infotemplatebox': {
      ...styleVars.baseShadow
    },

    '.section-heading': {
      fontSize: '140%',

      '& span': {
        marginLeft: 5
      }
    },

    '.thumb': {
      margin: '5px 0',

      '& img': {
        objectFit: 'cover'
      }
    },

    '.thumbinner': {
      ...styleVars.baseShadow,
      margin: '0 auto'
    },

    '.thumbcaption': {
      textAlign: 'center',
      lineHeight: 2,
      fontSize: 12,

      '&::before': {
        content: '""',
        display: 'block',
        width: 'auto',
        margin: '0 5px',
        height: 2,
        backgroundColor: '#ccc'
      }
    },

    '.wikitable': {
      backgroundColor: '#f8f9fa',
      color: '#222',
      margin: '1em 0',
      borderCollapse: 'collapse',

      [`& 
        > tr > th,
        * > tr > th
      `]: {
        backgroundColor: '#eaecf0',
        textAlign: 'center'
      },

      [`& 
        tr > th,
        > tr > td,
        * > tr > th,
        * > tr > td
      `]: {
        border: '1px #a2a9b1 solid',
        padding: '0.2em 0.4em'
      }
    },

    '.wide-table-wrapper': {
      overflowX: 'auto',
      overflowY: 'hidden',
      width: '100%',

      '& table': {
        width: 'max-content'
      }
    },

    'ul.gallery': {
      overflow: 'hidden',
      padding: 0,
      textAlign: 'center',
      fontSize: 0,

      '& li': {
        listStyle: 'none',
        display: 'inline-block',
        verticalAlign: 'top',
        width: 90,
        margin: 5,
        fontSize: 14,

        '&::before': {
          display: 'none'
        },

        '& img': {
          width: '100%',
          boxShadow: '0 0 3px #666'
        },

        '& p': {
          margin: 0,
          textAlign: 'center'
        }
      },
    },

    '.mw-collapsible': {
      margin: '5px 0 !important',

      '&:not(.mw-uncollapsed) > tbody > tr:not(:first-child)': {
        opacity: 0,
        display: 'none'
      },

      '& .collapseBtn': {
        float: 'right',
        cursor: 'pointer',
        color: '#0b0080'
      },
    },

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
      .navbox-subgroup,
      .navbox-title
    `]: {
      backgroundColor: '#c0ecc0'
    },

    '.navbox-even': {
      backgroundColor: '#f5fcf5'
    },

    // 隐藏编辑按钮两边的中括号
    '.mw-editsection-bracket': {
      display: 'none'
    },

    '.page-editBtn': {
      width: '1.2em',
      verticalAlign: 'text-bottom'
    },

    // Special命名空间无跳转链接样式
    'a[href^="/Special:"]': {
      color: 'black'
    },

    '.heimu': {
      backgroundColor: 'black',
      color: 'black',
      transition: 'all 0.3s',

      '& a': {
        color: 'black',
        transition: 'inherit'
      }
    },

    '.infoBox': {
      width: '100% !important',
      boxSizing: 'border-box',
      boxShadow: '0 0 5px #ccc',
      padding: 5,
      borderRadius: 5,
      margin: '10px 0',
      overflow: 'hidden',

      '& .infoBoxIcon': {
        float: 'left',

        '& > img': {
          width: '70px !important',
          height: 'auto !important'
        }
      }
    },

    '.navbox-collapse-btn': {
      float: 'right',
      fontSize: 16,
      padding: '0 5px',
      fontWeight: 'bold',
      transform: 'scale(1.3)'
    },

    '.bilibili-video-container': {
      border: 'none !important',

      '& .bilibili-title': {
        display: 'none'
      },

      '& .bilibili-video-title': {
        padding: 5,
        fontSize: 18,
        textAlign: 'center',
        color: 'white',
        backgroundColor: '#F45A8D !important',
        borderRadius: 3,
        marginBottom: 5,
        userSelect: 'none'
      },

      '& .bilibili-player': {
        width: '100%'
      }
    },
    
    '.acg-works-information': {
      width: '100%'
    },

    '.mw-parser-output .music163': {
      maxWidth: 'unset'
    },

    '.edit-btn': {
      display: 'inline-block',
      width: 30,
      height: 30,
      backgroundImage: `url(${EditImg})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100%'
    },

    'h2, h3, h4': {
      position: 'relative',
      boxSizing: 'border-box',
      paddingRight: 60
    },

    '.mw-editsection': {
      position: 'absolute',
      right: 10,
      bottom: 0
    }
  }
}).toString()