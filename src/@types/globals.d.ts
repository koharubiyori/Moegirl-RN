// 全局变量
declare namespace NodeJS {
  interface Global extends __ReactNative.Global {
    $colors: { [Name in 'main' | 'dark' | 'light' | 'sub']: string }
    $avatarUrl: string
    $isVisibleLoading: boolean
    $drawer: {
      visible: { current: boolean }
      open (): void
      close (): void
    }
    $appNavigator: __Navigation.Navigation
    $dialog: __Dialog.__
  }
}

declare const $colors: NodeJS.Global['$colors']
declare const $avatarUrl: NodeJS.Global['$avatarUrl']
declare const $isVisibleLoading: NodeJS.Global['$isVisibleLoading']
declare const $drawer: NodeJS.Global['$drawer']
declare const $appNavigator: NodeJS.Global['$appNavigator']
declare const $dialog: NodeJS.Global['$dialog']

// Webview环境下的全局变量
declare interface Window {
  ReactNativeWebView: { postMessage: (msg: string) => void }
  _request (config: object, callback: (data: string) => void): void
  _request_id: number
  _appConfig: any
  _colors: NodeJS.Global['$colors']
}

declare interface DefaultProps<Props> extends Function {
  defaultProps?: Partial<Props>
}

declare module '~/../app.json' {
  export const date: string
  export const version: string
}