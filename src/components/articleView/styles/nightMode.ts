import jss from 'jss'
import preset from 'jss-preset-default'
import { colors } from '~/theme'
import Color from 'color'

jss.setup(preset())

const { night } = colors
const linkColor = Color(night.accent).darken(0.1).toString()

export default jss.createStyleSheet({
  '@global': {
    body: {
      backgroundColor: night.background,
      color: night.text
    },

    a: {
      color: linkColor,
      textDecoration: 'none',      

      '&[href^="/Special:"]': {
        color: night.text
      },
  
      '&.new': {
        color: '#D96768',
      }
    },

    '.mainpage-title': {
      backgroundColor: night.placeholder,
      color: night.text,
      borderRadius: 5
    },

    '.mainpage-box': {
      boxShadow: 'none',
      backgroundColor: night.surface,
      borderRadius: 10
    },

    'table.infobox[align="right"] ': {
      [`& > tbody > tr:first-child > td,
        th[colspan="3"]
      `]: {
        backgroundColor: night.primary + '!important',
        color: night.text + '!important'
      },

      '& td[width="80px"], td[style^="min-width: 80px;"]': {
        backgroundColor: night.primary
      }
    },

    '.heimu-tapped': {
      color: night.text,

      '& a': {
        color: linkColor
      }
    },

    '.wikitable': {
      backgroundColor: night.primary,
      color: night.text,
      margin: '1em 0',
      borderCollapse: 'collapse',

      [`& 
        > tr > th,
        * > tr > th
      `]: {
        backgroundColor: Color(night.placeholder).darken(0.3).toString(),
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
      },
    },

    'table.navbox': {
      '& a': {
        color: linkColor + '!important',
        '-webkit-text-fill-color': linkColor + '!important'
      },

      '& .navbox-title *': {
        color: night.text + '!important',
        '-webkit-text-fill-color': night.text + '!important'
      },
      
      '& .mw-collapsible.navbox-subgroup': {
        backgroundColor: night.background + '!important',
        color: night.text + '!important',
        '-webkit-text-fill-color': night.text + '!important'
      }
    },

    '.navbox-title, table.navbox th': {
      backgroundColor: night.primary + '!important',
      backgroundImage: 'none !important',
      color: night.text + '!important',
      '-webkit-text-fill-color': night.text + '!important'
    },

    [`.navbox-abovebelow,
      .navbox-group,
      .navbox-title
    `]: {
      backgroundColor: night.primary + '!important',
      color: night.text + '!important',
      '-webkit-text-fill-color': night.text + '!important'
    },

    '.navbox-even': {
      backgroundColor: night.background + '!important',
      color: night.text + '!important',
      '-webkit-text-fill-color': night.text + '!important'
    },

    '.infotemplatebox': {
      '& tbody > tr:nth-child(2) > td, tbody > tr:nth-last-child(2) > th': {
        backgroundColor: night.primary + '!important',
      },
    },

    // hide模板
    '.mw-collapsible.wikitable': {
      '& > tbody > tr:first-child > th': {
        backgroundColor: night.primary,
      },

      '& .collapseBtn:not(foo)': {
        color: linkColor
      }
    }
  }
}).toString()