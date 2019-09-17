import link from './link'

// 引入这个字符串，注入
export const controlsCodeString = [
  link
].map(item => `(${item.toString()})()`).join(';')