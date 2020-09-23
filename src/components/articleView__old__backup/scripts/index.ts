import trim from './trim'
import addCategoriesSection from './addCategoriesSection'
import addCopyright from './addCopyright'
import mainpageThemeColor from './mainpageThemeColor'

// 接收脚本函数，字符串化并合并，用于注入到webview
export default [
  trim,
  addCategoriesSection,
  addCopyright,
  mainpageThemeColor
].map(item => `(${item.toString()})()`).join(';')