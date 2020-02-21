import jss from 'jss'
import preset from 'jss-preset-default'

jss.setup(preset())

export default jss.createStyleSheet({
  '@global': {
    [`.mainpage-newpage,
      .mainpage-donate-and-ads,
      .mainpage-help,
      .mainpage-needHelp
    `]: {
      display: 'none'
    },

    '.mainpage-counter-container': {
      '& > p:first-of-type': {
        display: 'none'
      }
    },

    '.mainpage-DYK': {
      '& .mainpage-flex:first-of-type': {
        display: 'block'
      },
    },

    '.mainpage-page-img': {
      width: '100% !important'
    },

    '.mainpage-page-intro': {
      textAlign: 'center',
      margin: '0 10px'
    }
  }
}).toString()