// 全局变量

declare namespace NodeJS { 
  interface Global extends __ReactNative.Global {
    $avatarUrl: string
    $isVisibleLoading: boolean
    $drawer: {
      visible: { current: boolean }
      open (): void
      close (): void
      setLock (value: boolean): void
    }
    $appNavigator: __Navigation.Navigation
    $dialog: __Dialog.__
  }
}

declare const $avatarUrl: NodeJS.Global['$avatarUrl']
declare const $isVisibleLoading: NodeJS.Global['$isVisibleLoading']
declare const $drawer: NodeJS.Global['$drawer']
declare const $appNavigator: NodeJS.Global['$appNavigator']
declare const $dialog: NodeJS.Global['$dialog']

// Webview环境下的全局变量，只在Window接口下声明了，所以使用也要都写window前缀
declare interface Window {
  ReactNativeWebView: { postMessage: (msg: string) => void }
  _request (config: object, callback: (data: any) => void): void
  _request_id: number
  _appConfig: __AppUserConfig.__
  _colors: __Theme.Colors
  _themeColors: __Theme.ThemeColors
  _categories: string[]
  _articleTitle: string
}

declare interface DefaultProps<Props> extends Function {
  defaultProps?: Partial<Props>
}