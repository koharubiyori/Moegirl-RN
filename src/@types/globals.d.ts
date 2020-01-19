/* eslint-disable no-unused-vars */

declare namespace NodeJS {
  interface Global extends __ReactNative.Global {
    $colors: { [Name in 'main' | 'dark' | 'light' | 'sub']: string }
    $avatarUrl: string
    $isVisibleLoading: boolean
    $drawer: {
      open (): void
      close (): void
    }
  }
}

declare const $colors: NodeJS.Global['$colors']
declare const $avatarUrl: NodeJS.Global['$avatarUrl']
declare const $isVisibleLoading: NodeJS.Global['$isVisibleLoading']
declare const $drawer: NodeJS.Global['$drawer']

declare interface DefaultProps<Props> extends Function {
  defaultProps?: Partial<Props>
}