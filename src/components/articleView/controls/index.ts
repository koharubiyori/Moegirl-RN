import link from './link'
import collapsible from './collapsible'
import heimu from './heimu'
import music from './music'
import music163 from './music163'
import navbox from './navbox'
import tabs from './tabs'
import biliPlayer from './biliPlayer'
import toggleVisible from './toggleVisible'

const controlsCodes = [
  heimu, biliPlayer, collapsible, link, music, music163, navbox, tabs, toggleVisible
].reduce((result, item) => {
  result.script += item.script
  result.styleSheet += item.styleSheet + '\n'
  return result
}, {
  script: '',
  styleSheet: ''
})

export default controlsCodes