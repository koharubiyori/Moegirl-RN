/* eslint-disable no-unused-vars */

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

declare interface Window {
  _request (config: object, callback: () => {}): void
  _request_id: number
}

declare interface DefaultProps<Props> extends Function {
  defaultProps?: Partial<Props>
}