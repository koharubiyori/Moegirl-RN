import addCategoriesSection from './addCategoriesSection'
import addCopyright from './addCopyright'

// 接收脚本函数，字符串化并合并，用于注入到webview
export default [
  addCategoriesSection,
  addCopyright
].map(item => `(${item.toString()})()`).join(';')