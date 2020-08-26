// 组件默认props设置，以as的形式使用
declare interface DefaultProps<Props> extends Function {
  defaultProps?: Partial<Props>
}

// Webview环境下的全局变量，只在Window接口下声明了，所以使用也要都写window前缀
// 实际上rn是没有window对象的，这么声明是因为所有注入webview的代码都使用了function.toString()的形式
declare interface Window extends __ArticleWebView.InjectedProperty {}
