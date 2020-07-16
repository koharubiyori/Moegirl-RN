import jss from 'jss'
import preset from 'jss-preset-default'

jss.setup(preset() as any)

const hmoeHomeStyleSheet = jss.createStyleSheet({
  '@global': {
    [`.mainpage-newpage,
      .mainpage-donate-and-ads,
      .mainpage-help,
      .mainpage-needHelp
    `]: {
      display: 'none'
    },

    '.mainpage-headtitle:hover, .mainpage-column > *:hover': {
      margin: '0.5em !important',
      boxShadow: '1px 1px 1px 1px #ededde !important',
      backgroundColor: 'transparent !important'
    },

    '.mainpage-counter-container': {
      '& > p:first-of-type': {
        display: 'none'
      }
    },

    '.mainpage-column': {
      '& p': {
        textIndent: 'initial !important'
      }
    },

    '.mainpage-DYK': {
      display: 'none'
    },

    '.mainpage-page': {
      height: 85
    },

    '.mainpage-page-img': {
      width: '100% !important',
      height: 85,
      objectFit: 'cover'
    },
    
    '.mainpage-page-intro': {
      textAlign: 'center',
      margin: '0 10px'
    },
  }
}).toString()

export default hmoeHomeStyleSheet