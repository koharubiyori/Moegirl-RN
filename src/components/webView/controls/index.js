import link from './link'
import heimu from './heimu'

// 引入这个字符串，注入
export const controlsCodeString = [
  link, heimu,
].map(item => `(${item.toString()})()`).join(';')