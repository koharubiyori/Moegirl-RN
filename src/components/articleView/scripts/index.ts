import addCategoriesSection from './addCategoriesSection'

// 接收脚本函数，字符串化并合并，用于注入到webview
export const scriptCodeString = [
  addCategoriesSection
].map(item => `(${item.toString()})()`).join(';')