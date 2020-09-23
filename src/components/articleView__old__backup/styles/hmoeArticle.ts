import jss from 'jss'
import preset from 'jss-preset-default'

jss.setup(preset() as any)

const homeStyleSheet = jss.createStyleSheet({
  '@global': {
    '.mainpage-subject': {
      '& .mainpage-flex > .imgLinkWrapper': {
        flex: '1 !important'
      }
    },

    '.mainpage-page-intro': {
      textAlign: 'center',
      textIndent: '0 !important',
      padding: '0 !important',
      fontSize: 12
    },

    '.mainpage-banner-page, .mainpage-page': {
      height: 65,

      '& .mainpage-page-img': {
        height: '100%',
        objectFit: 'cover',
      }
    }
  }
}).toString()

export default homeStyleSheet