import link from './link'
import collapsible from './collapsible'
import heimu from './heimu'
import music from './music'
import music163 from './music163'
import navbox from './navbox'
import tabs from './tabs'
import trim from './trim'

// 接收控件函数，字符串化并合并，用于注入到webview
export const controlsCodeString = [
  link, heimu, collapsible, music, music163, navbox, tabs, trim
].map(item => `(${item.toString()})()`).join(';')